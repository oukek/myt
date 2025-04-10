import { OukekMytServer } from '../myt-server';
import { ApiResponse, S5ConnectionOptions } from './type';

export class S5ProxyModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 设置S5域名过滤
   * @param ip 主机IP地址，用于指定要设置域名过滤的容器所在的主机
   * @param name 容器名称，指定要设置域名过滤的容器
   * @param urlList 需要过滤的域名列表，指定要过滤的域名数组
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setFilterUrl(
    ip: string,
    name: string,
    urlList: string[]
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/s5_filter_url/${ip}/${name}`, {
      data: { url_list: JSON.stringify(urlList) }
    });
    return response.data;
  }

  /**
   * 查询S5连接信息
   * @param ip 主机IP地址，用于指定要查询连接信息的容器所在的主机
   * @param name 容器名称，指定要查询连接信息的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async queryConnection(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/s5_query/${ip}/${name}`);
    return response.data;
  }

  /**
   * 设置S5连接
   * @param ip 主机IP地址，用于指定要设置S5连接的容器所在的主机
   * @param name 容器名称，指定要设置S5连接的容器
   * @param options S5连接配置，可选参数，包含代理IP、端口、用户名、密码和域名模式等配置项
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setConnection(
    ip: string,
    name: string,
    options?: S5ConnectionOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/s5_set/${ip}/${name}`, {
      params: options
    });
    return response.data;
  }

  /**
   * 关闭S5连接
   * @param ip 主机IP地址，用于指定要关闭S5连接的容器所在的主机
   * @param name 容器名称，指定要关闭S5连接的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async stopConnection(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/s5_stop/${ip}/${name}`);
    return response.data;
  }
} 