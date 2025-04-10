import { OukekMytServer } from '../myt-server';
import { 
  ApiResponse, 
  CameraRotation, 
  MirrorDirection, 
  VideoType, 
  CameraStreamOptions 
} from './type';

export class DeviceSensorModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取摄像头推流地址和类型
   * @param ip 主机IP地址，用于指定要获取推流信息的容器所在的主机
   * @param name 容器名称，指定要获取推流信息的容器
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async getCameraStream(
    ip: string,
    name: string
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/get_cam_stream/${ip}/${name}`);
    return response.data;
  }

  /**
   * 设置摄像头旋转
   * @param ip 主机IP地址，用于指定要设置旋转的容器所在的主机
   * @param name 容器名称，指定要设置旋转的容器
   * @param rot 旋转方向，可选值：0(不旋转) 1(90度) 2(180度) 3(270度)
   * @param face 镜像方向，可选值：0(不镜像) 1(镜像)
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setCameraRotation(
    ip: string,
    name: string,
    rot: CameraRotation,
    face: MirrorDirection
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_cam_rot/${ip}/${name}/${rot}/${face}`);
    return response.data;
  }

  /**
   * 设置摄像头推流地址和类型
   * @param ip 主机IP地址，用于指定要设置推流的容器所在的主机
   * @param name 容器名称，指定要设置推流的容器
   * @param vType 视频类型，可选值：1(rtmp/本地视频) 2(webrtc) 3(本地/网络图片)
   * @param options 可选参数，包含分辨率和推流地址
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setCameraStream(
    ip: string,
    name: string,
    vType: VideoType,
    options?: CameraStreamOptions
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', `/set_cam_stream/${ip}/${name}/${vType}`, {
      params: { resolution: options?.resolution },
      data: { addr: options?.addr }
    });
    return response.data;
  }

  /**
   * 设置运动传感器灵敏度
   * @param ip 主机IP地址，用于指定要设置灵敏度的容器所在的主机
   * @param name 容器名称，指定要设置灵敏度的容器
   * @param factor 灵敏度值，范围0-1000，0表示关闭，10表示静止，1000表示运动状态
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setMotionSensitivity(
    ip: string,
    name: string,
    factor: number
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_motion_sensitivity/${ip}/${name}/${factor}`);
    return response.data;
  }

  /**
   * 设置摇一摇状态
   * @param ip 主机IP地址，用于指定要设置摇一摇状态的容器所在的主机
   * @param name 容器名称，指定要设置摇一摇状态的容器
   * @param enable 是否启用，可选值：0(关闭) 1(开启)
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setShake(
    ip: string,
    name: string,
    enable: 0 | 1
  ): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', `/set_shake/${ip}/${name}/${enable}`);
    return response.data;
  }
} 