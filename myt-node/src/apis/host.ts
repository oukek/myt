import { OukekMytServer } from '../myt-server';
import { ApiResponse } from './types';

/**
 * 镜像信息接口
 */
export interface ImageInfo {
  /** 镜像ID */
  id: string;
  /** 镜像地址 */
  image: string;
  /** 镜像名称 */
  name: string;
}

/**
 * 在线设备信息接口
 */
export interface OnlineDeviceInfo {
  /** 设备IP地址 */
  [ip: string]: string;
}

/**
 * 系统信息接口
 */
export interface SystemInfo {
  /** CPU使用率 */
  cpu: number;
  /** 磁盘使用率 */
  disk_percent: number;
  /** 磁盘总大小(字节) */
  disk_total: number;
  /** 内存使用率 */
  mem_percent: number;
  /** 内存总大小(字节) */
  mem_total: number;
  /** CPU温度 */
  temperatures: number;
}

export class HostApi {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取镜像列表
   * @returns {Promise<ApiResponse<ImageInfo[]>>} 返回Promise对象，成功时返回镜像列表，失败时返回错误信息
   * @example
   * const result = await hostApi.getImageList();
   * if (result.code === 200) {
   *   console.log('镜像列表:', result.msg);
   * }
   */
  async getImageList(): Promise<ApiResponse<ImageInfo[]>> {
    const response = await this.server.request('get', '/get_img_list');
    return response.data;
  }

  /**
   * 获取当前网络在线设备列表
   * @returns {Promise<ApiResponse<OnlineDeviceInfo>>} 返回Promise对象，成功时返回在线设备列表，失败时返回错误信息
   * @example
   * const result = await hostApi.queryOnlineDevices();
   * if (result.code === 200) {
   *   console.log('在线设备列表:', result.msg);
   * }
   */
  async queryOnlineDevices(): Promise<ApiResponse<OnlineDeviceInfo>> {
    const response = await this.server.request('get', '/query_myt');
    return response.data;
  }

  /**
   * 获取3588主机系统信息
   * @returns {Promise<ApiResponse<SystemInfo>>} 返回Promise对象，成功时返回系统信息，失败时返回错误信息
   * @example
   * const result = await hostApi.getSystemInfo();
   * if (result.code === 200) {
   *   console.log('CPU使用率:', result.msg.cpu);
   *   console.log('内存使用率:', result.msg.mem_percent);
   *   console.log('磁盘使用率:', result.msg.disk_percent);
   *   console.log('CPU温度:', result.msg.temperatures);
   * }
   */
  async getSystemInfo(): Promise<ApiResponse<SystemInfo>> {
    const response = await this.server.request('get', '/systeminfo');
    return response.data;
  }
}