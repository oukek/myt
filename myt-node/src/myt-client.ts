import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import * as net from 'net';

// 全局Socket管理器
export class OukekMytSocket {
  private static instance: OukekMytSocket;
  private socket: net.Socket | null = null;
  private serverProcess: ChildProcess | null = null;
  private socketHost = '127.0.0.1';
  private socketPort = 8899;
  private responseCallbacks: Map<string, { resolve: Function, reject: Function }> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private messageBuffer = '';
  private requestId = 0;
  private pythonExecutable: string;
  private executablePath: string;
  
  // 存储已初始化的设备
  private initializedDevices: Set<string> = new Set();

  private constructor() {
    // 根据操作系统选择可执行文件名
    this.pythonExecutable = process.platform === 'win32' 
      ? 'myt-python.exe' 
      : 'myt-python';
    
    // 获取可执行文件路径
    this.executablePath = join(__dirname, 'python', this.pythonExecutable);
  }

  public static getInstance(): OukekMytSocket {
    if (!OukekMytSocket.instance) {
      OukekMytSocket.instance = new OukekMytSocket();
    }
    return OukekMytSocket.instance;
  }
  
  /**
   * 启动Python服务器并连接socket
   */
  public async connect(port?: number): Promise<void> {
    // 如果已连接，直接返回
    if (this.socket && this.socket.readyState === 'open') {
      return Promise.resolve();
    }

    // 如果已经有连接尝试正在进行，则返回该Promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // 如果指定了端口，则使用指定的端口
    if (port !== undefined && port > 0) {
      this.socketPort = port;
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      try {
        // 启动Python服务器进程
        console.log(`启动Python服务器: ${this.executablePath} ${this.socketPort}`);
        this.serverProcess = spawn(this.executablePath, [this.socketPort.toString()], {
          stdio: ['ignore', 'pipe', 'pipe']
        });

        // 监听Python服务器的输出用于调试
        this.serverProcess.stdout?.on('data', (data: Buffer) => {
          console.log(`Python服务器输出: ${data.toString()}`);
        });

        this.serverProcess.stderr?.on('data', (data: Buffer) => {
          console.error(`Python服务器错误: ${data.toString()}`);
        });

        this.serverProcess.on('error', (err: Error) => {
          console.error(`Python服务器启动错误: ${err.message}`);
          reject(new Error(`启动Python服务器失败: ${err.message}`));
        });

        this.serverProcess.on('close', (code: number | null) => {
          console.log(`Python服务器已退出，退出码: ${code}`);
          this.socket?.destroy();
          this.socket = null;
        });

        // 等待Python服务器启动（给予一定的启动时间）
        setTimeout(() => {
          // 创建socket连接
          this.socket = new net.Socket();

          // 设置socket事件处理
          this.socket.on('data', (data) => {
            this.handleSocketData(data);
          });

          this.socket.on('error', (err) => {
            console.error(`Socket错误: ${err.message}`);
            reject(new Error(`Socket连接错误: ${err.message}`));
          });

          this.socket.on('close', () => {
            console.log('Socket连接已关闭');
            // 关闭所有待处理的请求
            for (const callback of this.responseCallbacks.values()) {
              callback.reject(new Error('Socket连接已关闭'));
            }
            this.responseCallbacks.clear();
            this.initializedDevices.clear();
          });

          // 连接socket服务器
          this.socket.connect(this.socketPort, this.socketHost, () => {
            console.log(`已连接到Python服务器 ${this.socketHost}:${this.socketPort}`);
            resolve();
          });
        }, 1000); // 等待1秒让服务器启动
      } catch (e) {
        this.connectionPromise = null;
        if (e instanceof Error) {
          reject(e);
        } else {
          reject(new Error('发生未知错误'));
        }
      }
    });

