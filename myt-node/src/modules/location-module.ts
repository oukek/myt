import { OukekMytServer } from '../myt-server';

export class LocationModule {
  constructor(private server: OukekMytServer) {}

  /**
   * IP智能定位
   * @param ip 主机IP地址，用于指定要设置IP定位的容器所在的主机
   * @param name 容器名称，指定要设置IP定位的容器
   * @param language 语言类型，可选值：zh(中文) en(英语) fr(法语) th(泰国) vi(越南) ja(日本) ko(韩国) lo(老挝) in(印尼)
   * @param options 可选参数
   * @param options.userip 用户IP地址，可选参数，指定用户IP地址
   * @param options.modelid 模型ID，可选参数，指定模型ID
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setIpLocation(
    ip: string,
    name: string,
    language: 'zh' | 'en' | 'fr' | 'th' | 'vi' | 'ja' | 'ko' | 'lo' | 'in',
    options?: {
      userip?: string;
      modelid?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/set_ipLocation/${ip}/${name}/${language}`, {
        params: options
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('IP智能定位失败:', error);
      return false;
    }
  }

  /**
   * 设置设备经纬度信息
   * @param ip 主机IP地址，用于指定要设置经纬度的容器所在的主机
   * @param name 容器名称，指定要设置经纬度的容器
   * @param lat 纬度，指定设备的纬度坐标
   * @param lng 经度，指定设备的经度坐标
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setLocation(
    ip: string,
    name: string,
    lat: number,
    lng: number
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/set_location/${ip}/${name}`, {
        params: { lat, lng }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('设置设备经纬度信息失败:', error);
      return false;
    }
  }
} 