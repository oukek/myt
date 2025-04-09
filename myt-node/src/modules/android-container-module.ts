import { OukekMytServer } from '../myt-server';

export class AndroidContainerModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 批量创建安卓容器
   * @param ip 主机IP地址，用于指定创建容器的目标主机
   * @param num 创建数量，指定要创建的容器数量
   * @param preName 容器名称前缀，所有创建的容器名称将以此前缀开头
   * @param force 是否强制创建，1表示强制创建，0表示非强制创建
   * @param options 可选参数，用于配置容器的各项属性
   * @param options.sandbox 沙盒模式，1启用，0禁用
   * @param options.sandbox_size 沙盒大小，单位MB
   * @param options.image_addr 镜像地址，指定容器使用的镜像
   * @param options.memory 内存大小，单位MB
   * @param options.cpu CPU核心数，如"1"表示1核
   * @param options.resolution 分辨率，如720表示720p
   * @param options.dns DNS服务器地址
   * @param options.width 屏幕宽度，单位像素
   * @param options.height 屏幕高度，单位像素
   * @param options.dpi 屏幕DPI值
   * @param options.fps 帧率，如30表示30fps
   * @param options.data_res 数据分辨率
   * @param options.mac MAC地址
   * @param options.random_dev 随机设备号，1启用，0禁用
   * @param options.s5ip Socks5代理IP
   * @param options.s5port Socks5代理端口
   * @param options.s5user Socks5代理用户名
   * @param options.s5pwd Socks5代理密码
   * @param options.dnstcp_mode DNS TCP模式，1启用，0禁用
   * @param options.rpaport RPA端口号
   * @param options.initdev 初始化设备
   * @param options.enforce 强制模式，1启用，0禁用
   * @param options.yktid 云控ID
   * @param options.ykuser 云控用户名
   * @param options.yktoken 云控令牌
   * @param options.ykbitrate 云控码率
   * @param options.phyinput 物理输入，1启用，0禁用
   * @param options.adbport ADB端口号
   * @param options.timeoffset 时间偏移量
   * @param options.enablemeid 启用MEID，1启用，0禁用
   * @param options.tcp_map_port TCP映射端口
   * @param options.udp_map_port UDP映射端口
   * @param options.img_url 镜像URL
   * @param networkConfig 网络配置信息
   * @param networkConfig.gw 网关地址
   * @param networkConfig.ip IP地址
   * @param networkConfig.subnet 子网掩码
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async batchCreate(
    ip: string,
    num: string,
    preName: string,
    force: string,
    options?: {
      sandbox?: number;
      sandbox_size?: number;
      image_addr?: string;
      memory?: number;
      cpu?: string;
      resolution?: number;
      dns?: string;
      width?: number;
      height?: number;
      dpi?: number;
      fps?: number;
      data_res?: string;
      mac?: string;
      random_dev?: number;
      s5ip?: string;
      s5port?: number;
      s5user?: string;
      s5pwd?: string;
      dnstcp_mode?: number;
      rpaport?: number;
      initdev?: string;
      enforce?: number;
      yktid?: string;
      ykuser?: string;
      yktoken?: string;
      ykbitrate?: string;
      phyinput?: number;
      adbport?: number;
      timeoffset?: number;
      enablemeid?: number;
      tcp_map_port?: string;
      udp_map_port?: string;
      img_url?: string;
    },
    networkConfig?: {
      gw: string;
      ip: string;
      subnet: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/batch_create/${ip}/${num}/${preName}/${force}`, {
        params: options,
        data: networkConfig
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('批量创建安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 复制安卓容器
   * @param ip 主机IP地址，用于指定源容器所在的主机
   * @param srcName 源容器名称，指定要复制的容器
   * @param dstName 目标容器名称，新创建的容器名称
   * @param index 目标容器索引，指定新容器在主机上的位置（1-12）
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ''}
   */
  async copy(
    ip: string,
    srcName: string,
    dstName: string,
    index: number
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/copy/${ip}/${srcName}/${dstName}/${index}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('复制安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 复制指定型号的安卓容器
   * @param ip 主机IP地址，用于指定源容器所在的主机
   * @param srcName 源容器名称，指定要复制的容器
   * @param dstName 目标容器名称，新创建的容器名称
   * @param index 目标容器索引，指定新容器在主机上的位置（1-12）
   * @param model 设备型号，可选值：'a1'/'c1'/'p1'，分别表示不同的设备型号
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ''}
   */
  async copyAndroid(
    ip: string,
    srcName: string,
    dstName: string,
    index: number,
    model: 'a1' | 'c1' | 'p1'
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/copy_android/${ip}/${srcName}/${dstName}/${index}/${model}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('复制指定型号安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 创建安卓容器
   * @param ip 主机IP地址，用于指定创建容器的目标主机
   * @param index 容器索引，指定容器在主机上的位置（1-12）
   * @param name 容器名称，新创建的容器名称
   * @param options 可选参数，用于配置容器的各项属性
   * @param options.sandbox 沙盒模式，1启用，0禁用
   * @param options.sandbox_size 沙盒大小，单位MB
   * @param options.image_addr 镜像地址，指定容器使用的镜像
   * @param options.memory 内存大小，单位MB
   * @param options.cpu CPU核心数，如"1"表示1核
   * @param options.resolution 分辨率，如720表示720p
   * @param options.dns DNS服务器地址
   * @param options.width 屏幕宽度，单位像素
   * @param options.height 屏幕高度，单位像素
   * @param options.dpi 屏幕DPI值
   * @param options.fps 帧率，如30表示30fps
   * @param options.data_res 数据分辨率
   * @param options.mac MAC地址
   * @param options.random_dev 随机设备号，1启用，0禁用
   * @param options.s5ip Socks5代理IP
   * @param options.s5port Socks5代理端口
   * @param options.s5user Socks5代理用户名
   * @param options.s5pwd Socks5代理密码
   * @param options.dnstcp_mode DNS TCP模式，1启用，0禁用
   * @param options.rpaport RPA端口号
   * @param options.initdev 初始化设备
   * @param options.enforce 强制模式，1启用，0禁用
   * @param options.yktid 云控ID
   * @param options.ykuser 云控用户名
   * @param options.yktoken 云控令牌
   * @param options.ykbitrate 云控码率
   * @param options.phyinput 物理输入，1启用，0禁用
   * @param options.adbport ADB端口号
   * @param options.timeoffset 时间偏移量
   * @param options.enablemeid 启用MEID，1启用，0禁用
   * @param options.tcp_map_port TCP映射端口
   * @param options.udp_map_port UDP映射端口
   * @param options.img_url 镜像URL
   * @param networkConfig 网络配置信息
   * @param networkConfig.gw 网关地址
   * @param networkConfig.ip IP地址
   * @param networkConfig.subnet 子网掩码
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async create(
    ip: string,
    index: number,
    name: string,
    options?: {
      sandbox?: number;
      sandbox_size?: number;
      image_addr?: string;
      memory?: number;
      cpu?: string;
      resolution?: number;
      dns?: string;
      width?: number;
      height?: number;
      dpi?: number;
      fps?: number;
      data_res?: string;
      mac?: string;
      random_dev?: number;
      s5ip?: string;
      s5port?: number;
      s5user?: string;
      s5pwd?: string;
      dnstcp_mode?: number;
      rpaport?: number;
      initdev?: string;
      enforce?: number;
      yktid?: string;
      ykuser?: string;
      yktoken?: string;
      ykbitrate?: string;
      phyinput?: number;
      adbport?: number;
      timeoffset?: number;
      enablemeid?: number;
      tcp_map_port?: string;
      udp_map_port?: string;
      img_url?: string;
    },
    networkConfig?: {
      gw: string;
      ip: string;
      subnet: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/create/${ip}/${index}/${name}`, {
        params: options,
        data: networkConfig
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('创建安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 创建A1型号的安卓容器
   * @param ip 主机IP地址，用于指定创建容器的目标主机
   * @param index 容器索引，指定容器在主机上的位置（1-12）
   * @param name 容器名称，新创建的容器名称
   * @param options 可选参数，用于配置容器的各项属性
   * @param options.sandbox 沙盒模式，1启用，0禁用
   * @param options.sandbox_size 沙盒大小，单位MB
   * @param options.image_addr 镜像地址，指定容器使用的镜像
   * @param options.memory 内存大小，单位MB
   * @param options.cpu CPU核心数，如"1"表示1核
   * @param options.resolution 分辨率，如720表示720p
   * @param options.dns DNS服务器地址
   * @param options.width 屏幕宽度，单位像素
   * @param options.height 屏幕高度，单位像素
   * @param options.dpi 屏幕DPI值
   * @param options.fps 帧率，如30表示30fps
   * @param options.data_res 数据分辨率
   * @param options.mac MAC地址
   * @param options.random_dev 随机设备号，1启用，0禁用
   * @param options.s5ip Socks5代理IP
   * @param options.s5port Socks5代理端口
   * @param options.s5user Socks5代理用户名
   * @param options.s5pwd Socks5代理密码
   * @param options.dnstcp_mode DNS TCP模式，1启用，0禁用
   * @param options.rpaport RPA端口号
   * @param options.initdev 初始化设备
   * @param options.enforce 强制模式，1启用，0禁用
   * @param options.yktid 云控ID
   * @param options.ykuser 云控用户名
   * @param options.yktoken 云控令牌
   * @param options.ykbitrate 云控码率
   * @param options.phyinput 物理输入，1启用，0禁用
   * @param options.adbport ADB端口号
   * @param options.timeoffset 时间偏移量
   * @param options.enablemeid 启用MEID，1启用，0禁用
   * @param options.tcp_map_port TCP映射端口
   * @param options.udp_map_port UDP映射端口
   * @param options.img_url 镜像URL
   * @param networkConfig 网络配置信息
   * @param networkConfig.gw 网关地址
   * @param networkConfig.ip IP地址
   * @param networkConfig.subnet 子网掩码
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async createA1(
    ip: string,
    index: number,
    name: string,
    options?: {
      sandbox?: number;
      sandbox_size?: number;
      image_addr?: string;
      memory?: number;
      cpu?: string;
      resolution?: number;
      dns?: string;
      width?: number;
      height?: number;
      dpi?: number;
      fps?: number;
      data_res?: string;
      mac?: string;
      random_dev?: number;
      s5ip?: string;
      s5port?: number;
      s5user?: string;
      s5pwd?: string;
      dnstcp_mode?: number;
      rpaport?: number;
      initdev?: string;
      enforce?: number;
      yktid?: string;
      ykuser?: string;
      yktoken?: string;
      ykbitrate?: string;
      phyinput?: number;
      adbport?: number;
      timeoffset?: number;
      enablemeid?: number;
      tcp_map_port?: string;
      udp_map_port?: string;
      img_url?: string;
    },
    networkConfig?: {
      gw: string;
      ip: string;
      subnet: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/create_A1/${ip}/${index}/${name}`, {
        params: options,
        data: networkConfig
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('创建A1型号安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 创建P1型号的安卓容器
   * @param ip 主机IP地址，用于指定创建容器的目标主机
   * @param index 容器索引，指定容器在主机上的位置（1-12）
   * @param name 容器名称，新创建的容器名称
   * @param options 可选参数，用于配置容器的各项属性
   * @param options.sandbox 沙盒模式，1启用，0禁用
   * @param options.sandbox_size 沙盒大小，单位MB
   * @param options.image_addr 镜像地址，指定容器使用的镜像
   * @param options.memory 内存大小，单位MB
   * @param options.cpu CPU核心数，如"1"表示1核
   * @param options.resolution 分辨率，如720表示720p
   * @param options.dns DNS服务器地址
   * @param options.width 屏幕宽度，单位像素
   * @param options.height 屏幕高度，单位像素
   * @param options.dpi 屏幕DPI值
   * @param options.fps 帧率，如30表示30fps
   * @param options.data_res 数据分辨率
   * @param options.mac MAC地址
   * @param options.random_dev 随机设备号，1启用，0禁用
   * @param options.s5ip Socks5代理IP
   * @param options.s5port Socks5代理端口
   * @param options.s5user Socks5代理用户名
   * @param options.s5pwd Socks5代理密码
   * @param options.dnstcp_mode DNS TCP模式，1启用，0禁用
   * @param options.rpaport RPA端口号
   * @param options.initdev 初始化设备
   * @param options.enforce 强制模式，1启用，0禁用
   * @param options.yktid 云控ID
   * @param options.ykuser 云控用户名
   * @param options.yktoken 云控令牌
   * @param options.ykbitrate 云控码率
   * @param options.phyinput 物理输入，1启用，0禁用
   * @param options.adbport ADB端口号
   * @param options.timeoffset 时间偏移量
   * @param options.enablemeid 启用MEID，1启用，0禁用
   * @param options.tcp_map_port TCP映射端口
   * @param options.udp_map_port UDP映射端口
   * @param options.img_url 镜像URL
   * @param networkConfig 网络配置信息
   * @param networkConfig.gw 网关地址
   * @param networkConfig.ip IP地址
   * @param networkConfig.subnet 子网掩码
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async createP1(
    ip: string,
    index: number,
    name: string,
    options?: {
      sandbox?: number;
      sandbox_size?: number;
      image_addr?: string;
      memory?: number;
      cpu?: string;
      resolution?: number;
      dns?: string;
      width?: number;
      height?: number;
      dpi?: number;
      fps?: number;
      data_res?: string;
      mac?: string;
      random_dev?: number;
      s5ip?: string;
      s5port?: number;
      s5user?: string;
      s5pwd?: string;
      dnstcp_mode?: number;
      rpaport?: number;
      initdev?: string;
      enforce?: number;
      yktid?: string;
      ykuser?: string;
      yktoken?: string;
      ykbitrate?: string;
      phyinput?: number;
      adbport?: number;
      timeoffset?: number;
      enablemeid?: number;
      tcp_map_port?: string;
      udp_map_port?: string;
      img_url?: string;
    },
    networkConfig?: {
      gw: string;
      ip: string;
      subnet: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/create_P1/${ip}/${index}/${name}`, {
        params: options,
        data: networkConfig
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('创建P1型号安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 导出安卓容器到本地
   * @param ip 主机IP地址，用于指定要导出的容器所在的主机
   * @param name 容器名称，指定要导出的容器
   * @param local 本地文件完整路径，指定导出文件的保存位置
   * @param imgcompress 是否启用Img文件压缩，1启用，0禁用
   * @returns {Promise<string | null>} 返回Promise对象，成功时返回导出文件的完整路径，失败时返回null
   * @example
   * // {"code": 200, "msg": "c:/sdk/backup/1234.tar.gz"}
   */
  async export(
    ip: string,
    name: string,
    local?: string,
    imgcompress?: number
  ): Promise<string | null> {
    try {
      const response = await this.server.request('get', `/export/${ip}/${name}`, {
        params: { local, imgcompress }
      });
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('导出安卓容器失败:', error);
      return null;
    }
  }

  /**
   * 获取安卓容器列表
   * @param ip 主机IP地址，用于指定要查询的主机
   * @param index 实例编号(坑位号)，可选值1-12，用于筛选特定位置的容器
   * @param name 容器实例名称，用于筛选特定名称的容器
   * @returns {Promise<Array<{
   *   Names: string;      // 容器名称
   *   State: string;      // 容器状态
   *   data: string;       // 容器数据
   *   index: number;      // 容器索引
   *   ip: string;         // 容器IP地址
   * }> | null>} 返回Promise对象，成功时返回容器列表数组，失败时返回null
   * @example
   * // {"code": 200, "msg": [{"Names": "container1", "State": "running", ...}]}
   */
  async getList(
    ip: string,
    index?: number,
    name?: string
  ): Promise<Array<{
    Names: string;
    State: string;
    data: string;
    index: number;
    ip: string;
  }> | null> {
    try {
      const response = await this.server.request('get', `/get/${ip}`, {
        params: { index, name }
      });
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取安卓容器列表失败:', error);
      return null;
    }
  }

  /**
   * 获取安卓实例详细信息
   * @param ip 主机IP地址，用于指定要查询的容器所在的主机
   * @param name 安卓实例名称，指定要查询的容器
   * @returns {Promise<{
   *   cpuset: string;     // CPU核心设置
   *   dns: string;        // DNS服务器地址
   *   dpi: string;        // 屏幕DPI值
   *   fps: string;        // 帧率
   *   hardware: string;   // 硬件信息
   *   height: string;     // 屏幕高度
   *   id: string;         // 容器ID
   *   image: string;      // 镜像信息
   *   index: number;      // 容器索引
   *   ip: string;         // 容器IP地址
   *   local_ip: string;   // 本地IP地址
   *   memory: number;     // 内存大小
   *   name: string;       // 容器名称
   *   network: string;    // 网络信息
   *   rpa: string;        // RPA信息
   *   status: string;     // 容器状态
   *   width: string;      // 屏幕宽度
   * } | null>} 返回Promise对象，成功时返回容器详细信息对象，失败时返回null
   * @example
   * // {"code": 200, "msg": {"cpuset": "", "dns": "223.5.5.5", ...}}
   */
  async getDetail(
    ip: string,
    name: string
  ): Promise<{
    cpuset: string;
    dns: string;
    dpi: string;
    fps: string;
    hardware: string;
    height: string;
    id: string;
    image: string;
    index: number;
    ip: string;
    local_ip: string;
    memory: number;
    name: string;
    network: string;
    rpa: string;
    status: string;
    width: string;
  } | null> {
    try {
      const response = await this.server.request('get', `/get_android_detail/${ip}/${name}`);
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取安卓实例详情失败:', error);
      return null;
    }
  }

  /**
   * 获取主机版本信息
   * @param ip 主机IP地址，用于指定要查询的主机
   * @returns {Promise<string | null>} 返回Promise对象，成功时返回版本信息字符串，失败时返回null
   * @example
   * // {"code": 200, "msg": "version info"}
   */
  async getHostVersion(ip: string): Promise<string | null> {
    try {
      const response = await this.server.request('get', `/get_host_ver/${ip}`);
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取主机版本信息失败:', error);
      return null;
    }
  }

  /**
   * 导入备份文件到安卓容器
   * @param ip 主机IP地址，用于指定要导入容器的主机
   * @param newName 还原的容器名称，指定新创建的容器名称
   * @param index 容器运行的坑位信息，指定容器在主机上的位置（1-12）
   * @param local 本地的备份文件路径，指定要导入的备份文件位置
   * @param rpaPort RPA端口，可选参数，指定RPA服务的端口号
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "执行完成!"}
   */
  async import(
    ip: string,
    newName: string,
    index: number,
    local: string,
    rpaPort?: number
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/import/${ip}/${newName}/${index}`, {
        params: { local, rpa_port: rpaPort }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('导入备份文件失败:', error);
      return false;
    }
  }

  /**
   * 管理导出的文件列表
   * @param act 动作类型，可选值：'list'（列出文件）/'del'（删除文件）/'get'（获取文件）
   * @param local 文件路径，当act为'del'或'get'时必填，指定要操作的文件路径
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "执行完成!"}
   */
  async manageExportFiles(
    act: 'list' | 'del' | 'get',
    local?: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/mgr_export_filelist/${act}`, {
        params: { local }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('管理导出文件失败:', error);
      return false;
    }
  }

  /**
   * 清理未使用的镜像
   * @param ip 主机IP地址，用于指定要清理镜像的主机
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async pruneImages(ip: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/prune_images/${ip}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('清理未使用的镜像失败:', error);
      return false;
    }
  }

  /**
   * 拉取镜像
   * @param ip 主机IP地址，用于指定要拉取镜像的主机
   * @param imageAddr 镜像地址，指定要拉取的镜像地址
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async pullImage(ip: string, imageAddr: string): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/pull_image/${ip}`, {
        params: { image_addr: imageAddr }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('拉取镜像失败:', error);
      return false;
    }
  }

  /**
   * 拉取镜像(方法2)
   * @param ip 主机IP地址，用于指定要拉取镜像的主机
   * @param imageAddr 镜像地址，指定要拉取的镜像地址
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async pullImage2(ip: string, imageAddr: string): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/pull_image2/${ip}`, {
        params: { image_addr: imageAddr }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('拉取镜像失败:', error);
      return false;
    }
  }

  /**
   * 重启安卓容器
   * @param ip 主机IP地址，用于指定要重启的容器所在的主机
   * @param name 容器名称，指定要重启的容器
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async reboot(ip: string, name: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/reboot/${ip}/${name}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('重启安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 删除安卓容器
   * @param ip 主机IP地址，用于指定要删除的容器所在的主机
   * @param name 容器名称，指定要删除的容器
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async remove(ip: string, name: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/remove/${ip}/${name}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('删除安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 重命名容器名称
   * @param ip 主机IP地址，用于指定要重命名的容器所在的主机
   * @param oldName 原来的名称，指定要重命名的容器当前名称
   * @param newName 新的名称，指定容器的新名称
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async rename(ip: string, oldName: string, newName: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/rename/${ip}/${oldName}/${newName}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('重命名容器失败:', error);
      return false;
    }
  }

  /**
   * 重置安卓容器
   * @param ip 主机IP地址，用于指定要重置的容器所在的主机
   * @param name 容器名称，指定要重置的容器
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async reset(ip: string, name: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/reset/${ip}/${name}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('重置安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 重置网络对象
   * @param ip 主机IP地址，用于指定要重置网络的主机
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async resetNetwork(ip: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/reset_network/${ip}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('重置网络对象失败:', error);
      return false;
    }
  }

  /**
   * 运行安卓容器
   * @param ip 主机IP地址，用于指定要运行的容器所在的主机
   * @param name 容器名称，指定要运行的容器
   * @param force 是否强制运行，1表示强制运行，0表示非强制运行，默认为0
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async run(ip: string, name: string, force: number = 0): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/run/${ip}/${name}`, {
        params: { force }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('运行安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 停止安卓容器
   * @param ip 主机IP地址，用于指定要停止的容器所在的主机
   * @param name 容器名称，指定要停止的容器
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async stop(ip: string, name: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/stop/${ip}/${name}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('停止安卓容器失败:', error);
      return false;
    }
  }

  /**
   * 更新容器配置
   * @param ip 主机IP地址，用于指定要更新的容器所在的主机
   * @param name 容器名称，指定要更新的容器
   * @param options 更新选项，用于配置要更新的容器属性
   * @param options.dns DNS服务器地址
   * @param options.index 容器索引，指定容器在主机上的位置（1-12）
   * @param options.image_addr 镜像地址，指定容器使用的镜像
   * @param options.name 容器名称，指定容器的新名称
   * @param options.network 网络模式，1启用，0禁用
   * @param options.fps 帧率，如30表示30fps
   * @param options.mac MAC地址
   * @param options.enforce 强制模式，1启用，0禁用
   * @param options.resolution 分辨率，如720表示720p
   * @param options.width 屏幕宽度，单位像素
   * @param options.height 屏幕高度，单位像素
   * @param options.dpi 屏幕DPI值
   * @param options.model 设备型号
   * @param options.yktid 云控ID
   * @param options.ykuser 云控用户名
   * @param options.yktoken 云控令牌
   * @param options.ykbitrate 云控码率
   * @param networkConfig 网络配置信息
   * @param networkConfig.gw 网关地址
   * @param networkConfig.ip IP地址
   * @param networkConfig.subnet 子网掩码
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async update(
    ip: string,
    name: string,
    options?: {
      dns?: string;
      index?: number;
      image_addr?: string;
      name?: string;
      network?: number;
      fps?: number;
      mac?: string;
      enforce?: number;
      resolution?: number;
      width?: number;
      height?: number;
      dpi?: number;
      model?: string;
      yktid?: string;
      ykuser?: string;
      yktoken?: string;
      ykbitrate?: string;
    },
    networkConfig?: {
      gw: string;
      ip: string;
      subnet: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/update/${ip}/${name}`, {
        params: options,
        data: networkConfig
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('更新容器配置失败:', error);
      return false;
    }
  }

  /**
   * 上传URL文件到安卓容器
   * @param ip 主机IP地址，用于指定要上传文件的目标容器所在的主机
   * @param name 容器名称，指定要上传文件的目标容器
   * @param url 文件URL，指定要上传的文件的URL地址
   * @param remotePath 远程保存路径，指定文件在容器中的保存位置
   * @param retry 重试次数，指定上传失败时的重试次数，默认为0
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async uploadFileFromUrl(
    ip: string,
    name: string,
    url: string,
    remotePath: string,
    retry: number = 0
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/upload2_file/${ip}/${name}`, {
        data: {
          url,
          remote_path: remotePath,
          retry
        }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('上传URL文件失败:', error);
      return false;
    }
  }

  /**
   * 上传导入的文件到目录
   * @param url 文件URL，指定要上传的文件的URL地址
   * @param remotePath 远程保存路径，指定文件在容器中的保存位置
   * @param retry 重试次数，指定上传失败时的重试次数，默认为0
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "执行完成!"}
   */
  async uploadImportFileFromUrl(
    url: string,
    remotePath: string,
    retry: number = 0
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', '/upload_import_file_fromUrl', {
        data: {
          url,
          remote_path: remotePath,
          retry
        }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('上传导入文件失败:', error);
      return false;
    }
  }
} 