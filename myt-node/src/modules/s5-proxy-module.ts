import { OukekMytServer } from '../myt-server';

export class S5ProxyModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 设置S5域名过滤
   * @param ip 主机IP地址，用于指定要设置域名过滤的容器所在的主机
   * @param name 容器名称，指定要设置域名过滤的容器
   * @param urlList 需要过滤的域名列表，指定要过滤的域名数组
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setFilterUrl(
    ip: string,
    name: string,
    urlList: string[]
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/s5_filter_url/${ip}/${name}`, {
        data: { url_list: JSON.stringify(urlList) }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('设置S5域名过滤失败:', error);
      return false;
    }
  }

  /**
   * 查询S5连接信息
   * @param ip 主机IP地址，用于指定要查询连接信息的容器所在的主机
   * @param name 容器名称，指定要查询连接信息的容器
   * @returns {Promise<string | null>} 返回Promise对象，成功时返回连接信息字符串，失败时返回null
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async queryConnection(
    ip: string,
    name: string
  ): Promise<string | null> {
    try {
      const response = await this.server.request('get', `/s5_query/${ip}/${name}`);
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('查询S5连接信息失败:', error);
      return null;
    }
  }

  /**
   * 设置S5连接
   * @param ip 主机IP地址，用于指定要设置S5连接的容器所在的主机
   * @param name 容器名称，指定要设置S5连接的容器
   * @param options S5连接配置，可选参数，包含以下配置项：
   * @param options.s5ip S5代理IP地址，可选参数
   * @param options.s5port S5代理端口，可选参数
   * @param options.s5user S5代理用户名，可选参数
   * @param options.s5pwd S5代理密码，可选参数
   * @param options.domain_mode 域名模式，可选参数
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setConnection(
    ip: string,
    name: string,
    options?: {
      s5ip?: string;
      s5port?: number;
      s5user?: string;
      s5pwd?: string;
      domain_mode?: number;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/s5_set/${ip}/${name}`, {
        params: options
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('设置S5连接失败:', error);
      return false;
    }
  }

  /**
   * 关闭S5连接
   * @param ip 主机IP地址，用于指定要关闭S5连接的容器所在的主机
   * @param name 容器名称，指定要关闭S5连接的容器
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async stopConnection(
    ip: string,
    name: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/s5_stop/${ip}/${name}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('关闭S5连接失败:', error);
      return false;
    }
  }
} 