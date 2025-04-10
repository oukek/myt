import { OukekMytServer } from '../myt-server';
import { 
  ApiResponse, 
  DeviceInfoDict, 
  AsyncAction, 
  CustomDeviceOptions, 
  FingerprintOptions 
} from './type';

export class DeviceFingerprintModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 修改设备信息
   * @param ip 主机IP地址，用于指定要修改设备信息的容器所在的主机
   * @param name 容器名称，指定要修改设备信息的容器
   * @param act 动作类型，可选值：1(获取机型字典表) 2(随机设备机型)
   * @param abroad 是否海外设备机型随机，可选参数，默认为0
   * @param modelId 指定机型ID，可选参数，指定要使用的设备型号ID
   * @param lang 指定语言，可选参数，指定要使用的语言
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param isAsync 是否异步执行，可选参数，默认为0
   * @returns {Promise<ApiResponse<DeviceInfoDict>>} 返回Promise对象，包含完整响应（code和设备信息字典）
   * @example
   * // {"code": 200, "msg": {"HONOR": {"AKA-AL10": 39}}}
   */
  async modifyDeviceInfo(
    ip: string,
    name: string,
    act: number,
    abroad?: number,
    modelId?: number,
    lang?: string,
    userIp?: string,
    isAsync?: number
  ): Promise<ApiResponse<DeviceInfoDict>> {
    const response = await this.server.request<ApiResponse<DeviceInfoDict>>('get', `/devinfo/${ip}/${name}/${act}`, {
      params: { abroad, model_id: modelId, lang, userip: userIp, is_async: isAsync }
    });
    return response.data;
  }

  /**
   * 获取机型信息列表
   * @returns {Promise<ApiResponse<DeviceInfoDict>>} 返回Promise对象，包含完整响应（code和机型信息字典）
   * @example
   * // {"code": 200, "msg": {"HONOR": {"AKA-AL10": 39}}}
   */
  async getDeviceInfoList(): Promise<ApiResponse<DeviceInfoDict>> {
    const response = await this.server.request<ApiResponse<DeviceInfoDict>>('get', '/get_devinfo');
    return response.data;
  }

  /**
   * 隐藏安卓应用
   * @param ip 主机IP地址，用于指定要隐藏应用的容器所在的主机
   * @param name 容器名称，指定要隐藏应用的容器
   * @param apps 要隐藏的应用列表，格式为应用包名和状态的键值对
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async hideApps(
    ip: string,
    name: string,
    apps: Record<string, string>
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/hide_app/${ip}/${name}`, {
      data: apps
    });
    return response.data;
  }

  /**
   * 随机更换设备信息
   * @param ip 主机IP地址，用于指定要更换设备信息的容器所在的主机
   * @param name 容器名称，指定要更换设备信息的容器
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param modelId 指定设备型号ID，可选参数，指定要使用的设备型号ID
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async randomDeviceInfo(
    ip: string,
    name: string,
    userIp?: string,
    modelId?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/random_devinfo/${ip}/${name}`, {
      params: { userip: userIp, modelid: modelId }
    });
    return response.data;
  }

  /**
   * 异步随机更换设备信息
   * @param ip 主机IP地址，用于指定要更换设备信息的容器所在的主机
   * @param name 容器名称，指定要更换设备信息的容器
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param modelId 指定设备型号ID，可选参数，指定要使用的设备型号ID
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async randomDeviceInfoAsync(
    ip: string,
    name: string,
    userIp?: string,
    modelId?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/random_devinfo_async/${ip}/${name}`, {
      params: { userip: userIp, modelid: modelId }
    });
    return response.data;
  }

  /**
   * 异步随机更换设备信息(方法2)
   * @param ip 主机IP地址，用于指定要更换设备信息的容器所在的主机
   * @param name 容器名称，指定要更换设备信息的容器
   * @param act 动作类型，可选值：'request'(请求结果) 'query'(获取结果)
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param modelId 指定设备型号ID，可选参数，指定要使用的设备型号ID
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async randomDeviceInfoAsync2(
    ip: string,
    name: string,
    act: AsyncAction,
    userIp?: string,
    modelId?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/random_devinfo_async2/${ip}/${name}/${act}`, {
      params: { userip: userIp, modelid: modelId }
    });
    return response.data;
  }

  /**
   * 自定义设备机型信息
   * @param ip 主机IP地址，用于指定要设置自定义设备信息的容器所在的主机
   * @param name 容器名称，指定要设置自定义设备信息的容器
   * @param deviceInfo 设备信息数据，指定要设置的自定义设备信息
   * @param options 可选参数，包含设备ID、序列号等自定义设备信息
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setCustomDeviceInfo(
    ip: string,
    name: string,
    deviceInfo: string,
    options?: CustomDeviceOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/set_custom_devinfo/${ip}/${name}`, {
      params: options,
      data: { devinfo: deviceInfo }
    });
    return response.data;
  }

  /**
   * 更新自定义设备机型信息
   * @param ip 主机IP地址，用于指定要更新自定义设备信息的容器所在的主机
   * @param name 容器名称，指定要更新自定义设备信息的容器
   * @param deviceInfo 设备信息数据，指定要更新的自定义设备信息
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async updateCustomDeviceInfo(
    ip: string,
    name: string,
    deviceInfo: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/update_custom_devinfo/${ip}/${name}`, {
      data: { devinfo: deviceInfo }
    });
    return response.data;
  }

  /**
   * 更新指纹信息
   * @param ip 主机IP地址，用于指定要更新指纹信息的容器所在的主机
   * @param name 容器名称，指定要更新指纹信息的容器
   * @param options 指纹信息参数，包含位置、网络、设备标识等指纹信息
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async updateFingerprint(
    ip: string,
    name: string,
    options: FingerprintOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/upload_fingerprint/${ip}/${name}`, {
      params: options
    });
    return response.data;
  }

  /**
   * 上传谷歌证书
   * @param ip 主机IP地址，用于指定要上传谷歌证书的容器所在的主机
   * @param name 容器名称，指定要上传谷歌证书的容器
   * @param local 本地证书文件路径，指定要上传的谷歌证书文件在本地的位置
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async uploadGoogleCert(
    ip: string,
    name: string,
    local: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/upload_google_cert/${ip}/${name}`, {
      params: { local }
    });
    return response.data;
  }
} 