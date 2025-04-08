import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';

export class OukekMyt {
  private pythonExecutable: string;
  private executablePath: string;
  private deviceIp: string | null = null;
  private devicePort: number | null = null;
  private deviceTimeout: number | null = null;

  constructor() {
    // 根据操作系统选择可执行文件名
    this.pythonExecutable = process.platform === 'win32' 
      ? 'myt-python.exe' 
      : 'myt-python';
    
    // 获取可执行文件路径
    this.executablePath = join(__dirname, 'python', this.pythonExecutable);
  }

  private async executePython(method: string, ...args: any[]): Promise<any> {
    // 如果是初始化方法，保存参数
    if (method === 'init' && args.length >= 3) {
      this.deviceIp = args[0]?.toString();
      this.devicePort = parseInt(args[1]?.toString());
      this.deviceTimeout = parseInt(args[2]?.toString());
    }
    
    // 如果不是初始化或获取SDK版本，且没有初始化过，则抛出错误
    if (method !== 'init' && method !== 'get_sdk_version' && !this.deviceIp) {
      throw new Error('请先调用 init 方法初始化设备连接');
    }

    // 准备参数
    const params = [...args];

    return new Promise((resolve, reject) => {
      try {
        // 创建命令行参数数组
        const cmdArgs = [
          method,
          ...params.map(arg => arg?.toString() || '')
        ];

        // 如果不是 init 或 get_sdk_version 方法，添加设备参数
        if (method !== 'init' && method !== 'get_sdk_version' && this.deviceIp) {
          cmdArgs.push(
            this.deviceIp,
            this.devicePort?.toString() || '',
            this.deviceTimeout?.toString() || ''
          );
        }

        // 创建子进程
        const pythonProcess: ChildProcess = spawn(this.executablePath, cmdArgs, {
          stdio: ['ignore', 'pipe', 'pipe']
        });
        
        let output = '';
        let error = '';

        // 设置超时
        const timeout = setTimeout(() => {
          pythonProcess.kill();
          reject(new Error('操作超时'));
        }, 30000); // 30秒超时

        // 收集输出
        pythonProcess.stdout?.on('data', (data: Buffer) => {
          output += data.toString();
        });

        pythonProcess.stderr?.on('data', (data: Buffer) => {
          error += data.toString();
        });

        // 处理错误
        pythonProcess.on('error', (err: Error) => {
          clearTimeout(timeout);
          reject(new Error(`启动Python进程失败: ${err.message}`));
        });

        // 处理完成
        pythonProcess.on('close', (code: number | null) => {
          clearTimeout(timeout);
          
          if (code === null) {
            reject(new Error('Python进程被终止'));
            return;
          }

          if (code !== 0) {
            reject(new Error(`Python进程退出，错误码 ${code}: ${error}`));
            return;
          }

          try {
            const result = JSON.parse(output);
            if (result.error) {
              reject(new Error(result.error));
            } else {
              resolve(result.result);
            }
          } catch (e) {
            if (e instanceof Error) {
              reject(new Error(`解析Python输出失败: ${e.message}`));
            } else {
              reject(new Error('解析Python输出失败: 未知错误'));
            }
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          reject(e);
        } else {
          reject(new Error('发生未知错误'));
        }
      }
    });
  }

  // 设备连接相关
  public async init(ip: string, port: number, timeout: number): Promise<boolean> {
    return this.executePython('init', ip, port, timeout);
  }

  public async getSdkVersion(): Promise<string> {
    return this.executePython('get_sdk_version');
  }

  public async checkConnectState(): Promise<boolean> {
    return this.executePython('check_connect_state');
  }

  // 工作模式设置
  public async setRpaWorkMode(mode: number): Promise<boolean> {
    return this.executePython('setRpaWorkMode', mode);
  }

  // 截图相关
  // type为0表示png，1表示jpg
  public async takeCaptrueCompress(type: 0 | 1 = 0, quality: number): Promise<string> {
    return this.executePython('takeCaptrueCompress', type, quality);
  }

  // type为0表示png，1表示jpg
  public async screentshot(type: 0 | 1 = 0, quality: number, path: string): Promise<string> {
    return this.executePython('screentshot', type, quality, path);
  }

  // type为0表示png，1表示jpg
  public async screentshotEx(x1: number, y1: number, x2: number, y2: number, type: 0 | 1, quality: number, path: string): Promise<string> {
    return this.executePython('screentshotEx', x1, y1, x2, y2, type, quality, path);
  }

  // 节点操作
  public async dumpNodeXml(includeInvisible: 0 | 1 = 1): Promise<string> {
    return this.executePython('dumpNodeXml', includeInvisible);
  }

  public async getNodeByClass(className: string): Promise<any> {
    return this.executePython('getNodeByClass', className);
  }

  // 应用操作
  public async openApp(packageName: string): Promise<boolean> {
    return this.executePython('openApp', packageName);
  }

  public async stopApp(packageName: string): Promise<boolean> {
    return this.executePython('stopApp', packageName);
  }

  // 文本输入
  public async sendText(text: string): Promise<boolean> {
    return this.executePython('sendText', text);
  }

  public async clearText(count: number): Promise<boolean> {
    return this.executePython('ClearText', count);
  }

  // 命令执行
  public async execCmd(cmd: string): Promise<string> {
    return this.executePython('exec_cmd', cmd);
  }

  // 触摸操作
  public async touchDown(fingerId: number, x: number, y: number): Promise<boolean> {
    return this.executePython('touchDown', fingerId, x, y);
  }

  public async touchMove(fingerId: number, x: number, y: number): Promise<boolean> {
    return this.executePython('touchMove', fingerId, x, y);
  }

  public async touchUp(fingerId: number, x: number, y: number): Promise<boolean> {
    return this.executePython('touchUp', fingerId, x, y);
  }

  public async swipe(fingerId: number, x1: number, y1: number, x2: number, y2: number, duration: number): Promise<boolean> {
    return this.executePython('swipe', fingerId, x1, y1, x2, y2, duration);
  }

  // 按键操作
  public async keyPress(keycode: number): Promise<boolean> {
    return this.executePython('keyPress', keycode);
  }

  // 节点查找方法
  public async getNodeByText(text: string): Promise<any> {
    return this.executePython('getNodeByText', text);
  }

  public async getNodeByTextMatchEnd(text: string): Promise<any> {
    return this.executePython('getNodeByTextMatchEnd', text);
  }

  public async getNodeByTextMatchStart(text: string): Promise<any> {
    return this.executePython('getNodeByTextMatchStart', text);
  }

  public async getNodeByPkg(pkg: string): Promise<any> {
    return this.executePython('getNodeByPkg', pkg);
  }

  public async getNodeById(id: string): Promise<any> {
    return this.executePython('getNodeById', id);
  }

  public async getNodeByDesc(desc: string): Promise<any> {
    return this.executePython('getNodeByDesc', desc);
  }

  // 点击操作
  public async clickText(text: string): Promise<boolean> {
    return this.executePython('clickText', text);
  }

  public async clickTextMatchStart(text: string): Promise<boolean> {
    return this.executePython('clickTextMatchStart', text);
  }

  public async clickClass(className: string): Promise<boolean> {
    return this.executePython('clickClass', className);
  }

  public async clickId(id: string): Promise<boolean> {
    return this.executePython('clickId', id);
  }

  public async clickDesc(desc: string): Promise<boolean> {
    return this.executePython('clickDesc', desc);
  }

  // 按键操作
  public async pressBack(): Promise<boolean> {
    return this.executePython('pressBack');
  }

  public async pressEnter(): Promise<boolean> {
    return this.executePython('pressEnter');
  }

  public async pressHome(): Promise<boolean> {
    return this.executePython('pressHome');
  }

  public async pressRecent(): Promise<boolean> {
    return this.executePython('pressRecent');
  }

  // 触摸操作
  public async touchClick(fingerId: number, x: number, y: number): Promise<boolean> {
    return this.executePython('touchClick', fingerId, x, y);
  }

  public async longClick(fingerId: number, x: number, y: number, duration: number): Promise<boolean> {
    return this.executePython('longClick', fingerId, x, y, duration);
  }

  // 其他功能
  public async getDisplayRotate(): Promise<number> {
    return this.executePython('getDisplayRotate');
  }

  public async dumpNodeXmlEx(workMode: number, timeout: number): Promise<string> {
    return this.executePython('dumpNodeXmlEx', workMode, timeout);
  }

  // type为0表示png，1表示jpg
  public async takeCaptrueCompressEx(left: number, top: number, right: number, bottom: number, type: 0 | 1, quality: number): Promise<string> {
    return this.executePython('takeCaptrueCompressEx', left, top, right, bottom, type, quality);
  }

  public async startVideoStream(): Promise<boolean> {
    return this.executePython('startVideoStream');
  }
} 