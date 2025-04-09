import { OukekMytServer } from '../myt-server';

export class HostModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取主机配置信息
   * @returns {Promise<{
   *   cpuload: string;      // CPU负载百分比
   *   cputemp: number;      // CPU温度
   *   deviceId: string;     // 设备ID
   *   hwaddr: string;       // 硬件地址
   *   ip: string;           // IP地址
   *   memtotal: string;     // 内存总量
   *   memuse: string;       // 已使用内存
   *   mmctotal: string;     // MMC存储总量
   *   mmcuse: string;       // MMC已使用量
   *   model: string;        // 设备型号
   *   version: string;      // 固件版本
   * } | null>} 返回Promise对象，成功时返回主机配置信息对象，失败时返回null
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
  async getHardwareConfig(): Promise<{
    cpuload: string;
    cputemp: number;
    deviceId: string;
    hwaddr: string;
    ip: string;
    memtotal: string;
    memuse: string;
    mmctotal: string;
    mmcuse: string;
    model: string;
    version: string;
  } | null> {
    try {
      const response = await this.server.request('get', '/get_hardware_cfg');
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取主机配置信息失败:', error);
      return null;
    }
  }

  /**
   * 获取主机系统信息
   * @param {string} hostIp 主机IP地址，用于指定要获取系统信息的主机
   * @returns {Promise<{
   *   cpu: number;              // CPU使用率百分比
   *   disk_percent: number;     // 硬盘使用率百分比
   *   disk_total: number;       // 硬盘总大小，单位：bytes
   *   mem_percent: number;      // 内存使用率百分比
   *   mem_total: number;        // 内存总大小，单位：bytes
   *   temperatures: number;     // CPU温度
   * } | null>} 返回Promise对象，成功时返回系统信息对象，失败时返回null
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
  async getSystemInfo(hostIp: string): Promise<{
    cpu: number;
    disk_percent: number;
    disk_total: number;
    mem_percent: number;
    mem_total: number;
    temperatures: number;
  } | null> {
    try {
      const response = await this.server.request('get', `/get_systeminfo/${hostIp}`);
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取主机系统信息失败:', error);
      return null;
    }
  }

  /**
   * 重启本机
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ''}
   */
  async rebootLocal(): Promise<boolean> {
    try {
      const response = await this.server.request('get', '/reboot_for_arm');
      return response.data.code === 200;
    } catch (error) {
      console.error('重启本机失败:', error);
      return false;
    }
  }

  /**
   * 重启指定主机
   * @param {string} hostIp 主机IP地址，用于指定要重启的主机
   * @param {Object} [options] 可选参数对象
   * @param {number} [options.isblock] 是否阻塞等待，可选值：0(非阻塞) 1(阻塞)
   * @param {number} [options.timeout] 超时时间(秒)，默认15秒
   * @param {string} [options.ssh_uname] SSH用户名，默认'user'
   * @param {string} [options.ssh_pwd] SSH密码，默认'myt'
   * @param {string} [options.root_pwd] root密码，默认'myt'
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ''}
   */
  async rebootHost(
    hostIp: string,
    options?: {
      isblock?: number;
      timeout?: number;
      ssh_uname?: string;
      ssh_pwd?: string;
      root_pwd?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/reboot_host/${hostIp}`, {
        params: {
          isblock: options?.isblock ?? 0,
          timeout: options?.timeout ?? 15,
          ssh_uname: options?.ssh_uname ?? 'user',
          ssh_pwd: options?.ssh_pwd ?? 'myt',
          root_pwd: options?.root_pwd ?? 'myt'
        }
      });
      
      return response.data.code === 200;
    } catch (error) {
      console.error('重启主机失败:', error);
      return false;
    }
  }

  /**
   * 重置主机（将清空所有的容器及镜像和数据）
   * @param {string} ip 主机IP地址，用于指定要重置的主机
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async resetHost(ip: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/reset/${ip}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('重置主机失败:', error);
      return false;
    }
  }

  /**
   * 管理定时重启任务
   * @param {'query' | 'add' | 'remove'} act 操作类型：query(查询)/add(添加)/remove(删除)
   * @param {string} [data] 任务数据，格式取决于act类型
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ''}
   */
  async manageRebootTask(
    act: 'query' | 'add' | 'remove',
    data?: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/scheduler_reboot_task/${act}`, {
        params: data ? { data } : undefined
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('管理定时重启任务失败:', error);
      return false;
    }
  }

  /**
   * 设置Q1风扇速率
   * @param {'query' | 'set'} act 操作类型：query(查询)/set(设置)
   * @param {Object} [options] 可选参数对象
   * @param {number} [options.mode] 风扇模式，可选值：0(自动) 1(手动)
   * @param {number} [options.speed] 风扇速度，可选值：1-5(对应20%-100%)
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ''}
   */
  async setQ1Fan(
    act: 'query' | 'set',
    options?: {
      mode?: number;  // 0:自动 1:手动
      speed?: number; // 1-5: 20%-100%
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/set_q1_fan/${act}`, {
        params: {
          mode: options?.mode ?? 0,
          speed: options?.speed ?? 1
        }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('设置Q1风扇速率失败:', error);
      return false;
    }
  }

  /**
   * 设置Swap分区状态
   * @param {string} hostIp 主机IP地址，用于指定要设置Swap分区的主机
   * @param {0 | 1} enable 是否启用Swap分区，可选值：1(开启) 0(关闭)
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setSwap(hostIp: string, enable: 0 | 1): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/swap/${hostIp}/${enable}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('设置Swap分区状态失败:', error);
      return false;
    }
  }

  /**
   * 获取本机系统信息（仅当SDK运行在3588上有效）
   * @returns {Promise<{
   *   cpu: number;              // CPU使用率百分比
   *   disk_percent: number;     // 硬盘使用率百分比
   *   disk_total: number;       // 硬盘总大小，单位：bytes
   *   mem_percent: number;      // 内存使用率百分比
   *   mem_total: number;        // 内存总大小，单位：bytes
   *   temperatures: number;     // CPU温度
   *   swap_total: number;       // Swap分区总大小，单位：bytes，0表示未开启虚拟内存
   *   swap_percent: number;     // Swap分区使用率百分比，0表示未开启虚拟内存
   * } | null>} 返回Promise对象，成功时返回系统信息对象，失败时返回null
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
  async getLocalSystemInfo(): Promise<{
    cpu: number;
    disk_percent: number;
    disk_total: number;
    mem_percent: number;
    mem_total: number;
    temperatures: number;
    swap_total: number;
    swap_percent: number;
  } | null> {
    try {
      const response = await this.server.request('get', '/systeminfo');
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取本机系统信息失败:', error);
      return null;
    }
  }
} 