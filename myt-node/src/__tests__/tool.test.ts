import { OukekMytServer } from '../index';

// 设置更长的测试超时时间，避免异步操作未完成
jest.setTimeout(30000);

describe('OukekMytServer SDK', () => {

  describe('发现设备', () => {
    it('应该发现设备', async () => {
      const devices = await OukekMytServer.discoverDevices();
      console.log(devices);
    });
  });
}); 