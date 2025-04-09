import { OukekMytServer } from '../myt-server';

export class ToolModule {
  constructor(private server: OukekMytServer) {}

  /**
   * 获取键值对
   * @param key 键，指定要获取值的键名
   * @returns {Promise<string | null>} 返回Promise对象，成功时返回键对应的值字符串，失败时返回null
   * @example
   * // {"code": 200, "msg": "键对应的值"}    
   */
  async getKeyValue(key: string): Promise<string | null> {
    try {
      const response = await this.server.request('get', '/get_key_value', {
        params: { key }
      });
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取键值失败:', error);
      return null;
    }
  }

  /**
   * 设置键值对
   * @param key 键，指定要设置的键名
   * @param value 值，指定要设置的值
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}    
   */
  async setKeyValue(key: string, value: string): Promise<boolean> {
    try {
      const response = await this.server.request('post', '/set_key_value', {
        data: { key, value }
      });
      
      return response.data.code === 200;
    } catch (error) {
      console.error('设置键值失败:', error);
      return false;
    }
  }

  /**
   * 删除键值对
   * @param key 键，指定要删除的键名
   * @returns {Promise<boolean>} 返回Promise对象，成功时返回true，失败时返回false
   * @example
   * // {"code": 200, "msg": ""}    
   */
  async delKeyValue(key: string): Promise<boolean> {
    try {
      const response = await this.server.request('get', '/del_key_value', {
        params: { key }
      });
      
      return response.data.code === 200;
    } catch (error) {
      console.error('删除键值失败:', error);
      return false;
    }
  }

  /**
   * 获取镜像列表
   * @returns {Promise<Array<{id: string, image: string, name: string}> | null>} 返回Promise对象，成功时返回镜像列表数组，失败时返回null
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
  async getImgList(): Promise<Array<{id: string, image: string, name: string}> | null> {
    try {
      const response = await this.server.request('get', '/get_img_list');
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('获取镜像列表失败:', error);
      return null;
    }
  }

  /**
   * 查询当前局域网内在线设备
   * @returns {Promise<Record<string, string> | null>} 返回Promise对象，成功时返回设备IP和设备码的映射对象，失败时返回null
   * @example
   * // {"code": 200, 
   * //     "msg":  {"192.168.181.27" :"e5ef14d8cee888ae8a5e511d79d71593d"}
   * // }
   */
  async queryMytOnline(): Promise<Record<string, string> | null> {
    try {
      const response = await this.server.request('get', '/query_myt');
      
      if (response.data.code === 200) {
        return response.data.msg;
      }
      return null;
    } catch (error) {
      console.error('查询在线设备失败:', error);
      return null;
    }
  }
} 