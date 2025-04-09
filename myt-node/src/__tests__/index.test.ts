import { OukekMyt, connectToSocket, disconnectFromSocket } from '../index';
import * as fs from 'fs';

// 设置更长的测试超时时间，避免异步操作未完成
jest.setTimeout(30000);

describe('OukekMyt SDK', () => {
  let sdk: OukekMyt;

  beforeAll(async () => {
    // 在所有测试开始前连接到socket服务器
    await connectToSocket();
  });

  afterAll(async () => {
    // 在所有测试结束后断开连接
    await disconnectFromSocket();
    // 等待所有潜在的异步操作完成并确保资源正确释放
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 强制清理任何可能遗留的事件监听器或定时器
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // 创建设备实例时直接传入设备信息
    sdk = new OukekMyt("192.168.3.34", 11010, 10);
  });

  describe('设备连接相关', () => {
    it('应该检查连接状态', async () => {
      const isConnected = await sdk.checkConnectState();
      expect(typeof isConnected).toBe('boolean');
    });

    it('应该获取SDK版本', async () => {
      const version = await sdk.getSdkVersion();
      expect(typeof version).toBe('number');
      expect(version).toBeGreaterThan(0);
    });
  });

  describe('工作模式设置', () => {
    it('应该设置RPA工作模式', async () => {
      const result = await sdk.setRpaWorkMode(1);
      expect(result).toBe(true);
    });
  });

  describe('截图相关', () => {
    it('应该进行压缩截图', async () => {
      const result = await sdk.takeCaptrueCompress(0, 80);
      expect(typeof result).toBe('string');
      // 判断是不是base64图片
      expect(result).toMatch(/^data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+$/);
    });

    it('应该保存截图到文件', async () => {
      const filePath = './test_screenshot.png';
      const result = await sdk.screentshot(0, 80, filePath);
      expect(result).toBe(true);
      
      // 检查文件是否存在
      expect(fs.existsSync(filePath)).toBe(true);
      
      // 检查文件大小是否大于0
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
      
      // 清理测试文件
      fs.unlinkSync(filePath);
    });

    it('应该保存指定区域的截图', async () => {
      const filePath = './test_screenshot_ex.jpg';
      const result = await sdk.screentshotEx(0, 0, 100, 100, 0, 80, filePath);
      expect(result).toBe(true);
      
      // 检查文件是否存在
      expect(fs.existsSync(filePath)).toBe(true);
      
      // 检查文件大小是否大于0
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
      
      // 清理测试文件
      fs.unlinkSync(filePath);
    });
  });

  describe('节点操作', () => {
    it('应该导出节点XML', async () => {
      const result = await sdk.dumpNodeXml();
      expect(typeof result).toBe('string');
    });

    it('应该通过类名获取节点', async () => {
      const result = await sdk.getNodeByClass('android.widget.TextView');
      expect(result).toBeDefined();
    });
  });

  describe('应用操作', () => {
    it('应该打开应用', async () => {
      const result = await sdk.openApp('com.android.settings');
      expect(result).toBe(true);
    });

    it('应该停止应用', async () => {
      const result = await sdk.stopApp('com.android.settings');
      expect(result).toBe(true);
    });
  });

  describe('文本输入', () => {
    it('应该发送文本', async () => {
      await sdk.clickId('com.shopee.id:id/search_bar')
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await sdk.sendText('Hello World');
      expect(result).toBe(true);
    });

    it('应该清除文本', async () => {
      const result = await sdk.clearText(5);
      expect(result).toBe(null);
    });
  });

  describe('命令执行', () => {
    it('应该执行命令', async () => {
      const result = await sdk.execCmd('ls');
      expect(result[result.length - 1]).toBe(true);
    });
  });

  describe('触摸操作', () => {
    it('应该按下触摸点', async () => {
      const result = await sdk.touchDown(0, 100, 100);
      expect(result).toBe(true);
    });

    it('应该移动触摸点', async () => {
      const result = await sdk.touchMove(0, 200, 200);
      expect(result).toBe(true);
    });

    it('应该抬起触摸点', async () => {
      const result = await sdk.touchUp(0, 200, 200);
      expect(result).toBe(true);
    });

    it('应该执行滑动操作', async () => {
      const result = await sdk.swipe(0, 100, 100, 200, 200, 500);
      expect(result).toBe(0);
    });
  });

  describe('按键操作', () => {
    it('应该按下按键', async () => {
      const result = await sdk.keyPress(4); // KEYCODE_BACK
      expect(result).toBe(true);
    });
  });
}); 