    try {
      await this.connectionPromise;
      return Promise.resolve();
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  /**
   * 处理从socket接收到的数据
   */
  private handleSocketData(data: Buffer): void {
    // 将接收到的数据追加到缓冲区
    this.messageBuffer += data.toString();

    // 根据换行符分割消息
    const messages = this.messageBuffer.split('\n');
    
    // 如果没有完整的消息，就等待更多数据
    if (messages.length <= 1) {
      return;
    }

    // 处理完整的消息
    this.messageBuffer = messages.pop() || '';
    
    for (const message of messages) {
      if (!message.trim()) continue;
      
      try {
        const response = JSON.parse(message);
        const id = response.id?.toString();
        console.log('收到响应:', response);
        
        if (id && this.responseCallbacks.has(id)) {
          const callback = this.responseCallbacks.get(id)!;
          
          if (response.error) {
            callback.reject(new Error(response.error));
          } else {
            callback.resolve(response.result);
          }
          
          this.responseCallbacks.delete(id);
        } else {
          console.warn('收到未知响应:', response);
        }
      } catch (e) {
        console.error('解析响应失败:', e);
      }
    }
  }

  /**
   * 发送请求到服务器并等待响应
   */
  async sendRequest(method: string, params: any[] = [], timeoutMs: number = 10000): Promise<any> {
    // 检查服务器是否已初始化
    if (!this.socket) {
      throw new Error('Server not initialized, please call init() first');
    }

    return new Promise((resolve, reject) => {
      try {
        // 生成唯一请求ID
        const requestId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        
        // 创建请求对象
        const request = {
          method,
          params,
          id: requestId
        };

        // 将请求转换为JSON字符串
        const requestStr = JSON.stringify(request) + '\n';

        // 存储回调函数
        this.responseCallbacks.set(requestId, {
          resolve,
          reject
        });

        // 设置超时处理
        setTimeout(() => {
          if (this.responseCallbacks.has(requestId)) {
            this.responseCallbacks.delete(requestId);
            reject(new Error(`Request timed out after ${timeoutMs}ms`));
          }
        }, timeoutMs);

        // 发送请求
        if (this.socket && this.socket.writable) {
          this.socket.write(requestStr);
        } else {
          reject(new Error('Socket is not writable'));
          this.responseCallbacks.delete(requestId);
        }
      } catch (error) {
        reject(new Error(`Failed to send request: ${error}`));
      }
    });
  }

  /**
   * 检查设备是否已初始化
   */
  public isDeviceInitialized(deviceIp: string): boolean {
    return this.initializedDevices.has(deviceIp);
  }

  /**
   * 标记设备为已初始化
   */
  public markDeviceAsInitialized(deviceIp: string): void {
    this.initializedDevices.add(deviceIp);
  }

  /**
   * 标记设备为未初始化
   */
  public markDeviceAsUninitialized(deviceIp: string): void {
    this.initializedDevices.delete(deviceIp);
  }

  /**
   * 关闭连接
   */
  public async disconnect(): Promise<void> {
    // 关闭所有设备连接
    try {
      for (const deviceIp of this.initializedDevices) {
        try {
          await this.sendRequest('close_device', [deviceIp]);
        } catch (e) {
          console.error(`关闭设备 ${deviceIp} 连接失败:`, e);
        }
      }
    } catch (e) {
      console.error('关闭设备连接失败:', e);
    }

    // 清除已初始化设备列表
    this.initializedDevices.clear();

    // 关闭服务器
    if (this.socket && this.socket.writable) {
      try {
        await this.sendRequest('shutdown_server', []);
      } catch (e) {
        console.error('关闭服务器失败:', e);
      }
    }

    // 清除所有回调函数
    this.responseCallbacks.clear();

    // 关闭socket连接
    if (this.socket) {
      // 移除所有事件监听器以防止内存泄漏
      this.socket.removeAllListeners('data');
      this.socket.removeAllListeners('error');
      this.socket.removeAllListeners('close');
      
      this.socket.destroy();
      this.socket = null;
    }

    // 如果服务器进程还在运行，给它一点时间自己退出
    if (this.serverProcess) {
      try {
        // 移除所有事件监听器
        this.serverProcess.removeAllListeners('error');
        this.serverProcess.removeAllListeners('close');
        
        // 尝试终止进程
        setTimeout(() => {
          if (this.serverProcess) {
            this.serverProcess.kill('SIGTERM');
            this.serverProcess = null;
          }
        }, 2000);
      } catch (e) {
        console.error('终止Python服务器进程失败:', e);
      }
    }

    this.connectionPromise = null;
  }
}

export class OukekMyt {
  private deviceIp: string;
  private devicePort: number;
  private deviceTimeout: number;
  private socketManager: OukekMytSocket;
  private initialized: boolean = false;

