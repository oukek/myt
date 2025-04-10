import { OukekMytServer } from '../myt-server';
import { 
  ApiResponse, 
  HardwareConfig, 
  SystemInfo, 
  LocalSystemInfo, 
  RebootHostOptions,
  FanOptions 
} from './type';

export class HostModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取主机配置信息
   * @returns {Promise<ApiResponse<HardwareConfig>>} 返回Promise对象，包含完整响应（code和硬件配置信息）
   * @example
   * //  {
   * //    code: 200,
   * //    msg: {
   * //      cpuload: '3%',
   * //      cputemp: 34,
   * //      deviceId: 'd7581c6f72865e72909665ebd76713f5',
   * //      hwaddr: '0A:7F:0E:F7:E2:A3',
   * //      ip: '192.168.3.34',
   * //      memtotal: '23716',
   * //      memuse: '3885',
   * //      mmctotal: '239280',
   * //      mmcuse: '216125',
   * //      model: 'q1_10',
   * //      version: 'QL-q1-2024.v0.2.9.202412201800'
   * //    }
   * //  }
   */
  async getHardwareConfig(): Promise<ApiResponse<HardwareConfig>> {
    const response = await this.server.request<ApiResponse<HardwareConfig>>('get', '/get_hardware_cfg');
    return response.data;
  }

  /**
   * 获取主机系统信息
   * @param {string} hostIp 主机IP地址，用于指定要获取系统信息的主机
   * @returns {Promise<ApiResponse<SystemInfo>>} 返回Promise对象，包含完整响应（code和系统信息）
   * @example
   * // {"code": 200, 
   * //     "msg": {
   * //         "cpu": 5.4,                                 #cpu 使用 百分比
   * //         "disk_percent": 39.3,                        #硬盘 已使用 百分比
   * //         "disk_total": 250903556096,                 #硬盘 总大小  单位 :bytes
   * //         "mem_percent": 63.9,                        #内存 已使用 百分比
   * //         "mem_total": 16720510976,                   #内存 总大小 单位 :bytes
   * //         "temperatures": 29.615                       #cpu 温度
   * //     }
   * // }
   */
  async getSystemInfo(hostIp: string): Promise<ApiResponse<SystemInfo>> {
    const response = await this.server.request<ApiResponse<SystemInfo>>('get', `/get_systeminfo/${hostIp}`);
    return response.data;
  }

  /**
   * 重启本机
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ''}
   */
  async rebootLocal(): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', '/reboot_for_arm');
    return response.data;
  }

  /**
   * 重启指定主机
   * @param {string} hostIp 主机IP地址，用于指定要重启的主机
   * @param {RebootHostOptions} [options] 重启选项
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ''}
   */
  async rebootHost(
    hostIp: string,
    options?: RebootHostOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/reboot_host/${hostIp}`, {
      params: {
        isblock: options?.isblock ?? 0,
        timeout: options?.timeout ?? 15,
        ssh_uname: options?.ssh_uname ?? 'user',
        ssh_pwd: options?.ssh_pwd ?? 'myt',
        root_pwd: options?.root_pwd ?? 'myt'
      }
    });
    
    return response.data;
  }

  /**
   * 重置主机（将清空所有的容器及镜像和数据）
   * @param {string} ip 主机IP地址，用于指定要重置的主机
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async resetHost(ip: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/reset/${ip}`);
    return response.data;
  }

  /**
   * 管理定时重启任务
   * @param {'query' | 'add' | 'remove'} act 操作类型：query(查询)/add(添加)/remove(删除)
   * @param {string} [data] 任务数据，格式取决于act类型
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ''}
   */
  async manageRebootTask(
    act: 'query' | 'add' | 'remove',
    data?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/scheduler_reboot_task/${act}`, {
      params: data ? { data } : undefined
    });
    return response.data;
  }

  /**
   * 设置Q1风扇速率
   * @param {'query' | 'set'} act 操作类型：query(查询)/set(设置)
   * @param {FanOptions} [options] 风扇设置选项
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ''}
   */
  async setQ1Fan(
    act: 'query' | 'set',
    options?: FanOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_q1_fan/${act}`, {
      params: {
        mode: options?.mode ?? 0,
        speed: options?.speed ?? 1
      }
    });
    return response.data;
  }

  /**
   * 设置Swap分区状态
   * @param {string} hostIp 主机IP地址，用于指定要设置Swap分区的主机
   * @param {0 | 1} enable 是否启用Swap分区，可选值：1(开启) 0(关闭)
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setSwap(hostIp: string, enable: 0 | 1): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/swap/${hostIp}/${enable}`);
    return response.data;
  }

  /**
   * 获取本机系统信息（仅当SDK运行在3588上有效）
   * @returns {Promise<ApiResponse<LocalSystemInfo>>} 返回Promise对象，包含完整响应（code和本地系统信息）
   * @example
   * // {"code": 200, 
   * // "msg": {
   * //     "cpu": 5.4,                                 #cpu 使用 百分比
   * //     "disk_percent": 39.3,                        #硬盘 已使用 百分比
   * //     "disk_total": 250903556096,                 #硬盘 总大小  单位 :bytes
   * //     "mem_percent": 63.9,                        #内存 已使用 百分比
   * //     "mem_total": 16720510976,                   #内存 总大小 单位 :bytes
   * //     "temperatures": 29.615,                      #cpu 温度
   * //     "swap_total": 0,                            #swap 总大小 单位 :bytes  0则表示未开启虚拟内存
   * //     "swap_percent": 20.0                        #swap 已使用 百分比  0则表示未开启虚拟内存
   * // }}
   */
  async getLocalSystemInfo(): Promise<ApiResponse<LocalSystemInfo>> {
    const response = await this.server.request<ApiResponse<LocalSystemInfo>>('get', '/systeminfo');
    return response.data;
  }
} 