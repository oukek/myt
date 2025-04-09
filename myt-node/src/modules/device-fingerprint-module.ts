import { OukekMytServer } from '../myt-server';

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
   * @returns {Promise<Record<string, Record<string, number>> | null>} 返回Promise对象，成功时返回设备信息字典，失败时返回null
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
  ): Promise<Record<string, Record<string, number>> | null> {
    try {
      const response = await this.server.request('get', `/devinfo/${ip}/${name}/${act}`, {
        params: { abroad, model_id: modelId, lang, userip: userIp, is_async: isAsync }
      });
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('修改设备信息失败:', error);
      return null;
    }
  }

  /**
   * 获取机型信息列表
   * @returns {Promise<Record<string, Record<string, number>> | null>} 返回Promise对象，成功时返回机型信息字典，失败时返回null
   * @example
   * // {"code": 200, "msg": {"HONOR": {"AKA-AL10": 39}}}
   */
  async getDeviceInfoList(): Promise<Record<string, Record<string, number>> | null> {
    try {
      const response = await this.server.request('get', '/get_devinfo');
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取机型信息列表失败:', error);
      return null;
    }
  }

  /**
   * 隐藏安卓应用
   * @param ip 主机IP地址，用于指定要隐藏应用的容器所在的主机
   * @param name 容器名称，指定要隐藏应用的容器
   * @param apps 要隐藏的应用列表，格式为应用包名和状态的键值对
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async hideApps(
    ip: string,
    name: string,
    apps: Record<string, string>
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/hide_app/${ip}/${name}`, {
        data: apps
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('隐藏安卓应用失败:', error);
      return false;
    }
  }

  /**
   * 随机更换设备信息
   * @param ip 主机IP地址，用于指定要更换设备信息的容器所在的主机
   * @param name 容器名称，指定要更换设备信息的容器
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param modelId 指定设备型号ID，可选参数，指定要使用的设备型号ID
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async randomDeviceInfo(
    ip: string,
    name: string,
    userIp?: string,
    modelId?: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/random_devinfo/${ip}/${name}`, {
        params: { userip: userIp, modelid: modelId }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('随机更换设备信息失败:', error);
      return false;
    }
  }

  /**
   * 异步随机更换设备信息
   * @param ip 主机IP地址，用于指定要更换设备信息的容器所在的主机
   * @param name 容器名称，指定要更换设备信息的容器
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param modelId 指定设备型号ID，可选参数，指定要使用的设备型号ID
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async randomDeviceInfoAsync(
    ip: string,
    name: string,
    userIp?: string,
    modelId?: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/random_devinfo_async/${ip}/${name}`, {
        params: { userip: userIp, modelid: modelId }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('异步随机更换设备信息失败:', error);
      return false;
    }
  }

  /**
   * 异步随机更换设备信息(方法2)
   * @param ip 主机IP地址，用于指定要更换设备信息的容器所在的主机
   * @param name 容器名称，指定要更换设备信息的容器
   * @param act 动作类型，可选值：'request'(请求结果) 'query'(获取结果)
   * @param userIp 指定IP区域，可选参数，指定要使用的IP区域
   * @param modelId 指定设备型号ID，可选参数，指定要使用的设备型号ID
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async randomDeviceInfoAsync2(
    ip: string,
    name: string,
    act: 'request' | 'query',
    userIp?: string,
    modelId?: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/random_devinfo_async2/${ip}/${name}/${act}`, {
        params: { userip: userIp, modelid: modelId }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('异步随机更换设备信息失败:', error);
      return false;
    }
  }

  /**
   * 自定义设备机型信息
   * @param ip 主机IP地址，用于指定要设置自定义设备信息的容器所在的主机
   * @param name 容器名称，指定要设置自定义设备信息的容器
   * @param deviceInfo 设备信息数据，指定要设置的自定义设备信息
   * @param options 可选参数，包含以下字段：
   *   - androidId: 安卓ID
   *   - iccid: SIM卡ICCID
   *   - imei: 设备IMEI
   *   - imsi: SIM卡IMSI
   *   - seriesNum: 序列号
   *   - btaddr: 蓝牙地址
   *   - btname: 蓝牙名称
   *   - wifiMac: WiFi MAC地址
   *   - wifiName: WiFi名称
   *   - oaid: OAID
   *   - aaid: AAID
   *   - vaid: VAID
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setCustomDeviceInfo(
    ip: string,
    name: string,
    deviceInfo: string,
    options?: {
      androidId?: string;
      iccid?: string;
      imei?: string;
      imsi?: string;
      seriesNum?: string;
      btaddr?: string;
      btname?: string;
      wifiMac?: string;
      wifiName?: string;
      oaid?: string;
      aaid?: string;
      vaid?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/set_custom_devinfo/${ip}/${name}`, {
        params: options,
        data: { devinfo: deviceInfo }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('自定义设备机型信息失败:', error);
      return false;
    }
  }

  /**
   * 更新自定义设备机型信息
   * @param ip 主机IP地址，用于指定要更新自定义设备信息的容器所在的主机
   * @param name 容器名称，指定要更新自定义设备信息的容器
   * @param deviceInfo 设备信息数据，指定要更新的自定义设备信息
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async updateCustomDeviceInfo(
    ip: string,
    name: string,
    deviceInfo: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/update_custom_devinfo/${ip}/${name}`, {
        data: { devinfo: deviceInfo }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('更新自定义设备机型信息失败:', error);
      return false;
    }
  }

  /**
   * 更新指纹信息
   * @param ip 主机IP地址，用于指定要更新指纹信息的容器所在的主机
   * @param name 容器名称，指定要更新指纹信息的容器
   * @param options 指纹信息参数，包含以下字段：
   *   - lac: 位置区码
   *   - cid: 小区ID
   *   - lat: 纬度
   *   - lon: 经度
   *   - mcc: 移动国家码
   *   - mnc: 移动网络码
   *   - phonenumber: 电话号码
   *   - country: 国家
   *   - language: 语言
   *   - timezone: 时区
   *   - opercode: 运营商代码
   *   - opername: 运营商名称
   *   - iccid: SIM卡ICCID
   *   - imsi: SIM卡IMSI
   *   - imei: 设备IMEI
   *   - gaid: Google广告ID
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async updateFingerprint(
    ip: string,
    name: string,
    options: {
      lac?: string;
      cid?: string;
      lat?: string;
      lon?: string;
      mcc?: string;
      mnc?: string;
      phonenumber?: string;
      country?: string;
      language?: string;
      timezone?: string;
      opercode?: string;
      opername?: string;
      iccid?: string;
      imsi?: string;
      imei?: string;
      gaid?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/upload_fingerprint/${ip}/${name}`, {
        params: options
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('更新指纹信息失败:', error);
      return false;
    }
  }

  /**
   * 上传谷歌证书
   * @param ip 主机IP地址，用于指定要上传谷歌证书的容器所在的主机
   * @param name 容器名称，指定要上传谷歌证书的容器
   * @param local 本地证书文件路径，指定要上传的谷歌证书文件在本地的位置
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async uploadGoogleCert(
    ip: string,
    name: string,
    local: string
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/upload_google_cert/${ip}/${name}`, {
        params: { local }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('上传谷歌证书失败:', error);
      return false;
    }
  }
} 