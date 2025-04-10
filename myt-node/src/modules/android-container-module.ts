import { OukekMytServer } from '../myt-server';
import { 
  ApiResponse, 
  ContainerCreateOptions, 
  NetworkConfig, 
  ContainerListItem, 
  ContainerDetail, 
  UploadFileOptions, 
  ExportFileAction,
  ContainerUpdateOptions,
  DeviceModelType
} from './type';

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
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async batchCreate(
    ip: string,
    num: string,
    preName: string,
    force: string,
    options?: ContainerCreateOptions,
    networkConfig?: NetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/batch_create/${ip}/${num}/${preName}/${force}`, {
      params: options,
      data: networkConfig
    });
    
    return response.data;
  }

  /**
   * 复制安卓容器
   * @param ip 主机IP地址，用于指定源容器所在的主机
   * @param srcName 源容器名称，指定要复制的容器
   * @param dstName 目标容器名称，新创建的容器名称
   * @param index 目标容器索引，指定新容器在主机上的位置（1-12）
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ''}
   */
  async copy(
    ip: string,
    srcName: string,
    dstName: string,
    index: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/copy/${ip}/${srcName}/${dstName}/${index}`);
    
    return response.data;
  }

  /**
   * 复制指定型号的安卓容器
   * @param ip 主机IP地址，用于指定源容器所在的主机
   * @param srcName 源容器名称，指定要复制的容器
   * @param dstName 目标容器名称，新创建的容器名称
   * @param index 目标容器索引，指定新容器在主机上的位置（1-12）
   * @param model 设备型号，可选值：'a1'/'c1'/'p1'，分别表示不同的设备型号
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ''}
   */
  async copyAndroid(
    ip: string,
    srcName: string,
    dstName: string,
    index: number,
    model: DeviceModelType
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/copy_android/${ip}/${srcName}/${dstName}/${index}/${model}`);
    
    return response.data;
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
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async create(
    ip: string,
    index: number,
    name: string,
    options?: ContainerCreateOptions,
    networkConfig?: NetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/create/${ip}/${index}/${name}`, {
      params: options,
      data: networkConfig
    });
    
    return response.data;
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
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async createA1(
    ip: string,
    index: number,
    name: string,
    options?: ContainerCreateOptions,
    networkConfig?: NetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/create_A1/${ip}/${index}/${name}`, {
      params: options,
      data: networkConfig
    });
    
    return response.data;
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
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async createP1(
    ip: string,
    index: number,
    name: string,
    options?: ContainerCreateOptions,
    networkConfig?: NetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/create_P1/${ip}/${index}/${name}`, {
      params: options,
      data: networkConfig
    });
    
    return response.data;
  }

  /**
   * 导出安卓容器到本地
   * @param ip 主机IP地址，用于指定要导出的容器所在的主机
   * @param name 容器名称，指定要导出的容器
   * @param local 本地文件完整路径，指定导出文件的保存位置
   * @param imgcompress 是否启用Img文件压缩，1启用，0禁用
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和导出文件的完整路径）
   * @example
   * // {"code": 200, "msg": "c:/sdk/backup/1234.tar.gz"}
   */
  async export(
    ip: string,
    name: string,
    local?: string,
    imgcompress?: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/export/${ip}/${name}`, {
      params: { local, imgcompress }
    });
    
    return response.data;
  }

  /**
   * 获取安卓容器列表
   * @param ip 主机IP地址，用于指定要查询的主机
   * @param index 实例编号(坑位号)，可选值1-12，用于筛选特定位置的容器
   * @param name 容器实例名称，用于筛选特定名称的容器
   * @returns {Promise<ApiResponse<ContainerListItem[]>>} 返回Promise对象，包含完整响应（code和容器列表数组）
   * @example
   * // {"code": 200, "msg": [{"Names": "container1", "State": "running", ...}]}
   */
  async getList(
    ip: string,
    index?: number,
    name?: string
  ): Promise<ApiResponse<ContainerListItem[]>> {
    const response = await this.server.request<ApiResponse<ContainerListItem[]>>('get', `/get/${ip}`, {
      params: { index, name }
    });
    
    return response.data;
  }

  /**
   * 获取安卓实例详细信息
   * @param ip 主机IP地址，用于指定要查询的容器所在的主机
   * @param name 安卓实例名称，指定要查询的容器
   * @returns {Promise<ApiResponse<ContainerDetail>>} 返回Promise对象，包含完整响应（code和容器详细信息对象）
   * @example
   * // {"code": 200, "msg": {"cpuset": "", "dns": "223.5.5.5", ...}}
   */
  async getDetail(
    ip: string,
    name: string
  ): Promise<ApiResponse<ContainerDetail>> {
    const response = await this.server.request<ApiResponse<ContainerDetail>>('get', `/get_android_detail/${ip}/${name}`);
    
    return response.data;
  }

  /**
   * 获取主机版本信息
   * @param ip 主机IP地址，用于指定要查询的主机
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和版本信息字符串）
   * @example
   * // {"code": 200, "msg": "version info"}
   */
  async getHostVersion(ip: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/get_host_ver/${ip}`);
    
    return response.data;
  }

  /**
   * 导入备份文件到安卓容器
   * @param ip 主机IP地址，用于指定要导入容器的主机
   * @param newName 还原的容器名称，指定新创建的容器名称
   * @param index 容器运行的坑位信息，指定容器在主机上的位置（1-12）
   * @param local 本地的备份文件路径，指定要导入的备份文件位置
   * @param rpaPort RPA端口，可选参数，指定RPA服务的端口号
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "执行完成!"}
   */
  async import(
    ip: string,
    newName: string,
    index: number,
    local: string,
    rpaPort?: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/import/${ip}/${newName}/${index}`, {
      params: { local, rpa_port: rpaPort }
    });
    
    return response.data;
  }

  /**
   * 管理导出的文件列表
   * @param act 动作类型，可选值：'list'（列出文件）/'del'（删除文件）/'get'（获取文件）
   * @param local 文件路径，当act为'del'或'get'时必填，指定要操作的文件路径
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "执行完成!"}
   */
  async manageExportFiles(
    act: ExportFileAction,
    local?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/mgr_export_filelist/${act}`, {
      params: { local }
    });
    
    return response.data;
  }

  /**
   * 清理未使用的镜像
   * @param ip 主机IP地址，用于指定要清理镜像的主机
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async pruneImages(ip: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/prune_images/${ip}`);
    
    return response.data;
  }

  /**
   * 拉取镜像
   * @param ip 主机IP地址，用于指定要拉取镜像的主机
   * @param imageAddr 镜像地址，指定要拉取的镜像地址
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async pullImage(ip: string, imageAddr: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/pull_image/${ip}`, {
      params: { image_addr: imageAddr }
    });
    
    return response.data;
  }

  /**
   * 拉取镜像(方法2)
   * @param ip 主机IP地址，用于指定要拉取镜像的主机
   * @param imageAddr 镜像地址，指定要拉取的镜像地址
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async pullImage2(ip: string, imageAddr: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/pull_image2/${ip}`, {
      params: { image_addr: imageAddr }
    });
    
    return response.data;
  }

  /**
   * 重启安卓容器
   * @param ip 主机IP地址，用于指定要重启的容器所在的主机
   * @param name 容器名称，指定要重启的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async reboot(ip: string, name: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/reboot/${ip}/${name}`);
    
    return response.data;
  }

  /**
   * 删除安卓容器
   * @param ip 主机IP地址，用于指定要删除的容器所在的主机
   * @param name 容器名称，指定要删除的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async remove(ip: string, name: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/remove/${ip}/${name}`);
    
    return response.data;
  }

  /**
   * 重命名容器名称
   * @param ip 主机IP地址，用于指定要重命名的容器所在的主机
   * @param oldName 原来的名称，指定要重命名的容器当前名称
   * @param newName 新的名称，指定容器的新名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async rename(ip: string, oldName: string, newName: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/rename/${ip}/${oldName}/${newName}`);
    
    return response.data;
  }

  /**
   * 重置安卓容器
   * @param ip 主机IP地址，用于指定要重置的容器所在的主机
   * @param name 容器名称，指定要重置的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async reset(ip: string, name: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/reset/${ip}/${name}`);
    
    return response.data;
  }

  /**
   * 重置网络对象
   * @param ip 主机IP地址，用于指定要重置网络的主机
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async resetNetwork(ip: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/reset_network/${ip}`);
    
    return response.data;
  }

  /**
   * 运行安卓容器
   * @param ip 主机IP地址，用于指定要运行的容器所在的主机
   * @param name 容器名称，指定要运行的容器
   * @param force 是否强制运行，1表示强制运行，0表示非强制运行，默认为0
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async run(ip: string, name: string, force: number = 0): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/run/${ip}/${name}`, {
      params: { force }
    });
    
    return response.data;
  }

  /**
   * 停止安卓容器
   * @param ip 主机IP地址，用于指定要停止的容器所在的主机
   * @param name 容器名称，指定要停止的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async stop(ip: string, name: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/stop/${ip}/${name}`);
    
    return response.data;
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
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async update(
    ip: string,
    name: string,
    options?: ContainerUpdateOptions,
    networkConfig?: NetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/update/${ip}/${name}`, {
      params: options,
      data: networkConfig
    });
    
    return response.data;
  }

  /**
   * 上传URL文件到安卓容器
   * @param ip 主机IP地址，用于指定要上传文件的目标容器所在的主机
   * @param name 容器名称，指定要上传文件的目标容器
   * @param url 文件URL，指定要上传的文件的URL地址
   * @param remotePath 远程保存路径，指定文件在容器中的保存位置
   * @param retry 重试次数，指定上传失败时的重试次数，默认为0
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async uploadFileFromUrl(
    ip: string,
    name: string,
    url: string,
    remotePath: string,
    retry: number = 0
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/upload2_file/${ip}/${name}`, {
      data: {
        url,
        remote_path: remotePath,
        retry
      }
    });
    
    return response.data;
  }

  /**
   * 上传导入的文件到目录
   * @param url 文件URL，指定要上传的文件的URL地址
   * @param remotePath 远程保存路径，指定文件在容器中的保存位置
   * @param retry 重试次数，指定上传失败时的重试次数，默认为0
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "执行完成!"}
   */
  async uploadImportFileFromUrl(
    url: string,
    remotePath: string,
    retry: number = 0
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', '/upload_import_file_fromUrl', {
      data: {
        url,
        remote_path: remotePath,
        retry
      }
    });
    
    return response.data;
  }
} 