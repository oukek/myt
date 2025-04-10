import { OukekMytServer } from '../myt-server';
import { ApiResponse, ImageInfo } from './type';

export class ToolModule {
  
  constructor(private server: OukekMytServer) {}

  /**
   * 获取键值对
   * @param key 键，指定要获取值的键名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": "键对应的值"}    
   */
  async getKeyValue(key: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', '/get_key_value', {
      params: { key }
    });
    
    return response.data;
  }

  /**
   * 设置键值对
   * @param key 键，指定要设置的键名
   * @param value 值，指定要设置的值
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}    
   */
  async setKeyValue(key: string, value: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('post', '/set_key_value', {
      data: { key, value }
    });
    
    return response.data;
  }

  /**
   * 删除键值对
   * @param key 键，指定要删除的键名
   * @returns {Promise<ApiResponse<string>>} 返回Promise对象，包含完整响应（code和msg）
   * @example
   * // {"code": 200, "msg": ""}    
   */
  async delKeyValue(key: string): Promise<ApiResponse<string>> {
    const response = await this.server.request<ApiResponse<string>>('get', '/del_key_value', {
      params: { key }
    });
    
    return response.data;
  }

  /**
   * 获取镜像列表
   * @returns {Promise<ApiResponse<ImageInfo[]>>} 返回Promise对象，包含完整响应（code和镜像列表数组）
   * @example
   * // {"code": 200, 
   * //     "msg": [
   * //         {
   * //             "id": "46",
   * //             "image": "registry.cn-hangzhou.aliyuncs.com/whsyf/dobox:rk3588-dm-base-20230807-01",
   * //             "name": "test_0807"
   * //         },
   * //         {
   * //             "id": "49",
   * //             "image": "registry.cn-hangzhou.aliyuncs.com/whsyf/dobox:rk3588-dm-base-20230907-01",
   * //             "name": "test_beta_0907_1"
   * //         }
   * //     ]
   * // }
   */
  async getImgList(): Promise<ApiResponse<ImageInfo[]>> {
    const response = await this.server.request<ApiResponse<ImageInfo[]>>('get', '/get_img_list');
    
    return response.data;
  }

  /**
   * 查询当前局域网内在线设备
   * @returns {Promise<ApiResponse<Record<string, string>>>} 返回Promise对象，包含完整响应（code和设备映射对象）
   * @example
   * // {"code": 200, 
   * //     "msg":  {"192.168.181.27" :"e5ef14d8cee888ae8a5e511d79d71593d"}
   * // }
   */
  async queryMytOnline(): Promise<ApiResponse<Record<string, string>>> {
    const response = await this.server.request<ApiResponse<Record<string, string>>>('get', '/query_myt');
    
    return response.data;
  }
} 