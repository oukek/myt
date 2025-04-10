import { OukekMytServer } from '../myt-server';
import { ApiResponse, LanguageType, IpLocationOptions } from './type';

export class LocationModule {
  constructor(private server: OukekMytServer) {}

  /**
   * IP智能定位
   * @param ip 主机IP地址，用于指定要设置IP定位的容器所在的主机
   * @param name 容器名称，指定要设置IP定位的容器
   * @param language 语言类型，可选值：zh(中文) en(英语) fr(法语) th(泰国) vi(越南) ja(日本) ko(韩国) lo(老挝) in(印尼)
   * @param options 可选参数，包含用户IP地址和模型ID
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setIpLocation(
    ip: string,
    name: string,
    language: LanguageType,
    options?: IpLocationOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_ipLocation/${ip}/${name}/${language}`, {
      params: options
    });
    return response.data;
  }

  /**
   * 设置设备经纬度信息
   * @param ip 主机IP地址，用于指定要设置经纬度的容器所在的主机
   * @param name 容器名称，指定要设置经纬度的容器
   * @param lat 纬度，指定设备的纬度坐标
   * @param lng 经度，指定设备的经度坐标
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setLocation(
    ip: string,
    name: string,
    lat: number,
    lng: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_location/${ip}/${name}`, {
      params: { lat, lng }
    });
    return response.data;
  }
} 