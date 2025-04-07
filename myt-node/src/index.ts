import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';

export class OukekMyt {
  private pythonExecutable: string;
  private executablePath: string;

  constructor() {
    // 根据操作系统选择可执行文件名
    this.pythonExecutable = process.platform === 'win32' 
      ? 'myt-python.exe' 
      : 'myt-python';
    
    // 获取可执行文件路径
    this.executablePath = join(__dirname, 'python', this.pythonExecutable);
  }

  private async executePython(operation: string, a: number, b: number): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        // 验证参数
        if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
          throw new Error('Invalid numbers provided');
        }

        if (operation !== 'add' && operation !== 'subtract') {
          throw new Error('Invalid operation');
        }

        // 创建子进程
        const pythonProcess: ChildProcess = spawn(this.executablePath, [
          operation,
          a.toString(),
          b.toString()
        ], {
          stdio: ['ignore', 'pipe', 'pipe']
        });
        
        let output = '';
        let error = '';

        // 设置超时
        const timeout = setTimeout(() => {
          pythonProcess.kill();
          reject(new Error('Operation timed out'));
        }, 5000); // 5秒超时

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
          reject(new Error(`Failed to start Python process: ${err.message}`));
        });

        // 处理完成
        pythonProcess.on('close', (code: number | null) => {
          clearTimeout(timeout);
          
          if (code === null) {
            reject(new Error('Python process was terminated'));
            return;
          }

          if (code !== 0) {
            reject(new Error(`Python process exited with code ${code}: ${error}`));
            return;
          }

          try {
            const result = JSON.parse(output);
            if (result.error) {
              reject(new Error(result.error));
            } else if (typeof result.result !== 'number') {
              reject(new Error('Invalid result type'));
            } else {
              resolve(result.result);
            }
          } catch (e) {
            if (e instanceof Error) {
              reject(new Error(`Failed to parse Python output: ${e.message}`));
            } else {
              reject(new Error('Failed to parse Python output: Unknown error'));
            }
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          reject(e);
        } else {
          reject(new Error('Unknown error occurred'));
        }
      }
    });
  }

  public async add(a: number, b: number): Promise<number> {
    try {
      return await this.executePython('add', a, b);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Addition failed: ${e.message}`);
      }
      throw new Error('Addition failed: Unknown error');
    }
  }

  public async subtract(a: number, b: number): Promise<number> {
    try {
      return await this.executePython('subtract', a, b);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Subtraction failed: ${e.message}`);
      }
      throw new Error('Subtraction failed: Unknown error');
    }
  }
} 