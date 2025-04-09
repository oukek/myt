import { OukekMytServer } from '../myt-server';
import { ApiResponse } from './types';

/**
 * Android启动状态枚举
 */
export enum AndroidBootStatus {
  /** 系统启动完成 */
  BOOTED = 200,
  /** 未启动或超时 */
  NOT_BOOTED = 201,
  /** 容器不存在 */
  CONTAINER_NOT_FOUND = 2,
  /** 主机不通 */
  HOST_UNREACHABLE = 1
}

/**
 * Android初始化状态枚举
 */
export enum AndroidInitStatus {
  /** 系统启动完成 */
  INITIALIZED = 200,
  /** 未启动完成 */
  NOT_INITIALIZED = 201,
  /** 获取状态失败 */
  FAILED = 202,
  /** 容器不存在 */
  CONTAINER_NOT_FOUND = 2,
  /** 主机不通 */
  HOST_UNREACHABLE = 1
}

/**
 * S5连接状态枚举
 */
export enum S5Status {
  /** 成功 */
  SUCCESS = 200,
  /** 未启动或超时 */
  NOT_STARTED = 201,
  /** 容器不存在 */
  CONTAINER_NOT_FOUND = 2,
  /** 主机不通 */
  HOST_UNREACHABLE = 1,
  /** 参数不完整 */
  INCOMPLETE_PARAMS = 4
}

/**
 * 应用权限设置结果枚举
 */
export enum AppPermissionStatus {
  /** 设置成功 */
  SUCCESS = 200,
  /** 设置失败 */
  FAILED = 201,
  /** 主机不通 */
  HOST_UNREACHABLE = 1,
  /** 获取容器API接口失败 */
  API_FAILURE = 2
}

/**
 * 音频控制动作枚举
 */
export enum AudioAction {
  /** 播放 */
  PLAY = 'play',
  /** 停止 */
  STOP = 'stop'
}

/**
 * 音频控制结果枚举
 */
export enum AudioStatus {
  /** 设置成功 */
  SUCCESS = 200,
  /** 主机不通 */
  HOST_UNREACHABLE = 1,
  /** 获取容器API接口失败 */
  API_FAILURE = 2,
  /** 语言设置失败 */
  LANGUAGE_SETTING_FAILED = 3,
  /** 参数类型错误 */
  PARAMETER_ERROR = 4
}

/**
 * 摄像头旋转方向枚举
 */
export enum CameraRotation {
  /** 不旋转 */
  NONE = 0,
  /** 90度 */
  ROTATE_90 = 1,
  /** 180度 */
  ROTATE_180 = 2,
  /** 270度 */
  ROTATE_270 = 3
}

/**
 * 摄像头镜像方向枚举
 */
export enum CameraMirror {
  /** 不镜像 */
  NONE = 0,
  /** 镜像 */
  MIRROR = 1
}

/**
 * 摄像头视频类型枚举
 */
export enum CameraVideoType {
  /** 网络视频流或者本地视频文件 */
  NETWORK_OR_LOCAL_VIDEO = 1,
  /** webrtc视频流 */
  WEBRTC = 2,
  /** 本地图片或者网络图片 */
  LOCAL_OR_NETWORK_IMAGE = 3
}

/**
 * 摄像头分辨率枚举
 */
export enum CameraResolution {
  /** 1920x1080@30 */
  FULL_HD = 1,
  /** 1280x720@30 */
  HD = 2
}

/**
 * 语言类型枚举
 */
export enum LanguageType {
  /** 中文 */
  ZH = 'zh',
  /** 英语 */
  EN = 'en',
  /** 法语 */
  FR = 'fr',
  /** 泰国 */
  TH = 'th',
  /** 越南 */
  VI = 'vi',
  /** 日本 */
  JA = 'ja',
  /** 韩国 */
  KO = 'ko',
  /** 老挝 */
  LO = 'lo',
  /** 印尼 */
  IN = 'in'
}

/**
 * API信息接口
 */
export interface ApiInfo {
  /** ADB连接信息 */
  ADB: string;
  /** API连接信息 */
  API: string;
  /** RPC连接信息 */
  RPC: string;
}

