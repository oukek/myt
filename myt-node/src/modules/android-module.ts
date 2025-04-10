import { OukekMytServer } from '../myt-server';
import { 
  ApiResponse, 
  FileInfo, 
  BootStatusOptions, 
  ScreenshotInfo, 
  SmsOptions, 
  AudioAction 
} from './type';

export class AndroidModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取安卓的剪切板内容
   * @param ip 主机IP地址，用于指定要获取剪切板内容的容器所在的主机
   * @param name 容器名称，指定要获取剪切板内容的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "剪切板内容"}
   */
  async getClipboard(ip: string, name: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/clipboard_get/${ip}/${name}`);
    return response.data;
  }

  /**
   * 设置安卓的剪切板内容
   * @param ip 主机IP地址，用于指定要设置剪切板内容的容器所在的主机
   * @param name 容器名称，指定要设置剪切板内容的容器
   * @param text 要设置的剪切板内容
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setClipboard(ip: string, name: string, text: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/clipboard_set/${ip}/${name}`, {
      params: { text }
    });
    return response.data;
  }

  /**
   * 下载安卓实例中的文件
   * @param ip 主机IP地址，用于指定要下载文件的目标容器所在的主机
   * @param name 容器名称，指定要下载文件的目标容器
   * @param path 文件路径，指定要下载的文件在容器中的路径
   * @param local 本地保存路径，可选参数，指定文件下载到本地的保存位置
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和本地文件地址）
   * @example
   * // {"code": 200, "msg": "本地文件地址"}
   */
  async downloadFile(
    ip: string,
    name: string,
    path: string,
    local?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/down_file/${ip}/${name}`, {
      params: { path, local }
    });
    return response.data;
  }

  /**
   * 获取安卓的启动状态
   * @param ip 主机IP地址，用于指定要获取启动状态的容器所在的主机
   * @param name 容器名称，指定要获取启动状态的容器
   * @param isBlock 是否阻塞等待，可选参数，默认为0
   * @param timeout 超时时间(秒)，可选参数，默认为120秒
   * @param initDevInfo 是否判断初始化设备信息完成，可选参数，默认为0
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async getBootStatus(
    ip: string,
    name: string,
    isBlock: number = 0,
    timeout: number = 120,
    initDevInfo: number = 0
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/get_android_boot_status/${ip}/${name}`, {
      params: { isblock: isBlock, timeout, init_devinfo: initDevInfo }
    });
    return response.data;
  }

  /**
   * 获取Api的详细信息
   * @param ip 主机IP地址，用于指定要获取API信息的容器所在的主机
   * @param name 容器名称，指定要获取API信息的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async getApiInfo(ip: string, name: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/get_api_info/${ip}/${name}`);
    return response.data;
  }

  /**
   * 获取安卓实例中的文件列表
   * @param ip 主机IP地址，用于指定要获取文件列表的容器所在的主机
   * @param name 容器名称，指定要获取文件列表的容器
   * @param path 指定路径的文件列表，可选参数，为空则获取/sdcard目录
   * @returns {Promise<ApiResponse<FileInfo[]>>} 返回Promise对象，包含完整响应（code和文件列表）
   * @example
   * // {"code": 200, "msg": [{"file": "/sdcard/Notifications", "flag": true, "length": 4096, "name": "Notifications"}]}
   */
  async getFileList(
    ip: string,
    name: string,
    path?: string
  ): Promise<ApiResponse<FileInfo[]>> {
    const response = await this.server.request<ApiResponse<FileInfo[]>>('get', `/get_file_list/${ip}/${name}`, {
      params: { path }
    });
    return response.data;
  }

  /**
   * 设置全球域名加速
   * @param ip 主机IP地址，用于指定要设置全球域名加速的容器所在的主机
   * @param name 容器名称，指定要设置全球域名加速的容器
   * @param enable 是否开启加速，可选参数，默认为0
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setGlobalDomainAccelerate(
    ip: string,
    name: string,
    enable: number = 0
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/global_domain_acclerate/${ip}/${name}/${enable}`);
    return response.data;
  }

  /**
   * 安装本地APK到安卓容器
   * @param ip 主机IP地址，用于指定要安装APK的容器所在的主机
   * @param name 容器名称，指定要安装APK的容器
   * @param local 本地APK文件路径，指定要安装的APK文件在本地的位置
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async installApk(
    ip: string,
    name: string,
    local: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/install_apk/${ip}/${name}`, {
      params: { local }
    });
    return response.data;
  }

  /**
   * 从URL安装APK到安卓容器
   * @param ip 主机IP地址，用于指定要安装APK的容器所在的主机
   * @param name 容器名称，指定要安装APK的容器
   * @param url APK文件URL，指定要安装的APK文件的URL地址
   * @param retry 重试次数，可选参数，默认为0
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async installApkFromUrl(
    ip: string,
    name: string,
    url: string,
    retry: number = 0
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/install_apk_fromurl/${ip}/${name}`, {
      data: { url, retry }
    });
    return response.data;
  }

  /**
   * 设置应用Root权限
   * @param ip 主机IP地址，用于指定要设置Root权限的容器所在的主机
   * @param name 容器名称，指定要设置Root权限的容器
   * @param packageName 应用包名，指定要设置Root权限的应用包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async rootApp(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/root_app/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 运行已安装的应用
   * @param ip 主机IP地址，用于指定要运行应用的容器所在的主机
   * @param name 容器名称，指定要运行应用的容器
   * @param packageName 应用包名，指定要运行的应用包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async runApp(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/run_apk/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 获取设备截图
   * @param ip 主机IP地址，用于指定要获取截图的容器所在的主机
   * @param name 容器名称，指定要获取截图的容器
   * @param level 截图质量，可选值：1(低) 2(中) 3(高)
   * @returns {Promise<ApiResponse<ScreenshotInfo>>} 返回Promise对象，包含完整响应（code和截图信息）
   * @example
   * // {"code": 200, "msg": {"url": "http://192.168.181.27:8089/1.png", "msg": "base64数据"}}
   */
  async getScreenshot(
    ip: string,
    name: string,
    level: number
  ): Promise<ApiResponse<ScreenshotInfo>> {
    const response = await this.server.request<ApiResponse<ScreenshotInfo>>('get', `/screenshots/${ip}/${name}/${level}`);
    return response.data;
  }

  /**
   * 发送短信
   * @param ip 主机IP地址，用于指定要发送短信的容器所在的主机
   * @param name 容器名称，指定要发送短信的容器
   * @param address 短信目的地址，指定短信接收者的号码
   * @param body 短信内容，指定要发送的短信内容
   * @param smscenterNo 短信中心号码，可选参数，指定短信中心号码
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async sendSms(
    ip: string,
    name: string,
    address: string,
    body: string,
    smscenterNo?: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/send_sms/${ip}/${name}`, {
      data: { address, body, smscenterNo }
    });
    return response.data;
  }

  /**
   * 设置应用所有权限
   * @param ip 主机IP地址，用于指定要设置权限的容器所在的主机
   * @param name 容器名称，指定要设置权限的容器
   * @param packageName 应用包名，指定要设置权限的应用包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setAppPermissions(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_app_permissions/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 设置分辨率感知白名单
   * @param ip 主机IP地址，用于指定要设置白名单的容器所在的主机
   * @param name 容器名称，指定要设置白名单的容器
   * @param packageName 应用包名，指定要设置白名单的应用包名
   * @param enable 是否加入白名单，可选值：1(加入) 0(移除)
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setAppResolutionFilter(
    ip: string,
    name: string,
    packageName: string,
    enable: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_app_resloution_filter/${ip}/${name}/${packageName}/${enable}`);
    return response.data;
  }

  /**
   * 控制音频播放
   * @param ip 主机IP地址，用于指定要控制音频的容器所在的主机
   * @param name 容器名称，指定要控制音频的容器
   * @param action 动作类型，可选值：'play'(播放) 'stop'(停止)
   * @param path 音频文件路径，指定要播放的音频文件路径
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setAudio(
    ip: string,
    name: string,
    action: AudioAction,
    path: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_audio/${ip}/${name}/${action}`, {
      params: { path }
    });
    return response.data;
  }

  /**
   * 设置开机启动应用
   * @param ip 主机IP地址，用于指定要设置开机启动的容器所在的主机
   * @param name 容器名称，指定要设置开机启动的容器
   * @param packageName 应用包名，指定要设置开机启动的应用包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setAutoRun(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_auto_run/${ip}/${name}/${packageName}`);
    return response.data;
  }

  /**
   * 执行ADB命令
   * @param ip 主机IP地址，用于指定要执行命令的容器所在的主机
   * @param name 容器名称，指定要执行命令的容器
   * @param command ADB命令，指定要执行的ADB命令
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async executeShell(
    ip: string,
    name: string,
    command: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/shell/${ip}/${name}`, {
      data: { cmd: command }
    });
    return response.data;
  }

  /**
   * 执行ADB命令(方法2)
   * @param ip 主机IP地址，用于指定要执行命令的容器所在的主机
   * @param name 容器名称，指定要执行命令的容器
   * @param command ADB命令，指定要执行的ADB命令
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async executeShell2(
    ip: string,
    name: string,
    command: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/shell2/${ip}/${name}`, {
      data: { cmd: command }
    });
    return response.data;
  }

  /**
   * 卸载APK
   * @param ip 主机IP地址，用于指定要卸载APK的容器所在的主机
   * @param name 容器名称，指定要卸载APK的容器
   * @param packageName 应用包名，指定要卸载的应用包名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async uninstallApk(
    ip: string,
    name: string,
    packageName: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/uninstall_apk/${ip}/${name}/${packageName}`);
    return response.data;
  }
} 