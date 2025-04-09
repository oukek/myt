import { OukekMytServer } from '../myt-server';
import { ApiResponse } from './types';

/**
 * 容器创建时的网络配置接口
 * 用于配置容器的独立IP网络信息
 */
export interface ContainerNetworkConfig {
  /** 网关IP地址 */
  gw: string;
  /** 容器IP地址 */
  ip: string;
  /** 子网掩码 */
  subnet: string;
}

/**
 * 容器创建时的可选配置参数接口
 */
export interface ContainerCreateOptions {
  /** 是否使用沙盒模式：1-使用，0-不使用，默认0 */
  sandbox?: number;
  /** 沙盒大小，单位：GB，默认16G */
  sandbox_size?: number;
  /** 镜像地址，若不设置则使用cfg文件中配置的镜像 */
  image_addr?: string;
  /** 内存限制大小，单位：MB */
  memory?: number;
  /** 指定绑定的CPU核心，例如："0,4"表示使用0号小核和4号大核 */
  cpu?: string;
  /** 指定Android容器的分辨率：0-720P，1-1080P，2-自定义配置 */
  resolution?: number;
  /** 指定DNS域名地址，默认为国内223.5.5.5 */
  dns?: string;
  /** 屏幕宽度，默认720 */
  width?: number;
  /** 屏幕高度，默认1280 */
  height?: number;
  /** 屏幕DPI，默认320 */
  dpi?: number;
  /** 指定FPS，默认24 */
  fps?: number;
  /** 创建容器时指定的本地资源路径 */
  data_res?: string;
  /** 指定MAC地址，格式：ab:cd:12:34:45:78 */
  mac?: string;
  /** 是否自动随机设备信息：0-不自动随机，1-开机时系统自动随机，默认1 */
  random_dev?: number;
  /** S5服务器地址 */
  s5ip?: string;
  /** S5端口地址 */
  s5port?: number;
  /** S5用户名 */
  s5user?: string;
  /** S5密码 */
  s5pwd?: string;
  /** 是否强制DNS走TCP通道：0-否，1-是，默认0 */
  dnstcp_mode?: number;
  /** RPA主机映射端口，推荐值为(7100 + 索引号) */
  rpaport?: number;
  /** 创建容器时指定的设备机型信息 */
  initdev?: string;
  /** 是否使用严格模式：0-非严格模式，1-严格模式，默认1 */
  enforce?: number;
}

/**
 * 容器信息接口
 */
export interface ContainerInfo {
  /** 容器名称 */
  Names: string;
  /** 容器状态：created-已创建，running-运行中，exited-已停止 */
  State: string;
  /** 资源文件路径 */
  data: string;
  /** 容器索引位置(1-12) */
  index: number;
  /** 容器IP地址 */
  ip: string;
}

/**
 * 容器更新参数接口
 */
export interface ContainerUpdateOptions {
  /** DNS地址，例如：8.8.8.8 */
  dns?: string;
  /** 坑位索引 */
  index?: number;
  /** 镜像地址 */
  image_addr?: string;
  /** 镜像名称 */
  name?: string;
  /** 网络模式：1-共享IP，2-独立IP */
  network?: number;
  /** FPS，默认24 */
  fps?: number;
  /** MAC地址，格式：ab:cd:12:34:45:78 */
  mac?: string;
  /** 是否使用严格模式：0-非严格模式，1-严格模式，默认1 */
  enforce?: number;
  /** 是否为A1设备：1-是，0-否（C1），默认0 */
  isA1?: number;
}

/**
 * 文件上传参数接口
 */
export interface FileUploadOptions {
  /** 文件URL地址 */
  url: string;
  /** 文件保存在云机中的路径，为空则使用/sdcard/Download */
  remote_path?: string;
}

/**
 * 容器API类
 * 提供容器的创建、复制、管理等操作
 */
export class ContainerApi {
  constructor(private server: OukekMytServer) {}