  constructor(deviceIp: string, devicePort: number, deviceTimeout: number) {
    this.deviceIp = deviceIp;
    this.devicePort = devicePort;
    this.deviceTimeout = deviceTimeout;
    this.socketManager = OukekMytSocket.getInstance();
  }

  /**
   * 确保设备已初始化
   */
  private async ensureInitialized(): Promise<void> {
    // 如果已经初始化，则直接返回
    if (this.socketManager.isDeviceInitialized(this.deviceIp)) {
      return;
    }

    // 否则调用init方法初始化设备
    const result = await this.socketManager.sendRequest('init', [this.deviceIp, this.devicePort, this.deviceTimeout]);
    
    if (result === true) {
      // 标记设备为已初始化
      this.socketManager.markDeviceAsInitialized(this.deviceIp);
    } else {
      throw new Error(`初始化设备 ${this.deviceIp} 失败`);
    }
  }

  /**
   * 关闭设备连接
   */
  public async close(): Promise<boolean> {
    if (!this.socketManager.isDeviceInitialized(this.deviceIp)) {
      return true; // 设备未初始化，不需要关闭
    }
    
    const result = await this.socketManager.sendRequest('close_device', [this.deviceIp]);
    this.socketManager.markDeviceAsUninitialized(this.deviceIp);
    return result;
  }

  // 设备连接相关
  public async getSdkVersion(): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('get_sdk_version', [this.deviceIp]);
  }

