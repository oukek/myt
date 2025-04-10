export type ApiResponse<T> = {
  code: number;
  msg: T;
};

/**
 * 镜像信息接口
 */
export interface ImageInfo {
  id: string;
  image: string;
  name: string;
}

/**
 * S5代理连接选项接口
 */
export interface S5ConnectionOptions {
  s5ip?: string;
  s5port?: number;
  s5user?: string;
  s5pwd?: string;
  domain_mode?: number;
}

/**
 * 支持的语言类型
 */
export type LanguageType = 'zh' | 'en' | 'fr' | 'th' | 'vi' | 'ja' | 'ko' | 'lo' | 'in';

/**
 * IP智能定位选项接口
 */
export interface IpLocationOptions {
  userip?: string;
  modelid?: string;
}

/**
 * 硬件配置信息接口
 */
export interface HardwareConfig {
  cpuload: string;      // CPU负载百分比
  cputemp: number;      // CPU温度
  deviceId: string;     // 设备ID
  hwaddr: string;       // 硬件地址
  ip: string;           // IP地址
  memtotal: string;     // 内存总量
  memuse: string;       // 已使用内存
  mmctotal: string;     // MMC存储总量
  mmcuse: string;       // MMC已使用量
  model: string;        // 设备型号
  version: string;      // 固件版本
}

/**
 * 系统信息接口
 */
export interface SystemInfo {
  cpu: number;              // CPU使用率百分比
  disk_percent: number;     // 硬盘使用率百分比
  disk_total: number;       // 硬盘总大小，单位：bytes
  mem_percent: number;      // 内存使用率百分比
  mem_total: number;        // 内存总大小，单位：bytes
  temperatures: number;     // CPU温度
}

/**
 * 本地系统信息接口
 */
export interface LocalSystemInfo extends SystemInfo {
  swap_total: number;       // Swap分区总大小，单位：bytes，0表示未开启虚拟内存
  swap_percent: number;     // Swap分区使用率百分比，0表示未开启虚拟内存
}

/**
 * 主机重启选项接口
 */
export interface RebootHostOptions {
  isblock?: number;         // 是否阻塞等待，0(非阻塞) 1(阻塞)
  timeout?: number;         // 超时时间(秒)
  ssh_uname?: string;       // SSH用户名
  ssh_pwd?: string;         // SSH密码
  root_pwd?: string;        // root密码
}

/**
 * 风扇设置选项接口
 */
export interface FanOptions {
  mode?: number;            // 风扇模式，0(自动) 1(手动)
  speed?: number;           // 风扇速度，1-5(对应20%-100%)
}

/**
 * 摄像头旋转方向
 */
export type CameraRotation = 0 | 1 | 2 | 3;  // 0(不旋转) 1(90度) 2(180度) 3(270度)

/**
 * 镜像方向
 */
export type MirrorDirection = 0 | 1;  // 0(不镜像) 1(镜像)

/**
 * 视频类型
 */
export type VideoType = 1 | 2 | 3;  // 1(rtmp/本地视频) 2(webrtc) 3(本地/网络图片)

/**
 * 分辨率选项
 */
export type Resolution = 1 | 2;  // 1(低) 2(高)

/**
 * 摄像头流设置选项接口
 */
export interface CameraStreamOptions {
  resolution?: Resolution;
  addr?: string;
}

/**
 * 机型信息字典类型
 */
export type DeviceInfoDict = Record<string, Record<string, number>>;

/**
 * 异步随机设备信息动作类型
 */
export type AsyncAction = 'request' | 'query';

/**
 * 自定义设备信息选项接口
 */
export interface CustomDeviceOptions {
  androidId?: string;     // 安卓ID
  iccid?: string;         // SIM卡ICCID
  imei?: string;          // 设备IMEI
  imsi?: string;          // SIM卡IMSI
  seriesNum?: string;     // 序列号
  btaddr?: string;        // 蓝牙地址
  btname?: string;        // 蓝牙名称
  wifiMac?: string;       // WiFi MAC地址
  wifiName?: string;      // WiFi名称
  oaid?: string;          // OAID
  aaid?: string;          // AAID
  vaid?: string;          // VAID
}

/**
 * 指纹信息选项接口
 */
export interface FingerprintOptions {
  lac?: string;           // 位置区码
  cid?: string;           // 小区ID
  lat?: string;           // 纬度
  lon?: string;           // 经度
  mcc?: string;           // 移动国家码
  mnc?: string;           // 移动网络码
  phonenumber?: string;   // 电话号码
  country?: string;       // 国家
  language?: string;      // 语言
  timezone?: string;      // 时区
  opercode?: string;      // 运营商代码
  opername?: string;      // 运营商名称
  iccid?: string;         // SIM卡ICCID
  imsi?: string;          // SIM卡IMSI
  imei?: string;          // 设备IMEI
  gaid?: string;          // Google广告ID
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  file: string;           // 文件完整路径
  flag: boolean;          // 是否为目录
  length: number;         // 文件大小
  name: string;           // 文件名
}

