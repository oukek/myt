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