  public async checkConnectState(): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('check_connect_state', [this.deviceIp]);
  }

  // 工作模式设置
  public async setRpaWorkMode(mode: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('setRpaWorkMode', [this.deviceIp, mode]);
  }

  // 截图相关
  // type为0表示png，1表示jpg
  public async takeCaptrueCompress(type: 0 | 1 = 0, quality: number): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('takeCaptrueCompress', [this.deviceIp, type, quality]);
  }

  // type为0表示png，1表示jpg
  public async screentshot(type: 0 | 1 = 0, quality: number, path: string): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('screentshot', [this.deviceIp, type, quality, path]);
  }

  // type为0表示png，1表示jpg
  public async screentshotEx(x1: number, y1: number, x2: number, y2: number, type: 0 | 1, quality: number, path: string): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('screentshotEx', [this.deviceIp, x1, y1, x2, y2, type, quality, path]);
  }

  // 节点操作
  public async dumpNodeXml(includeInvisible: 0 | 1 = 1): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('dumpNodeXml', [this.deviceIp, includeInvisible]);
  }

  public async getNodeByClass(className: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeByClass', [this.deviceIp, className]);
  }

  // 应用操作
  public async openApp(packageName: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('openApp', [this.deviceIp, packageName]);
  }

  public async stopApp(packageName: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('stopApp', [this.deviceIp, packageName]);
  }

  // 文本输入
  public async sendText(text: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('sendText', [this.deviceIp, text]);
  }

  public async clearText(count: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('ClearText', [this.deviceIp, count]);
  }

  // 命令执行
  public async execCmd(cmd: string): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('exec_cmd', [this.deviceIp, cmd]);
  }

  // 触摸操作
  public async touchDown(fingerId: number, x: number, y: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('touchDown', [this.deviceIp, fingerId, x, y]);
  }

  public async touchMove(fingerId: number, x: number, y: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('touchMove', [this.deviceIp, fingerId, x, y]);
  }

  public async touchUp(fingerId: number, x: number, y: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('touchUp', [this.deviceIp, fingerId, x, y]);
  }

  public async swipe(fingerId: number, x1: number, y1: number, x2: number, y2: number, duration: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('swipe', [this.deviceIp, fingerId, x1, y1, x2, y2, duration]);
  }

  // 按键操作
  public async keyPress(keycode: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('keyPress', [this.deviceIp, keycode]);
  }

  // 节点查找方法
  public async getNodeByText(text: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeByText', [this.deviceIp, text]);
  }

  public async getNodeByTextMatchEnd(text: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeByTextMatchEnd', [this.deviceIp, text]);
  }

  public async getNodeByTextMatchStart(text: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeByTextMatchStart', [this.deviceIp, text]);
  }

  public async getNodeByPkg(pkg: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeByPkg', [this.deviceIp, pkg]);
  }

  public async getNodeById(id: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeById', [this.deviceIp, id]);
  }

  public async getNodeByDesc(desc: string): Promise<any> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getNodeByDesc', [this.deviceIp, desc]);
  }

  // 点击操作
  public async clickText(text: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('clickText', [this.deviceIp, text]);
  }

  public async clickTextMatchStart(text: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('clickTextMatchStart', [this.deviceIp, text]);
  }

  public async clickClass(className: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('clickClass', [this.deviceIp, className]);
  }

  public async clickId(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('clickId', [this.deviceIp, id]);
  }

  public async clickDesc(desc: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('clickDesc', [this.deviceIp, desc]);
  }

  // 按键操作
  public async pressBack(): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('pressBack', [this.deviceIp]);
  }

  public async pressEnter(): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('pressEnter', [this.deviceIp]);
  }

  public async pressHome(): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('pressHome', [this.deviceIp]);
  }

  public async pressRecent(): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('pressRecent', [this.deviceIp]);
  }

  // 触摸操作
  public async touchClick(fingerId: number, x: number, y: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('touchClick', [this.deviceIp, fingerId, x, y]);
  }

  public async longClick(fingerId: number, x: number, y: number, duration: number): Promise<boolean> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('longClick', [this.deviceIp, fingerId, x, y, duration]);
  }

  // 其他功能
  public async getDisplayRotate(): Promise<number> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('getDisplayRotate', [this.deviceIp]);
  }

  public async dumpNodeXmlEx(workMode: number, timeout: number): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('dumpNodeXmlEx', [this.deviceIp, workMode, timeout]);
  }

  // type为0表示png，1表示jpg
  public async takeCaptrueCompressEx(left: number, top: number, right: number, bottom: number, type: 0 | 1, quality: number): Promise<string> {
    await this.ensureInitialized();
    return this.socketManager.sendRequest('takeCaptrueCompressEx', [this.deviceIp, left, top, right, bottom, type, quality]);
  }

  /**
   * 随机延迟函数
   * @param {number} min - 最小延迟
   * @param {number} max - 最大延迟
   * @returns {number} - 随机延迟时间
   */
  private randomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * 生成基于时间的点延迟数组
   * @param {number} numPoints - 点的数量
   * @param {number} totalDuration - 总持续时间
   * @param {boolean} isSlowSwipe - 是否慢速滑动
   * @param {boolean} isQuickSwipe - 是否快速滑动
   * @returns {Array<number>} - 每个点的延迟时间
   */
  private calculatePointDelays(numPoints: number, totalDuration: number, isSlowSwipe: boolean, isQuickSwipe: boolean): number[] {
    const delays: number[] = [];
    let remainingTime = totalDuration;
    
    // 预留一部分时间用于首尾的特殊处理
    const reservedTime = Math.min(totalDuration * 0.2, 100);
    let mainDuration = totalDuration - reservedTime;
    
    // 根据滑动类型调整时间分配比例
    let accelPhase, decelPhase, steadyPhase;
    
    if (isSlowSwipe) {
      // 慢滑动 - 更均匀的时间分配
      accelPhase = 0.15;   // 加速阶段比例
      decelPhase = 0.15;   // 减速阶段比例
      steadyPhase = 0.7;   // 匀速阶段比例
    } else if (isQuickSwipe) {
      // 快滑动 - 更短的加速，更长的减速
      accelPhase = 0.1;    // 加速阶段比例 
      decelPhase = 0.3;    // 减速阶段比例
      steadyPhase = 0.6;   // 匀速阶段比例
    } else {
      // 中等速度 - 标准分配
      accelPhase = 0.2;    // 加速阶段比例
      decelPhase = 0.2;    // 减速阶段比例
      steadyPhase = 0.6;   // 匀速阶段比例
    }
    
    // 每个阶段的点数
    const accelPoints = Math.floor(numPoints * accelPhase);
    const decelPoints = Math.floor(numPoints * decelPhase);
    const steadyPoints = numPoints - accelPoints - decelPoints;
    
    // 生成每个阶段的延迟时间
    const baseDelay = mainDuration / (
      accelPoints * (isSlowSwipe ? 1.1 : 1.3) +     // 慢滑动时加速更均匀
      steadyPoints * (isSlowSwipe ? 0.9 : 0.7) +    // 慢滑动时匀速更平稳
      decelPoints * (isQuickSwipe ? 1.5 : 1.3)      // 快滑动时减速更明显
    );
    
    // 加速阶段 - 延迟从长到短
    for (let i = 0; i < accelPoints; i++) {
      const progress = i / accelPoints;
      const factor = isSlowSwipe ? 
        (1.1 - 0.2 * progress) :        // 慢滑动时加速较均匀
        (1.3 - 0.6 * progress);         // 快/中滑动时加速较明显
      
      // 慢滑动时抖动较小
      const jitter = (Math.random() * (isSlowSwipe ? 0.1 : 0.15) - (isSlowSwipe ? 0.05 : 0.075));
      
      const delay = Math.max(10, Math.min(150, Math.floor(baseDelay * factor * (1 + jitter))));
      delays.push(delay);
      remainingTime -= delay;
    }
    
    // 稳定阶段 - 基本稳定的延迟但有随机波动
    for (let i = 0; i < steadyPoints; i++) {
      // 慢滑动时波动较小，保持稳定速率
      const jitter = (Math.random() * (isSlowSwipe ? 0.15 : 0.25) - (isSlowSwipe ? 0.075 : 0.125));
      const steadyFactor = isSlowSwipe ? 0.9 : 0.7;
      const delay = Math.max(10, Math.min(150, Math.floor(baseDelay * steadyFactor * (1 + jitter))));
      delays.push(delay);
      remainingTime -= delay;
    }
    
    // 减速阶段 - 延迟从短到长
    for (let i = 0; i < decelPoints; i++) {
      const progress = i / decelPoints;
      const decelStart = isSlowSwipe ? 0.9 : 0.7;
      const decelEnd = isQuickSwipe ? 1.5 : 1.3;
      const factor = decelStart + (decelEnd - decelStart) * progress;
      
      // 慢滑动时抖动较小
      const jitter = (Math.random() * (isSlowSwipe ? 0.1 : 0.15) - (isSlowSwipe ? 0.05 : 0.075));
      
      // 确保不会超出剩余时间
      if (i === decelPoints - 1 && delays.length === numPoints - 1) {
        delays.push(Math.max(10, remainingTime));
        break;
      }
      
      const delay = Math.max(10, Math.min(150, Math.floor(baseDelay * factor * (1 + jitter))));
      delays.push(delay);
      remainingTime -= delay;
    }
    
    // 确保总时间接近指定时间
    if (delays.length < numPoints) {
      const remaining = numPoints - delays.length;
      for (let i = 0; i < remaining; i++) {
        delays.push(Math.max(10, Math.floor(remainingTime / remaining)));
      }
    }
    
    return delays;
  }

  /**
   * 生成逼真的人类滑动轨迹
   */
  private generateRealisticTrajectory(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    numPoints: number, 
    isVertical: boolean, 
    options: {
      noiseIntensity: number;
      isSlowSwipe: boolean;
      isQuickSwipe: boolean;
      isHorizontal: boolean;
      isVertical: boolean;
    }
  ): Array<{x: number, y: number}> {
    const { 
      noiseIntensity, 
      isSlowSwipe, 
      isQuickSwipe, 
      isHorizontal,
      isVertical: isVertSwipe
    } = options;
    
    const points: Array<{x: number, y: number}> = [];
    
    // 总距离
    const totalDistanceX = endX - startX;
    const totalDistanceY = endY - startY;
    
    // 计算滑动方向向量（单位向量）
    const distance = Math.sqrt(totalDistanceX * totalDistanceX + totalDistanceY * totalDistanceY);
    const directionX = totalDistanceX / distance;
    const directionY = totalDistanceY / distance;
    
    // 垂直于滑动方向的向量（用于添加偏移）
    const perpX = -directionY;
    const perpY = directionX;
    
    // 添加起始点
    points.push({ x: startX, y: startY });
    
    // 累计偏差 - 用于平滑随机扰动
    let cumulativeOffset = 0;
    
    // 生成中间点
    for (let i = 1; i < numPoints; i++) {
      const progress = i / numPoints;
      
      // 根据滑动类型和进度调整噪声强度
      let effectiveNoiseIntensity = noiseIntensity;
      
      if (isSlowSwipe) {
        // 慢滑动 - 全程低噪声保持平滑
        effectiveNoiseIntensity *= 0.5;
      } else if (isQuickSwipe) {
        // 快滑动 - 前半段更平滑，后半段噪声增加
        if (progress < 0.5) {
          effectiveNoiseIntensity *= 0.3 + progress * 0.4; // 0.3 到 0.5 (降低噪声增长)
        } else {
          effectiveNoiseIntensity *= 0.5 + (progress - 0.5) * 0.5; // 0.5 到 0.75 (降低最大噪声)
        }
      } else {
        // 中等速度 - 中间段噪声最大
        effectiveNoiseIntensity *= 0.3 + 0.8 * progress * (1 - progress); // 中间达到峰值，但峰值更低
      }
      
      // 靠近终点时减少噪声，避免急转弯
      if (progress > 0.8) {
        effectiveNoiseIntensity *= (1 - (progress - 0.8) / 0.2);
      }
      
      // 使用缓动函数模拟加速和减速
      let easedProgress;
      
      if (progress < 0.3) {
        // 加速阶段 - ease-in
        const p = progress / 0.3;
        easedProgress = 0.3 * p * p;
      } else if (progress > 0.7) {
        // 减速阶段 - ease-out
        const p = (progress - 0.7) / 0.3;
        easedProgress = 0.7 + 0.3 * (1 - Math.pow(1 - p, 2));
      } else {
        // 匀速阶段 - 线性
        easedProgress = progress;
      }
      
      // 主方向位移
      const baseX = startX + totalDistanceX * easedProgress;
      const baseY = startY + totalDistanceY * easedProgress;
      
      // 噪声系数 - 确保噪声强度在中间达到最大，两端较小
      const noiseFactor = Math.sin(progress * Math.PI) * effectiveNoiseIntensity;
      
      // 为水平和垂直滑动提供更专注的路径生成
      let finalX, finalY;
      
      if (isHorizontal) {
        // 水平滑动 - 几乎没有Y偏移，只有前进方向(X轴)的速度变化
        // 保持滑动方向一致性的同时添加速度变化
        
        // 计算自然滑动轨迹上的目标点 - 在水平线上前进，几乎无Y变化
        const targetY = startY + (endY - startY) * easedProgress; // 确保Y值平滑过渡
        
        // 最小化Y偏移，使用极小的扰动值
        const maxYDeviation = 1.5; // 极小的Y轴偏移（几乎察觉不到）
        
        // 使用正弦扰动使Y轴偏移更自然，不会出现明显的上下抖动
        const smoothProgress = (Math.sin((progress * Math.PI * 2) - Math.PI/2) + 1) / 2; // 0-1平滑曲线
        const yDeviation = maxYDeviation * smoothProgress * noiseFactor;
        
        finalY = targetY + yDeviation;
        
        // X轴以主要方向为基准，添加速度变化但不改变方向
        const xSpeedVariation = noiseFactor * 5; // 仅影响速度，不影响方向
        finalX = baseX + xSpeedVariation * directionX;
        
      } else if (isVertSwipe) {
        // 垂直滑动 - 几乎没有X偏移，只有前进方向(Y轴)的速度变化
        
        // 计算自然滑动轨迹上的目标点 - 在垂直线上前进，几乎无X变化
        const targetX = startX + (endX - startX) * easedProgress; // 确保X值平滑过渡
        
        // 最小化X偏移，使用极小的扰动值
        const maxXDeviation = 1.5; // 极小的X轴偏移（几乎察觉不到）
        
        // 使用正弦扰动使X轴偏移更自然，不会出现明显的左右抖动
        const smoothProgress = (Math.sin((progress * Math.PI * 2) - Math.PI/2) + 1) / 2; // 0-1平滑曲线
        const xDeviation = maxXDeviation * smoothProgress * noiseFactor;
        
        finalX = targetX + xDeviation;
        
        // Y轴以主要方向为基准，添加速度变化但不改变方向
        const ySpeedVariation = noiseFactor * 5; // 仅影响速度，不影响方向
        finalY = baseY + ySpeedVariation * directionY;
        
      } else {
        // 斜向滑动 - 使用传统方法，但减小偏移
        // 计算新的随机偏移 (最大偏移从15降到10)
        const newOffset = (Math.random() * 2 - 1) * noiseFactor * 10; // 减小偏移量
        
        // 平滑噪声 - 避免突变
        const smoothingFactor = isSlowSwipe ? 0.85 : 0.75; // 提高平滑系数，减少抖动
        cumulativeOffset = cumulativeOffset * smoothingFactor + newOffset * (1 - smoothingFactor);
        
        // 减少路径末端的偏移，确保平滑接近终点
        let adjustedOffset = cumulativeOffset;
        if (progress > 0.7) {
          // 在最后30%的路径上逐渐减少偏移，确保平滑到达终点
          adjustedOffset *= (1 - (progress - 0.7) / 0.3);
        }
        
        // 计算正交偏移，但降低总体偏移幅度，使滑动更自然
        finalX = baseX + perpX * adjustedOffset * 0.7; // 降低偏移幅度
        finalY = baseY + perpY * adjustedOffset * 0.7; // 降低偏移幅度
      }
      
      points.push({ x: finalX, y: finalY });
    }
    
    // 添加结束点
    points.push({ x: endX, y: endY });
    
    return points;
  }

  /**
   * 模拟人类滑动
   * @param {number} fingerId - 触控手指ID
   * @param {number} startX - 起始X坐标
   * @param {number} startY - 起始Y坐标
   * @param {number} endX - 结束X坐标
   * @param {number} endY - 结束Y坐标
   * @param {number} duration - 滑动持续时间(毫秒)
   * @param {Object} options - 可选配置参数
   * @returns {Promise<void>}
   */
  public async simulateHumanSwipe(
    fingerId: number, 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    duration: number = 500, 
    options: {
      screenWidth?: number, 
      screenHeight?: number,
      startOffsetRange?: { min: number, max: number },
      endOffsetRange?: { min: number, max: number },
      noiseIntensity?: number
    } = {}
  ): Promise<void> {
    await this.ensureInitialized();
    
    // 参数校验
    if (typeof startX !== 'number' || typeof startY !== 'number' || 
        typeof endX !== 'number' || typeof endY !== 'number' || 
        duration < 0 || typeof fingerId !== 'number') {
      throw new Error('输入参数无效');
    }
    
    // 提取选项或使用默认值
    const {
      screenWidth = 1080, 
      screenHeight = 2340,
      startOffsetRange = { min: -8, max: 8 },  // 进一步减小默认偏移范围
      endOffsetRange = { min: -8, max: 8 },    // 进一步减小默认偏移范围
      noiseIntensity = 0.2    // 降低噪声强度，防止过度抖动
    } = options;
    
    // 检测滑动类型
    const isHorizontal = Math.abs(endY - startY) < Math.abs(endX - startX) * 0.2;
    const isVertical = Math.abs(endX - startX) < Math.abs(endY - startY) * 0.2;
    
    // 根据滑动类型调整偏移
    let startXOffset = 0, startYOffset = 0, endXOffset = 0, endYOffset = 0;
    
    if (isHorizontal) {
      // 水平滑动：Y轴偏移极小或无
      startXOffset = this.randomDelay(startOffsetRange.min, startOffsetRange.max);
      startYOffset = this.randomDelay(-2, 2); // 几乎没有Y轴偏移
      endXOffset = this.randomDelay(endOffsetRange.min, endOffsetRange.max);
      endYOffset = this.randomDelay(-2, 2); // 几乎没有Y轴偏移
    } else if (isVertical) {
      // 垂直滑动：X轴偏移极小或无
      startXOffset = this.randomDelay(-2, 2); // 几乎没有X轴偏移
      startYOffset = this.randomDelay(startOffsetRange.min, startOffsetRange.max);
      endXOffset = this.randomDelay(-2, 2); // 几乎没有X轴偏移
      endYOffset = this.randomDelay(endOffsetRange.min, endOffsetRange.max);
    } else {
      // 斜向滑动：两轴都有适度偏移
      startXOffset = this.randomDelay(startOffsetRange.min, startOffsetRange.max);
      startYOffset = this.randomDelay(startOffsetRange.min, startOffsetRange.max);
      endXOffset = this.randomDelay(endOffsetRange.min, endOffsetRange.max);
      endYOffset = this.randomDelay(endOffsetRange.min, endOffsetRange.max);
    }
    
    const startXWithOffset = startX + startXOffset;
    const startYWithOffset = startY + startYOffset;
    const endXWithOffset = endX + endXOffset;
    const endYWithOffset = endY + endYOffset;
    
    // 决定滑动方向
    const isMainlyVertical = Math.abs(endYWithOffset - startYWithOffset) > Math.abs(endXWithOffset - startXWithOffset);
    
    // 基于距离和时间计算适当的点数量
    const distance = Math.sqrt(
      Math.pow(endXWithOffset - startXWithOffset, 2) + 
      Math.pow(endYWithOffset - startYWithOffset, 2)
    );
    
    // 判断滑动速度类型
    const isSlowSwipe = duration > 800;
    const isQuickSwipe = duration < 300;
    
    // 根据速度类型调整点的数量和噪声强度
    let actualNoiseIntensity = noiseIntensity;
    let minPointCount = 5;
    
    if (isSlowSwipe) {
      // 慢滑动 - 更多点，更小的噪声
      minPointCount = 15;
      actualNoiseIntensity = noiseIntensity * 0.5; // 降低噪声强度，使轨迹更平滑
    } else if (isQuickSwipe) {
      // 快滑动 - 较少点，噪声集中在后半段
      minPointCount = 5;
    } else {
      // 中等速度
      minPointCount = 8;
    }
    
    // 为水平或垂直滑动减少噪声强度
    if (isHorizontal || isVertical) {
      actualNoiseIntensity *= 0.4; // 大幅减少噪声，保持直线特性
    }
    
    const pointsBasedOnDistance = Math.max(minPointCount, Math.floor(distance / 20));
    const pointsBasedOnDuration = Math.max(minPointCount, Math.floor(duration / 50));
    const numPoints = Math.max(pointsBasedOnDistance, pointsBasedOnDuration);
    
    // 生成更真实的人类滑动轨迹
    const points = this.generateRealisticTrajectory(
      startXWithOffset, startYWithOffset,
      endXWithOffset, endYWithOffset,
      numPoints, isMainlyVertical, {
        noiseIntensity: actualNoiseIntensity,
        isSlowSwipe,
        isQuickSwipe,
        isHorizontal,
        isVertical
      }
    );
    
    // 使用缓动函数计算每个点的时间分布
    const pointDelays = this.calculatePointDelays(numPoints, duration, isSlowSwipe, isQuickSwipe);
    
    // 开始滑动
    console.log(`模拟人类滑动: 从(${startXWithOffset},${startYWithOffset})到(${endXWithOffset},${endYWithOffset})`);
    
    try {
      // 按下手指
      await this.touchDown(fingerId, startXWithOffset, startYWithOffset);
      await new Promise(resolve => setTimeout(resolve, this.randomDelay(30, 70)));
      
      // 滑动过程
      for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i];
        
        // 限制坐标在屏幕范围内
        const safeX = Math.max(0, Math.min(screenWidth, Math.round(x)));
        const safeY = Math.max(0, Math.min(screenHeight, Math.round(y)));
        
        // 执行移动
        await this.touchMove(fingerId, safeX, safeY);
        
        // 应用延迟
        await new Promise(resolve => setTimeout(resolve, pointDelays[i]));
      }
      
      // 确保最后一点是目标位置（可能有微小偏差）
      const finalX = Math.max(0, Math.min(screenWidth, Math.round(endXWithOffset)));
      const finalY = Math.max(0, Math.min(screenHeight, Math.round(endYWithOffset)));
      
      await this.touchMove(fingerId, finalX, finalY);
      await new Promise(resolve => setTimeout(resolve, this.randomDelay(30, 70)));
      
      // 抬起手指
      await this.touchUp(fingerId, finalX, finalY);
    } catch (error) {
      console.error('滑动操作异常:', error);
      // 确保手指抬起，避免触摸状态卡死
      try {
        await this.touchUp(fingerId, endXWithOffset, endYWithOffset);
      } catch (e) {
        console.error('尝试抬起手指失败:', e);
      }
      throw error;
    }
  }
}

// 修改connectToSocket函数
export async function connectToSocket(socketPort?: number): Promise<void> {
  const socketManager = OukekMytSocket.getInstance();
  return socketManager.connect(socketPort);
}

// 添加一个断开连接的函数
export async function disconnectFromSocket(): Promise<void> {
  return OukekMytSocket.getInstance().disconnect();
} 