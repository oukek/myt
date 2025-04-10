import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ToolModule } from './modules/tool-module';
import { HostModule } from './modules/host-module';
import { AndroidContainerModule } from './modules/android-container-module';
import { AndroidModule } from './modules/android-module';
import { DeviceFingerprintModule } from './modules/device-fingerprint-module';
import { DeviceSensorModule } from './modules/device-sensor-module';
import { LocationModule } from './modules/location-module';
import { S5ProxyModule } from './modules/s5-proxy-module';
import { DeviceInfo } from './modules/type';
import * as dgram from 'dgram';
import * as os from 'os';

export class OukekMytServer {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  public tool: ToolModule;
  public host: HostModule;
  public container: AndroidContainerModule;
  public app: AndroidModule;
  public deviceFingerprint: DeviceFingerprintModule;
  public deviceSensor: DeviceSensorModule;
  public location: LocationModule;
  public s5Proxy: S5ProxyModule;

  constructor(
    private ip: string,
    private port: number,
    private username: string,
    private password: string
  ) {
    this.axiosInstance = axios.create({
      baseURL: `http://${ip}:${port}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.tool = new ToolModule(this);
    this.host = new HostModule(this);
    this.container = new AndroidContainerModule(this);
    this.app = new AndroidModule(this);
    this.deviceFingerprint = new DeviceFingerprintModule(this);
    this.deviceSensor = new DeviceSensorModule(this);
    this.location = new LocationModule(this);
    this.s5Proxy = new S5ProxyModule(this);
  }

  async login(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(`/login/${this.username}/${this.password}`);
      if (response.data.code === 200) {
        this.token = response.data.msg;
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  }

  /**
   * 使用UDP广播发现设备
   * 发送 "lgcloud" 到 7678 端口，并收集响应中带 ":" 的设备 IP
   * @returns {Promise<DeviceInfo[]>} 返回Promise对象，包含发现的设备列表
   */
  static async discoverDevices(): Promise<DeviceInfo[]> {
    console.log('开始发现设备');
    const deviceMap: Record<string, DeviceInfo> = {}; // 使用ID作为唯一键
    
    // 获取所有网络接口
    const interfaces = os.networkInterfaces();
    
    const broadcastAddrs: string[] = [];
    
    // 遍历所有网络接口
    Object.values(interfaces).forEach(iface => {
      if (!iface) return;
      
      // 只处理IPv4地址
      iface.forEach(addr => {
        if (addr.family !== 'IPv4' || addr.internal) return;
        
        // 计算广播地址
        const ipBytes = addr.address.split('.').map(Number);
        const maskBytes = addr.netmask.split('.').map(Number);
        
        const broadcastBytes = ipBytes.map((byte, i) => byte | (~maskBytes[i] & 255));
        const broadcast = broadcastBytes.join('.');
        
        broadcastAddrs.push(broadcast);
      });
    });
    
    if (broadcastAddrs.length === 0) {
      throw new Error('未找到有效网络接口');
    }
    
    return new Promise((resolve, reject) => {
      // 创建UDP socket
      const socket = dgram.createSocket('udp4');
      
      // 绑定任意端口
      socket.bind(0, () => {
        console.log('本地监听地址:', socket.address());
        
        const message = Buffer.from('lgcloud');
        
        // 发送广播到所有发现的广播地址
        broadcastAddrs.forEach(bcAddr => {
          socket.send(message, 7678, bcAddr, err => {
            if (err) {
              console.error(`发送到 ${bcAddr} 失败:`, err);
              return;
            }
            console.log(`已发送广播到 ${bcAddr}`);
          });
        });
        
        // 设置超时，2秒后关闭socket
        const timeout = setTimeout(() => {
          socket.close();
          
          // 转换map为array
          const devices = Object.values(deviceMap);
          
          // 按IP排序
          devices.sort((a, b) => a.iP.localeCompare(b.iP));
          
          resolve(devices);
        }, 2000);
        
        // 监听消息
        socket.on('message', (msg, rinfo) => {
          const response = msg.toString();
          console.log(`收到来自 ${rinfo.address} 的响应: ${response}`);
          
          const parts = response.split(':');
          if (parts.length >= 3) {
            const ip = rinfo.address;
            const deviceId = parts[1];
            
            // 不再记录已分配IP到实例属性
            
            // 使用ID作为唯一标识
            if (!deviceMap[deviceId]) {
              deviceMap[deviceId] = {
                iP: ip,
                type: parts[0],
                iD: deviceId,
                name: parts.slice(2).join(':'),
                lastSeen: new Date()
              };
            } else {
              // 更新IP和最后发现时间
              const device = deviceMap[deviceId];
              device.iP = ip;
              device.lastSeen = new Date();
            }
          }
        });
        
        // 错误处理
        socket.on('error', err => {
          clearTimeout(timeout);
          socket.close();
          reject(err);
        });
      });
    });
  }

  // 获取axios实例（供模块内部使用）
  protected getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // 获取token（供模块内部使用）
  protected getToken(): string | null {
    return this.token;
  }

  // 公共请求方法（供模块使用）
  public async request<T = any>(
    method: string,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>({
      method,
      url,
      ...config
    });
  }

  // 服务器相关方法将在这里实现
} 