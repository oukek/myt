import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HostApi } from './apis/host';
import { ContainerApi } from './apis/container';
import { AppApi } from './apis/app';

export class OukekMytServer {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  public host: HostApi;
  public container: ContainerApi;
  public app: AppApi;

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

    this.host = new HostApi(this);
    this.container = new ContainerApi(this);
    this.app = new AppApi(this);
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