/**
 * 设备信息接口
 */
export interface DeviceInfo {
  /** 设备型号 */
  model: string;
  /** 设备品牌 */
  brand: string;
  /** 设备制造商 */
  manufacturer: string;
  /** 设备序列号 */
  serial: string;
  /** 设备IMEI */
  imei: string;
  /** 设备Android ID */
  androidId: string;
  /** 设备MAC地址 */
  mac: string;
  /** 设备分辨率 */
  resolution: string;
  /** 设备DPI */
  dpi: number;
  /** 设备系统版本 */
  osVersion: string;
  /** 设备SDK版本 */
  sdkVersion: number;
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  /** 文件路径 */
  file: string;
  /** 是否为文件夹 */
  flag: boolean;
  /** 文件大小 */
  length: number;
  /** 文件名称 */
  name: string;
}

/**
 * 隐藏应用请求接口
 */
export interface HideAppRequest {
  [key: string]: string;
}

/**
 * S5连接配置接口
 */
export interface S5Config {
  /** S5服务器地址 */
  s5ip?: string;
  /** S5端口地址 */
  s5port?: number;
  /** S5用户名 */
  s5user?: string;
  /** S5密码 */
  s5pwd?: string;
}

/**
 * 摄像头推流设置接口
 */
export interface CameraStreamConfig {
  /** 资源地址 */
  addr: string;
}

/**
 * 截图结果接口
 */
export interface ScreenshotResult {
  /** png数据base64之后的结果 */
  msg: string;
  /** 图片的url地址 */
  url: string;
}

/**
 * 自定义设备信息接口
 */
export interface CustomDeviceInfo {
  /** Android ID */
  androidId?: string;
  /** ICCID */
  iccid?: string;
  /** IMEI */
  imei?: string;
  /** IMSI */
  imsi?: string;
  /** 序列号 */
  seriesNum?: string;
  /** 蓝牙地址 */
  btaddr?: string;
  /** 蓝牙名称 */
  btname?: string;
  /** WiFi MAC地址 */
  wifiMac?: string;
  /** WiFi名称 */
  wifiName?: string;
  /** OAID */
  oaid?: string;
  /** AAID */
  aaid?: string;
  /** VAID */
  vaid?: string;
  /** 设备信息数据 */
  devinfo: string;
}

/**
 * 位置信息接口
 */
export interface LocationInfo {
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
}

/**
 * Shell命令请求接口
 */
export interface ShellCommand {
  /** 命令内容 */
  cmd: string;
}

/**
 * 设备属性更新项接口
 */
export interface DevicePropUpdate {
  /** ID */
  id: number;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 值 */
  value: string;
}

export class AppApi {
  constructor(private server: OukekMytServer) {}
  