  /**
   * 复制安卓容器
   * @param ip 主机IP地址，用于指定源容器所在的主机
   * @param srcName 源容器名称，指定要复制的容器
   * @param dstName 目标容器名称，新创建的容器名称
   * @param index 目标容器索引，指定新容器在主机上的位置
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // {"code": 200, "msg": ""}
   */
  async copy(
    ip: string,
    srcName: string,
    dstName: string,
    index: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/copy/${ip}/${srcName}/${dstName}/${index}`);
    return response.data;
  }

  /**
   * 复制A1安卓容器
   * @param ip 主机IP地址，用于指定源容器所在的主机
   * @param srcName 源容器名称，指定要复制的容器
   * @param dstName 目标容器名称，新创建的容器名称
   * @param index 目标容器索引，指定新容器在主机上的位置
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // {"code": 200, "msg": ""}
   */
  async copyA1(
    ip: string,
    srcName: string,
    dstName: string,
    index: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/copy_A1/${ip}/${srcName}/${dstName}/${index}`);
    return response.data;
  }

  /**
   * 创建安卓容器
   * @param ip 主机IP地址
   * @param index 容器索引位置信息
   * @param name 实例名称
   * @param options 可选参数配置，用于设置容器的各种属性
   * @param networkConfig 网络配置信息（可选），用于配置容器的独立IP网络
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // 基本用法
   * await containerApi.create('192.168.3.34', 1, 'my-container');
   * 
   * // 带可选参数
   * await containerApi.create('192.168.3.34', 1, 'my-container', {
   *   memory: 2048,
   *   resolution: 1,
   *   fps: 30
   * });
   * 
   * // 带网络配置
   * await containerApi.create('192.168.3.34', 1, 'my-container', {
   *   memory: 2048
   * }, {
   *   gw: '192.168.1.1',
   *   ip: '192.168.1.100',
   *   subnet: '255.255.255.0'
   * });
   */
  async create(
    ip: string,
    index: number,
    name: string,
    options: ContainerCreateOptions = {},
    networkConfig?: ContainerNetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/create/${ip}/${index}/${name}`, {
      params: options,
      data: networkConfig
    });
    return response.data;
  }

  /**
   * 创建A1安卓容器
   * 创建A1型号的容器，参数与普通容器创建相同
   * @param ip 主机IP地址
   * @param index 容器索引位置信息
   * @param name 实例名称
   * @param options 可选参数配置，用于设置容器的各种属性
   * @param networkConfig 网络配置信息（可选），用于配置容器的独立IP网络
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // 基本用法
   * await containerApi.createA1('192.168.3.34', 1, 'my-container');
   * 
   * // 带可选参数
   * await containerApi.createA1('192.168.3.34', 1, 'my-container', {
   *   memory: 2048,
   *   resolution: 1,
   *   fps: 30
   * });
   * 
   * // 带网络配置
   * await containerApi.createA1('192.168.3.34', 1, 'my-container', {
   *   memory: 2048
   * }, {
   *   gw: '192.168.1.1',
   *   ip: '192.168.1.100',
   *   subnet: '255.255.255.0'
   * });
   */
  async createA1(
    ip: string,
    index: number,
    name: string,
    options: ContainerCreateOptions = {},
    networkConfig?: ContainerNetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/create_A1/${ip}/${index}/${name}`, {
      params: options,
      data: networkConfig
    });
    return response.data;
  }

  /**
   * 导出安卓容器到本地
   * 将Android容器数据导出到本地备份，执行时间取决于资源文件的大小
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param localName 资源镜像的名称，默认存在当前目录backup下
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // 基本用法
   * const success = await containerApi.export('192.168.3.34', 'my-container', 'backup-2023');
   * if (success) {
   *   console.log('导出成功');
   * }
   */
  async export(
    ip: string,
    name: string,
    localName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/export/${ip}/${name}/${localName}`);
    return response.data;
  }

  /**
   * 获取安卓容器列表
   * @param ip 主机IP地址
   * @param index 可选，容器索引位置(1-12)，不指定则返回所有容器
   * @param name 可选，容器名称，不指定则返回所有容器
   * @returns {Promise<ApiResponse<ContainerInfo[]>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // 获取所有容器
   * const containers = await containerApi.getList('192.168.3.34');
   * 
   * // 获取指定索引的容器
   * const container = await containerApi.getList('192.168.3.34', 4);
   * 
   * // 获取指定名称的容器
   * const container = await containerApi.getList('192.168.3.34', undefined, 'myt_1_test');
   */
  async getList(
    ip: string,
    index?: number,
    name?: string
  ): Promise<ApiResponse<ContainerInfo[]>> {
    const response = await this.server.request('get', `/get/${ip}`, {
      params: { index, name }
    });
    return response.data;
  }

  /**
   * 导入备份文件到安卓容器
   * @param ip 主机IP地址
   * @param newName 还原的容器名称
   * @param index 容器运行的坑位信息
   * @param local 本地的备份文件路径
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.import('192.168.3.34', 'new-container', 1, '/path/to/backup.tar.gz');
   */
  async import(
    ip: string,
    newName: string,
    index: number,
    local: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/import/${ip}/${newName}/${index}`, {
      params: { local }
    });
    return response.data;
  }

  /**
   * 重启安卓容器
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.reboot('192.168.3.34', 'my-container');
   */
  async reboot(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/reboot/${ip}/${name}`);
    return response.data;
  }

  /**
   * 删除安卓容器
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.remove('192.168.3.34', 'my-container');
   */
  async remove(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/remove/${ip}/${name}`);
    return response.data;
  }

  /**
   * 重置安卓容器
   * 重置完成后会关闭容器
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.reset('192.168.3.34', 'my-container');
   */
  async reset(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/reset/${ip}/${name}`);
    return response.data;
  }

  /**
   * 重置网络对象
   * 当网络环境发生变化时（例如网关、网段、子网等网络参数改变）需要重新初始化网络对象
   * @param ip 主机IP地址
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.resetNetwork('192.168.3.34');
   */
  async resetNetwork(
    ip: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/reset_network/${ip}`);
    return response.data;
  }

  /**
   * 运行安卓容器
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param force 是否强制运行：1-若当前坑位存在其他容器则先关闭再运行该容器，0-不强制（默认）
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // 普通运行
   * const success = await containerApi.run('192.168.3.34', 'my-container');
   * 
   * // 强制运行
   * const success = await containerApi.run('192.168.3.34', 'my-container', 1);
   */
  async run(
    ip: string,
    name: string,
    force: number = 0
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/run/${ip}/${name}`, {
      params: { force }
    });
    return response.data;
  }

  /**
   * 停止安卓容器
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.stop('192.168.3.34', 'my-container');
   */
  async stop(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/stop/${ip}/${name}`);
    return response.data;
  }

  /**
   * 更新容器配置
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param options 更新参数
   * @param networkConfig 网络配置信息（可选），当network=2（独立IP）时必填
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * // 更新DNS和MAC地址
   * const success = await containerApi.update('192.168.3.34', 'my-container', {
   *   dns: '8.8.8.8',
   *   mac: 'ab:cd:12:34:45:78'
   * });
   * 
   * // 更新为独立IP模式
   * const success = await containerApi.update('192.168.3.34', 'my-container', {
   *   network: 2
   * }, {
   *   gw: '192.168.1.1',
   *   ip: '192.168.1.100',
   *   subnet: '255.255.255.0'
   * });
   */
  async update(
    ip: string,
    name: string,
    options: ContainerUpdateOptions = {},
    networkConfig?: ContainerNetworkConfig
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/update/${ip}/${name}`, {
      params: options,
      data: networkConfig
    });
    return response.data;
  }

  /**
   * 上传URL文件到安卓容器
   * 从URL下载文件到云机中，默认保存到/sdcard/Download目录
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param options 上传参数
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回响应数据，失败时返回错误信息
   * @example
   * const success = await containerApi.uploadFile('192.168.3.34', 'my-container', {
   *   url: 'https://example.com/app.apk',
   *   remote_path: '/sdcard/Download'
   * });
   */
  async uploadFile(
    ip: string,
    name: string,
    options: FileUploadOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/upload2_file/${ip}/${name}`, {
      data: options
    });
    return response.data;
  }
}