/**
 * 安卓启动状态选项接口
 */
export interface BootStatusOptions {
  isblock?: number;       // 是否阻塞等待
  timeout?: number;       // 超时时间(秒)
  init_devinfo?: number;  // 是否判断初始化设备信息完成
}

/**
 * 截图信息接口
 */
export interface ScreenshotInfo {
  url: string;            // 截图URL
  msg: string;            // base64数据
}

/**
 * 短信发送选项接口
 */
export interface SmsOptions {
  address: string;        // 短信目的地址
  body: string;           // 短信内容
  smscenterNo?: string;   // 短信中心号码
}

/**
 * 音频控制动作类型
 */
export type AudioAction = 'play' | 'stop';

/**
 * 网络配置接口
 */
export interface NetworkConfig {
  gw: string;             // 网关地址
  ip: string;             // IP地址
  subnet: string;         // 子网掩码
}

/**
 * 容器创建选项接口
 */
export interface ContainerCreateOptions {
  sandbox?: number;       // 沙盒模式，1启用，0禁用
  sandbox_size?: number;  // 沙盒大小，单位MB
  image_addr?: string;    // 镜像地址
  memory?: number;        // 内存大小，单位MB
  cpu?: string;           // CPU核心数
  resolution?: number;    // 分辨率
  dns?: string;           // DNS服务器地址
  width?: number;         // 屏幕宽度
  height?: number;        // 屏幕高度
  dpi?: number;           // 屏幕DPI值
  fps?: number;           // 帧率
  data_res?: string;      // 数据分辨率
  mac?: string;           // MAC地址
  random_dev?: number;    // 随机设备号
  s5ip?: string;          // Socks5代理IP
  s5port?: number;        // Socks5代理端口
  s5user?: string;        // Socks5代理用户名
  s5pwd?: string;         // Socks5代理密码
  dnstcp_mode?: number;   // DNS TCP模式
  rpaport?: number;       // RPA端口号
  initdev?: string;       // 初始化设备
  enforce?: number;       // 强制模式
  yktid?: string;         // 云控ID
  ykuser?: string;        // 云控用户名
  yktoken?: string;       // 云控令牌
  ykbitrate?: string;     // 云控码率
  phyinput?: number;      // 物理输入
  adbport?: number;       // ADB端口号
  timeoffset?: number;    // 时间偏移量
  enablemeid?: number;    // 启用MEID
  tcp_map_port?: string;  // TCP映射端口
  udp_map_port?: string;  // UDP映射端口
  img_url?: string;       // 镜像URL
}

/**
 * 导出文件操作类型
 */
export type ExportFileAction = 'list' | 'del' | 'get';

/**
 * 容器更新选项接口
 */
export interface ContainerUpdateOptions {
  dns?: string;           // DNS服务器地址
  index?: number;         // 容器索引
  image_addr?: string;    // 镜像地址
  name?: string;          // 容器名称
  network?: number;       // 网络模式
  fps?: number;           // 帧率
  mac?: string;           // MAC地址
  enforce?: number;       // 强制模式
  resolution?: number;    // 分辨率
  width?: number;         // 屏幕宽度
  height?: number;        // 屏幕高度
  dpi?: number;           // 屏幕DPI值
  model?: string;         // 设备型号
  yktid?: string;         // 云控ID
  ykuser?: string;        // 云控用户名
  yktoken?: string;       // 云控令牌
  ykbitrate?: string;     // 云控码率
}

/**
 * 容器列表项接口
 */
export interface ContainerListItem {
  Names: string;          // 容器名称
  State: string;          // 容器状态
  data: string;           // 容器数据
  index: number;          // 容器索引
  ip: string;             // 容器IP地址
}

/**
 * 容器详情接口
 */
export interface ContainerDetail {
  cpuset: string;         // CPU核心设置
  dns: string;            // DNS服务器地址
  dpi: string;            // 屏幕DPI值
  fps: string;            // 帧率
  hardware: string;       // 硬件信息
  height: string;         // 屏幕高度
  id: string;             // 容器ID
  image: string;          // 镜像信息
  index: number;          // 容器索引
  ip: string;             // 容器IP地址
  local_ip: string;       // 本地IP地址
  memory: number;         // 内存大小
  name: string;           // 容器名称
  network: string;        // 网络信息
  rpa: string;            // RPA信息
  status: string;         // 容器状态
  width: string;          // 屏幕宽度
}

/**
 * 上传文件选项接口
 */
export interface UploadFileOptions {
  url: string;            // 文件URL
  remote_path: string;    // 远程保存路径
  retry: number;          // 重试次数
}

/**
 * 支持的设备型号类型
 */
export type DeviceModelType = 'a1' | 'c1' | 'p1';

/**
 * 自发现设备信息接口
 */
export interface DeviceInfo {
  iP: string;           // 设备IP地址
  type: string;         // 设备类型
  iD: string;           // 设备ID
  name: string;         // 设备名称
  lastSeen: Date;       // 最后发现时间
}