  /**
   * 获取Android系统剪切板内容
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回剪切板内容，失败时返回错误信息
   * @example
   * const result = await appApi.getClipboard('192.168.3.34', 'my-container');
   * if (result.code === 200) {
   *   console.log('剪切板内容:', result.msg);
   * }
   */
  async getClipboard(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/clipboard_get/${ip}/${name}`);
    return response.data;
  }

  /**
   * 设置Android系统剪切板内容
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param text 要设置的剪切板内容
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setClipboard('192.168.3.34', 'my-container', '要设置的内容');
   * if (result.code === 200) {
   *   console.log('设置剪切板内容成功');
   * }
   */
  async setClipboard(
    ip: string,
    name: string,
    text: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/clipboard_set/${ip}/${name}`, {
      params: { text }
    });
    return response.data;
  }

  /**
   * 获取设备信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param act 操作类型：1-获取机型字典表，2-随机设备机型
   * @param abroad 可选，1表示海外设备机型随机
   * @param modelId 可选，获取机型列表字典中指定的机型参数
   * @returns {Promise<ApiResponse<DeviceInfo[]>>} 返回Promise对象，成功时返回设备信息列表，失败时返回错误信息
   * @example
   * // 获取机型列表
   * const result = await appApi.getDeviceInfo('192.168.3.34', 'my-container', 1);
   * if (result.code === 200) {
   *   console.log('设备信息:', result.msg);
   * }
   * 
   * // 海外机型随机
   * const result = await appApi.getDeviceInfo('192.168.3.34', 'my-container', 2, 1);
   * 
   * // 设置指定机型
   * const result = await appApi.getDeviceInfo('192.168.3.34', 'my-container', 2, 0, 1);
   */
  async getDeviceInfo(
    ip: string,
    name: string,
    act: number,
    abroad?: number,
    modelId?: number
  ): Promise<ApiResponse<DeviceInfo[]>> {
    const response = await this.server.request('get', `/devinfo/${ip}/${name}/${act}`, {
      params: { abroad, model_id: modelId }
    });
    return response.data;
  }

  /**
   * 下载安卓实例中的文件
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param path 指定路径的文件
   * @param local 下载文件的本地保存路径
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.downloadFile('192.168.3.34', 'my-container', '/sdcard/Download/1.txt', './downloads/1.txt');
   * if (result.code === 200) {
   *   console.log('文件下载成功');
   * }
   */
  async downloadFile(
    ip: string,
    name: string,
    path: string,
    local: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/down_file/${ip}/${name}`, {
      params: { path, local }
    });
    return response.data;
  }

  /**
   * 获取安卓的启动状态
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param isBlock 是否阻塞等待：0-否，1-是
   * @param timeout 超时时间，单位：秒，默认3秒
   * @returns {Promise<ApiResponse<AndroidBootStatus>>} 返回Promise对象，成功时返回启动状态，失败时返回错误信息
   * @example
   * const result = await appApi.getAndroidBootStatus('192.168.3.34', 'my-container', 0, 120);
   * if (result.code === 200) {
   *   switch (result.msg) {
   *     case AndroidBootStatus.BOOTED:
   *       console.log('系统启动完成');
   *       break;
   *     case AndroidBootStatus.NOT_BOOTED:
   *       console.log('未启动或超时');
   *       break;
   *     case AndroidBootStatus.CONTAINER_NOT_FOUND:
   *       console.log('容器不存在');
   *       break;
   *     case AndroidBootStatus.HOST_UNREACHABLE:
   *       console.log('主机不通');
   *       break;
   *   }
   * }
   */
  async getAndroidBootStatus(
    ip: string,
    name: string,
    isBlock: number = 0,
    timeout: number = 3
  ): Promise<ApiResponse<AndroidBootStatus>> {
    const response = await this.server.request('get', `/get_android_boot_status/${ip}/${name}`, {
      params: { isblock: isBlock, timeout }
    });
    return response.data;
  }

  /**
   * 获取初次创建安卓的初始化状态
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<AndroidInitStatus>>} 返回Promise对象，成功时返回初始化状态，失败时返回错误信息
   * @example
   * const result = await appApi.getAndroidInitStatus('192.168.3.34', 'my-container');
   * if (result.code === 200) {
   *   switch (result.msg) {
   *     case AndroidInitStatus.INITIALIZED:
   *       console.log('系统启动完成');
   *       break;
   *     case AndroidInitStatus.NOT_INITIALIZED:
   *       console.log('未启动完成');
   *       break;
   *     case AndroidInitStatus.FAILED:
   *       console.log('获取状态失败');
   *       break;
   *     case AndroidInitStatus.CONTAINER_NOT_FOUND:
   *       console.log('容器不存在');
   *       break;
   *     case AndroidInitStatus.HOST_UNREACHABLE:
   *       console.log('主机不通');
   *       break;
   *   }
   * }
   */
  async getAndroidInitStatus(
    ip: string,
    name: string
  ): Promise<ApiResponse<AndroidInitStatus>> {
    const response = await this.server.request('get', `/get_android_init_status/${ip}/${name}`);
    return response.data;
  }

  /**
   * 获取API的详细信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<ApiInfo>>} 返回Promise对象，成功时返回API信息，失败时返回错误信息
   * @example
   * const result = await appApi.getApiInfo('192.168.3.34', 'my-container');
   * if (result.code === 200) {
   *   console.log('ADB端口:', result.msg.ADB);
   *   console.log('API端口:', result.msg.API);
   *   console.log('RPC端口:', result.msg.RPC);
   * }
   */
  async getApiInfo(
    ip: string,
    name: string
  ): Promise<ApiResponse<ApiInfo>> {
    const response = await this.server.request('get', `/get_api_info/${ip}/${name}`);
    return response.data;
  }

  /**
   * 获取摄像头推流地址和类型
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param packageName app包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回推流地址和类型，失败时返回错误信息
   * @example
   * const result = await appApi.getCamStream('192.168.3.34', 'my-container', 'com.example.app');
   * if (result.code === 200) {
   *   console.log('推流地址和类型:', result.msg);
   * }
   */
  async getCamStream(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/get_cam_stream/${ip}/${name}`, {
      params: { package: packageName }
    });
    return response.data;
  }

  /**
   * 获取安卓实例中的文件列表
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param path 可选，指定路径的文件列表，默认为/sdcard目录
   * @returns {Promise<ApiResponse<FileInfo[]>>} 返回Promise对象，成功时返回文件列表，失败时返回错误信息
   * @example
   * const result = await appApi.getFileList('192.168.3.34', 'my-container', '/sdcard');
   * if (result.code === 200) {
   *   console.log('文件列表:', result.msg);
   * }
   */
  async getFileList(
    ip: string,
    name: string,
    path: string = '/sdcard'
  ): Promise<ApiResponse<FileInfo[]>> {
    const response = await this.server.request('get', `/get_file_list/${ip}/${name}`, {
      params: { path }
    });
    return response.data;
  }

  /**
   * 隐藏安卓应用
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param apps 要隐藏的app列表
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.hideApp('192.168.3.34', 'my-container', {
   *   app1: 'com.example.app1',
   *   app2: 'com.example.app2'
   * });
   * if (result.code === 200) {
   *   console.log('隐藏应用成功');
   * }
   */
  async hideApp(
    ip: string,
    name: string,
    apps: HideAppRequest
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/hide_app/${ip}/${name}`, {
      data: apps
    });
    return response.data;
  }

  /**
   * 随机更换设备信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.randomDevInfo('192.168.3.34', 'my-container');
   * if (result.code === 200) {
   *   console.log('设备信息更换成功');
   * }
   */
  async randomDevInfo(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/random_devinfo/${ip}/${name}`);
    return response.data;
  }

  /**
   * 设置应用Root权限
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param packageName app包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.rootApp('192.168.3.34', 'my-container', 'com.example.app');
   * if (result.code === 200) {
   *   console.log('Root权限设置成功');
   * }
   */
  async rootApp(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/root_app/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 运行已安装的App
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param packageName app包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.runApk('192.168.3.34', 'my-container', 'com.example.app');
   * if (result.code === 200) {
   *   console.log('App启动成功');
   * }
   */
  async runApk(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/run_apk/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 查询S5连接信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回S5连接信息，失败时返回错误信息
   * @example
   * const result = await appApi.queryS5('192.168.3.34', 'my-container');
   * if (result.code === 200) {
   *   console.log('S5连接信息:', result.msg);
   * }
   */
  async queryS5(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/s5_query/${ip}/${name}`);
    return response.data;
  }

  /**
   * 设置S5连接
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param config S5连接配置
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setS5('192.168.3.34', 'my-container', {
   *   s5ip: '192.168.1.1',
   *   s5port: 12321,
   *   s5user: 'uuu',
   *   s5pwd: '234123'
   * });
   * if (result.code === 200) {
   *   console.log('S5连接设置成功');
   * }
   */
  async setS5(
    ip: string,
    name: string,
    config: S5Config
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/s5_set/${ip}/${name}`, {
      params: config
    });
    return response.data;
  }

  /**
   * 关闭S5连接
   * @param ip 主机IP地址
   * @param name 容器名称
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.stopS5('192.168.3.34', 'my-container');
   * if (result.code === 200) {
   *   console.log('S5连接关闭成功');
   * }
   */
  async stopS5(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/s5_stop/${ip}/${name}`);
    return response.data;
  }

  /**
   * 获取设备截图
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param level 返回的截图质量：1-低，2-中等，3-高清
   * @returns {Promise<ApiResponse<ScreenshotResult>>} 返回Promise对象，成功时返回截图数据，失败时返回错误信息
   * @example
   * const result = await appApi.getScreenshot('192.168.3.34', 'my-container', 3);
   * if (result.code === 200) {
   *   console.log('截图Base64:', result.msg.msg);
   *   console.log('截图URL:', result.msg.url);
   * }
   */
  async getScreenshot(
    ip: string,
    name: string,
    level: number
  ): Promise<ApiResponse<ScreenshotResult>> {
    const response = await this.server.request('get', `/screenshots/${ip}/${name}/${level}`);
    return response.data;
  }

  /**
   * 设置应用所有权限
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param packageName 应用的包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setAppPermissions('192.168.3.34', 'my-container', 'com.example.app');
   * if (result.code === 200) {
   *   console.log('应用权限设置成功');
   * }
   */
  async setAppPermissions(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_app_permissions/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 设置分辨率感知白名单
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param packageName 应用的包名
   * @param enable 是否加入白名单：1-加入，0-移除
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setAppResolutionFilter('192.168.3.34', 'my-container', 'com.example.app', 1);
   * if (result.code === 200) {
   *   console.log('分辨率感知白名单设置成功');
   * }
   */
  async setAppResolutionFilter(
    ip: string,
    name: string,
    packageName: string,
    enable: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_app_resloution_filter/${ip}/${name}/${packageName}/${enable}`);
    return response.data;
  }

  /**
   * 播放音频设置
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param action 操作类型：'play'-播放，'stop'-停止
   * @param path 云手机内部的声音文件路径
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setAudio('192.168.3.34', 'my-container', 'play', '/sdcard/1.mp3');
   * if (result.code === 200) {
   *   console.log('音频播放设置成功');
   * }
   */
  async setAudio(
    ip: string,
    name: string,
    action: AudioAction,
    path?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_audio/${ip}/${name}/${action}`, {
      params: { path }
    });
    return response.data;
  }

  /**
   * 设置摄像头旋转
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param rotation 旋转方向：0-不旋转，1-90度，2-180度，3-270度
   * @param mirror 镜像方向：0-不镜像，1-镜像
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setCameraRotation('192.168.3.34', 'my-container', 2, 1);
   * if (result.code === 200) {
   *   console.log('摄像头旋转设置成功');
   * }
   */
  async setCameraRotation(
    ip: string,
    name: string,
    rotation: CameraRotation,
    mirror: CameraMirror
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_cam_rot/${ip}/${name}/${rotation}/${mirror}`);
    return response.data;
  }

  /**
   * 设置摄像头推流地址和类型
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param videoType 视频类型：1-网络视频流或本地视频文件，2-webrtc视频流，3-本地图片或网络图片
   * @param config 推流配置
   * @param resolution 可选，摄像头分辨率：1-1920x1080@30，2-1280x720@30
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setCameraStream('192.168.3.34', 'my-container', 1, { addr: 'http://example.com/video.mp4' }, 1);
   * if (result.code === 200) {
   *   console.log('摄像头推流设置成功');
   * }
   */
  async setCameraStream(
    ip: string,
    name: string,
    videoType: CameraVideoType,
    config: CameraStreamConfig,
    resolution?: CameraResolution
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/set_cam_stream/${ip}/${name}/${videoType}`, {
      params: { resolution },
      data: config
    });
    return response.data;
  }

  /**
   * 设置自定义设备机型信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param info 自定义设备信息
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setCustomDeviceInfo('192.168.3.34', 'my-container', {
   *   androidId: '1423adfsd12',
   *   oaid: 'adf342dvdf3434dd',
   *   imsi: '2312323223',
   *   devinfo: '{"device": "info"}'
   * });
   * if (result.code === 200) {
   *   console.log('自定义设备信息设置成功');
   * }
   */
  async setCustomDeviceInfo(
    ip: string,
    name: string,
    info: CustomDeviceInfo
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/set_custom_devinfo/${ip}/${name}`, {
      params: {
        androidId: info.androidId,
        iccid: info.iccid,
        imei: info.imei,
        imsi: info.imsi,
        seriesNum: info.seriesNum,
        btaddr: info.btaddr,
        btname: info.btname,
        wifiMac: info.wifiMac,
        wifiName: info.wifiName,
        oaid: info.oaid,
        aaid: info.aaid,
        vaid: info.vaid
      },
      data: { devinfo: info.devinfo }
    });
    return response.data;
  }

  /**
   * 设置IP智能定位
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param language 语言类型
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setIpLocation('192.168.3.34', 'my-container', 'th');
   * if (result.code === 200) {
   *   console.log('IP智能定位设置成功');
   * }
   */
  async setIpLocation(
    ip: string,
    name: string,
    language: LanguageType
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_ipLocation/${ip}/${name}/${language}`);
    return response.data;
  }

  /**
   * 设置设备经纬度信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param location 位置信息
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setLocation('192.168.3.34', 'my-container', {
   *   lat: 31.2323,
   *   lng: 12.333
   * });
   * if (result.code === 200) {
   *   console.log('设备经纬度设置成功');
   * }
   */
  async setLocation(
    ip: string,
    name: string,
    location: LocationInfo
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_location/${ip}/${name}`, {
      params: location
    });
    return response.data;
  }

  /**
   * 设置运动传感器灵敏度
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param factor 灵敏度，范围[0,1000]，0表示关闭，10表示静止，1000表示运动状态
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setMotionSensitivity('192.168.3.34', 'my-container', 10);
   * if (result.code === 200) {
   *   console.log('运动传感器灵敏度设置成功');
   * }
   */
  async setMotionSensitivity(
    ip: string,
    name: string,
    factor: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_motion_sensitivity/${ip}/${name}/${factor}`);
    return response.data;
  }

  /**
   * 设置摇一摇状态
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param enable 是否开启：0-关闭，1-开启
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.setShake('192.168.3.34', 'my-container', 1);
   * if (result.code === 200) {
   *   console.log('摇一摇状态设置成功');
   * }
   */
  async setShake(
    ip: string,
    name: string,
    enable: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/set_shake/${ip}/${name}/${enable}`);
    return response.data;
  }

  /**
   * 执行Adb命令
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param command 要执行的命令
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回命令执行结果，失败时返回错误信息
   * @example
   * const result = await appApi.executeShell('192.168.3.34', 'my-container', 'pm list');
   * if (result.code === 200) {
   *   console.log('命令执行结果:', result.msg);
   * }
   */
  async executeShell(
    ip: string,
    name: string,
    command: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/shell/${ip}/${name}`, {
      data: { cmd: command }
    });
    return response.data;
  }

  /**
   * 卸载Apk
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param packageName 要卸载的包名
   * @param local 可选，本地路径
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.uninstallApk('192.168.3.34', 'my-container', 'com.example.app');
   * if (result.code === 200) {
   *   console.log('应用卸载成功');
   * }
   */
  async uninstallApk(
    ip: string,
    name: string,
    packageName: string,
    local?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('get', `/uninstall_apk/${ip}/${name}/${packageName}`, {
      params: { local }
    });
    return response.data;
  }

  /**
   * 更新自定义设备机型信息
   * @param ip 主机IP地址
   * @param name 容器名称
   * @param updates 设备属性更新项数组
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，成功时返回空字符串，失败时返回错误信息
   * @example
   * const result = await appApi.updateCustomDeviceInfo('192.168.3.34', 'my-container', [{
   *   id: 0,
   *   name: 'PropRw',
   *   description: 'sim.imsi',
   *   value: '12344567'
   * }]);
   * if (result.code === 200) {
   *   console.log('设备信息更新成功');
   * }
   */
  async updateCustomDeviceInfo(
    ip: string,
    name: string,
    updates: DevicePropUpdate[]
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request('post', `/update_custom_devinfo/${ip}/${name}`, {
      data: updates
    });
    return response.data;
  }
}