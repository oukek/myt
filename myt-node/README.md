# Myt Node SDK

本 SDK 提供了一个简单的接口，通过 Python 后端执行设备操作。

## 安装

```bash
npm install @oukek/myt
```

## 使用方法

首先，导入SDK并初始化连接：

```typescript
import { OukekMyt, connectToSocket, disconnectFromSocket } from '@oukek/myt';

// 首先建立与Python后端的连接
await connectToSocket();

// 创建设备实例
const myt = new OukekMyt('192.168.1.100', 5555, 30000);

// 使用设备
const version = await myt.getSdkVersion();
console.log('SDK版本:', version);

// 在应用退出前断开连接
await disconnectFromSocket();
```

## 连接管理

### 建立连接
```typescript
async connectToSocket(socketPort?: number): Promise<void>
```
连接到Python后端服务，可选择指定端口。

### 断开连接
```typescript
async disconnectFromSocket(): Promise<void>
```
关闭与Python后端的连接，会自动关闭所有设备连接。

## 设备操作

创建设备实例时需要提供设备IP、端口和超时时间：
```typescript
const myt = new OukekMyt(deviceIp, devicePort, deviceTimeout);
```

### 设备连接相关

#### 关闭设备连接
```typescript
async close(): Promise<boolean>
```
关闭当前设备连接。

#### 获取SDK版本
```typescript
async getSdkVersion(): Promise<string>
```
获取当前SDK的版本号。

#### 检查连接状态
```typescript
async checkConnectState(): Promise<boolean>
```
检查设备连接状态。

### 工作模式设置

#### 设置RPA工作模式
```typescript
async setRpaWorkMode(mode: number): Promise<boolean>
```
设置RPA工作模式。

### 截图相关

#### 压缩截图
```typescript
async takeCaptrueCompress(type: 0 | 1 = 0, quality: number): Promise<string>
```
进行压缩截图，type为0表示PNG格式，1表示JPG格式。

#### 截图保存
```typescript
async screentshot(type: 0 | 1 = 0, quality: number, path: string): Promise<string>
```
截图并保存到指定路径。

#### 区域截图
```typescript
async screentshotEx(x1: number, y1: number, x2: number, y2: number, type: 0 | 1, quality: number, path: string): Promise<string>
```
对指定区域进行截图并保存。

#### 区域压缩截图
```typescript
async takeCaptrueCompressEx(left: number, top: number, right: number, bottom: number, type: 0 | 1, quality: number): Promise<string>
```
对指定区域进行压缩截图。

### 节点操作

#### 导出节点XML
```typescript
async dumpNodeXml(includeInvisible: 0 | 1 = 1): Promise<string>
```
导出节点XML，可选择是否包含不可见节点。

#### 扩展导出节点XML
```typescript
async dumpNodeXmlEx(workMode: number, timeout: number): Promise<string>
```
使用自定义工作模式和超时时间导出节点XML。

#### 通过类名获取节点
```typescript
async getNodeByClass(className: string): Promise<any>
```
通过类名查找节点。

### 应用操作

#### 打开应用
```typescript
async openApp(packageName: string): Promise<boolean>
```
打开指定包名的应用。

#### 停止应用
```typescript
async stopApp(packageName: string): Promise<boolean>
```
停止指定包名的应用。

### 文本输入

#### 发送文本
```typescript
async sendText(text: string): Promise<boolean>
```
发送文本内容。

#### 清除文本
```typescript
async clearText(count: number): Promise<boolean>
```
清除指定数量的文本。

### 命令执行

#### 执行命令
```typescript
async execCmd(cmd: string): Promise<string>
```
执行指定的命令。

### 触摸操作

#### 按下触摸
```typescript
async touchDown(fingerId: number, x: number, y: number): Promise<boolean>
```
在指定坐标按下触摸。

#### 移动触摸
```typescript
async touchMove(fingerId: number, x: number, y: number): Promise<boolean>
```
移动触摸到指定坐标。

#### 抬起触摸
```typescript
async touchUp(fingerId: number, x: number, y: number): Promise<boolean>
```
在指定坐标抬起触摸。

#### 点击触摸
```typescript
async touchClick(fingerId: number, x: number, y: number): Promise<boolean>
```
在指定坐标进行点击操作。

#### 长按触摸
```typescript
async longClick(fingerId: number, x: number, y: number, duration: number): Promise<boolean>
```
在指定坐标进行长按操作。

#### 滑动操作
```typescript
async swipe(fingerId: number, x1: number, y1: number, x2: number, y2: number, duration: number): Promise<boolean>
```
从起始坐标滑动到目标坐标。

### 按键操作

#### 按键按下
```typescript
async keyPress(keycode: number): Promise<boolean>
```
按下指定键码的按键。

#### 返回键
```typescript
async pressBack(): Promise<boolean>
```
按下返回键。

#### 确认键
```typescript
async pressEnter(): Promise<boolean>
```
按下确认键。

#### 主页键
```typescript
async pressHome(): Promise<boolean>
```
按下主页键。

#### 最近任务键
```typescript
async pressRecent(): Promise<boolean>
```
按下最近任务键。

### 节点查找方法

#### 通过文本查找节点
```typescript
async getNodeByText(text: string): Promise<any>
```
通过文本内容查找节点。

#### 通过文本结尾匹配查找节点
```typescript
async getNodeByTextMatchEnd(text: string): Promise<any>
```
通过文本结尾匹配查找节点。

#### 通过文本开头匹配查找节点
```typescript
async getNodeByTextMatchStart(text: string): Promise<any>
```
通过文本开头匹配查找节点。

#### 通过包名查找节点
```typescript
async getNodeByPkg(pkg: string): Promise<any>
```
通过包名查找节点。

#### 通过ID查找节点
```typescript
async getNodeById(id: string): Promise<any>
```
通过ID查找节点。

#### 通过描述查找节点
```typescript
async getNodeByDesc(desc: string): Promise<any>
```
通过描述查找节点。

### 点击操作

#### 点击文本
```typescript
async clickText(text: string): Promise<boolean>
```
点击指定文本。

#### 点击文本开头匹配
```typescript
async clickTextMatchStart(text: string): Promise<boolean>
```
点击文本开头匹配的内容。

#### 点击类名
```typescript
async clickClass(className: string): Promise<boolean>
```
点击指定类名的元素。

#### 点击ID
```typescript
async clickId(id: string): Promise<boolean>
```
点击指定ID的元素。

#### 点击描述
```typescript
async clickDesc(desc: string): Promise<boolean>
```
点击指定描述的元素。

### 其他功能

#### 获取显示旋转
```typescript
async getDisplayRotate(): Promise<number>
```
获取屏幕旋转状态。

## 错误处理

SDK在以下情况下可能会抛出错误：
- 设备未初始化
- 操作超时 
- Python进程失败
- 无效的结果类型
- JSON解析错误

所有错误都会被包装在描述性消息中，指示失败的操作。

## 注意事项

- SDK使用Python后端进程执行操作
- 使用前必须先调用connectToSocket建立Python后端连接
- 设备初始化是自动的，无需显式调用init方法
- 所有设备方法都是异步的，需要使用async/await或Promise处理
- 在应用退出前请调用disconnectFromSocket关闭连接 