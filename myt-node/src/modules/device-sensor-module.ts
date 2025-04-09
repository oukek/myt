import { OukekMytServer } from '../myt-server';

export class DeviceSensorModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取摄像头推流地址和类型
   * @param ip 主机IP地址，用于指定要获取推流信息的容器所在的主机
   * @param name 容器名称，指定要获取推流信息的容器
   * @returns {Promise<string | null>} 返回Promise对象，成功时返回推流信息字符串，失败时返回null
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async getCameraStream(
    ip: string,
    name: string
  ): Promise<string | null> {
    try {
      const response = await this.server.request('get', `/get_cam_stream/${ip}/${name}`);
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取摄像头推流信息失败:', error);
      return null;
    }
  }

  /**
   * 设置摄像头旋转
   * @param ip 主机IP地址，用于指定要设置旋转的容器所在的主机
   * @param name 容器名称，指定要设置旋转的容器
   * @param rot 旋转方向，可选值：0(不旋转) 1(90度) 2(180度) 3(270度)
   * @param face 镜像方向，可选值：0(不镜像) 1(镜像)
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setCameraRotation(
    ip: string,
    name: string,
    rot: 0 | 1 | 2 | 3,
    face: 0 | 1
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/set_cam_rot/${ip}/${name}/${rot}/${face}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('设置摄像头旋转失败:', error);
      return false;
    }
  }

  /**
   * 设置摄像头推流地址和类型
   * @param ip 主机IP地址，用于指定要设置推流的容器所在的主机
   * @param name 容器名称，指定要设置推流的容器
   * @param vType 视频类型，可选值：1(rtmp/本地视频) 2(webrtc) 3(本地/网络图片)
   * @param options 可选参数对象
   * @param options.resolution 分辨率，可选值：1(低) 2(高)
   * @param options.addr 推流地址，可选参数，指定推流地址
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": "XXX"}
   */
  async setCameraStream(
    ip: string,
    name: string,
    vType: 1 | 2 | 3,
    options?: {
      resolution?: 1 | 2;
      addr?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await this.server.request('post', `/set_cam_stream/${ip}/${name}/${vType}`, {
        params: { resolution: options?.resolution },
        data: { addr: options?.addr }
      });
      return response.data.code === 200;
    } catch (error) {
      console.error('设置摄像头推流失败:', error);
      return false;
    }
  }

  /**
   * 设置运动传感器灵敏度
   * @param ip 主机IP地址，用于指定要设置灵敏度的容器所在的主机
   * @param name 容器名称，指定要设置灵敏度的容器
   * @param factor 灵敏度值，范围0-1000，0表示关闭，10表示静止，1000表示运动状态
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setMotionSensitivity(
    ip: string,
    name: string,
    factor: number
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/set_motion_sensitivity/${ip}/${name}/${factor}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('设置运动传感器灵敏度失败:', error);
      return false;
    }
  }

  /**
   * 设置摇一摇状态
   * @param ip 主机IP地址，用于指定要设置摇一摇状态的容器所在的主机
   * @param name 容器名称，指定要设置摇一摇状态的容器
   * @param enable 是否启用，可选值：0(关闭) 1(开启)
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}
   */
  async setShake(
    ip: string,
    name: string,
    enable: 0 | 1
  ): Promise<boolean> {
    try {
      const response = await this.server.request('get', `/set_shake/${ip}/${name}/${enable}`);
      return response.data.code === 200;
    } catch (error) {
      console.error('设置摇一摇状态失败:', error);
      return false;
    }
  }
} 