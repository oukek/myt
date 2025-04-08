# MytClient SDK

这是一个用于控制 Android 设备的 SDK，提供了 Python 和 Node.js 两种实现。

## Python SDK

### 安装依赖

```bash
pip install -r requirements.txt
```

### 基本用法

```python
from main import MytClient

# 创建客户端实例
client = MytClient()

# 初始化连接
client.init("192.168.3.34", 11010, 10)
```

## Node.js SDK

### 安装

```bash
npm install myt-client
```

### 基本用法

```typescript
import { OukekMyt } from 'myt-client';

// 创建客户端实例
const client = new OukekMyt();

// 初始化连接
await client.init("192.168.3.34", 11010, 10);
```

## 接口说明

### 1. 设备连接相关

#### init(ip, port, timeout)
- 功能：初始化设备连接
- 参数：
  - ip: 设备IP地址
  - port: 设备端口
  - timeout: 超时时间（秒）
- 返回：成功返回 True，失败返回错误信息

#### getSdkVersion()
- 功能：获取SDK版本号
- 返回：版本号字符串

#### checkConnectState()
- 功能：检查当前连接状态
- 返回：True 表示连接正常，False 表示连接断开

### 2. 工作模式设置

#### setRpaWorkMode(mode)
- 功能：设置RPA工作模式
- 参数：
  - mode: 工作模式（0:关闭无障碍，1:开启无障碍）
- 返回：成功返回 True，失败返回错误信息

### 3. 截图相关

#### takeCaptrueCompress(quality, timeout)
- 功能：获取压缩后的截图数据
- 参数：
  - quality: 图片质量（0-100）
  - timeout: 超时时间（毫秒）
- 返回：图片字节数组

#### screentshot(quality, path)
- 功能：截图并保存到指定路径
- 参数：
  - quality: 图片质量（0-100）
  - path: 保存路径
- 返回：成功返回 True，失败返回错误信息

#### screentshotEx(x1, y1, x2, y2, quality, path)
- 功能：截取指定区域的图片并保存
- 参数：
  - x1, y1: 起始坐标
  - x2, y2: 结束坐标
  - quality: 图片质量（0-100）
  - path: 保存路径
- 返回：成功返回 True，失败返回错误信息

### 4. 节点操作

#### dumpNodeXml(includeInvisible)
- 功能：导出节点XML信息
- 参数：
  - includeInvisible: 是否包含不可见节点
- 返回：XML字符串

#### getNodeByClass(className)
- 功能：根据类名获取节点
- 参数：
  - className: 节点类名
- 返回：节点信息

#### createSelector()
- 功能：创建节点选择器
- 返回：选择器对象

### 5. 应用操作

#### openApp(packageName)
- 功能：打开指定应用
- 参数：
  - packageName: 应用包名
- 返回：成功返回 True，失败返回错误信息

#### stopApp(packageName)
- 功能：关闭指定应用
- 参数：
  - packageName: 应用包名
- 返回：成功返回 True，失败返回错误信息

### 6. 文本输入

#### sendText(text)
- 功能：发送文本
- 参数：
  - text: 要发送的文本
- 返回：成功返回 True，失败返回错误信息

#### clearText(count)
- 功能：清除文本
- 参数：
  - count: 清除的字符数
- 返回：成功返回 True，失败返回错误信息

### 7. 命令执行

#### execCmd(cmd)
- 功能：执行ADB命令
- 参数：
  - cmd: 要执行的命令
- 返回：命令执行结果

### 8. 触摸操作

#### touchDown(fingerId, x, y)
- 功能：按下触摸
- 参数：
  - fingerId: 手指ID
  - x, y: 触摸坐标
- 返回：成功返回 True，失败返回错误信息

#### touchMove(fingerId, x, y)
- 功能：移动触摸
- 参数：
  - fingerId: 手指ID
  - x, y: 触摸坐标
- 返回：成功返回 True，失败返回错误信息

#### touchUp(fingerId, x, y)
- 功能：抬起触摸
- 参数：
  - fingerId: 手指ID
  - x, y: 触摸坐标
- 返回：成功返回 True，失败返回错误信息

#### swipe(fingerId, x1, y1, x2, y2, duration)
- 功能：滑动操作
- 参数：
  - fingerId: 手指ID
  - x1, y1: 起始坐标
  - x2, y2: 结束坐标
  - duration: 滑动持续时间（毫秒）
- 返回：成功返回 True，失败返回错误信息

### 9. 按键操作

#### keyPress(keycode)
- 功能：模拟按键
- 参数：
  - keycode: 按键码
- 返回：成功返回 True，失败返回错误信息

## 错误处理

所有方法都会返回统一的错误格式：
```json
{
    "error": "错误描述"
}
```

## 命令行使用

可以通过命令行调用任意方法：
```bash
python main.py <方法名> <参数1> <参数2>
```

例如：
```bash
python main.py init 192.168.3.34 11010
python main.py openApp com.blue.filemanager
python main.py sendText "测试文本"
```

## 注意事项

1. 使用前请确保设备已正确连接
2. 部分操作需要设备开启无障碍服务
3. 坐标系统以设备屏幕左上角为原点(0,0)
4. 所有时间参数单位均为毫秒
5. Node.js 版本需要支持 ES6+ 特性
6. 建议使用 TypeScript 以获得更好的类型提示 