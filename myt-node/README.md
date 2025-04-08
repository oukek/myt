# Myt Node SDK

本 SDK 提供了一个简单的接口，通过 Python 后端执行设备操作。

## 安装

```bash
npm install @oukek/myt
```

## 使用方法

首先，导入并实例化 SDK：

```typescript
import { OukekMyt } from '@oukek/myt';

const myt = new OukekMyt();
```

## 可用 API

### 设备连接相关

#### 初始化设备连接
```typescript
async init(ip: string, port: number, timeout: number): Promise<boolean>
```
初始化设备连接，设置 IP、端口和超时时间。

#### 获取 SDK 版本
```typescript
async getSdkVersion(): Promise<string>
```
获取当前 SDK 的版本号。

#### 检查连接状态
```typescript
async checkConnectState(): Promise<boolean>
```
检查设备连接状态。

### 工作模式设置

#### 设置 RPA 工作模式
```typescript
async setRpaWorkMode(mode: number): Promise<boolean>
```
设置 RPA 工作模式。

### 截图相关

#### 压缩截图
```typescript
async takeCaptrueCompress(type: 0 | 1 = 0, quality: number): Promise<string>
```
进行压缩截图，type 为 0 表示 PNG 格式，1 表示 JPG 格式。

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

### 节点操作

#### 导出节点 XML
```typescript
async dumpNodeXml(includeInvisible: 0 | 1 = 1): Promise<string>
```
导出节点 XML，可选择是否包含不可见节点。

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

#### 通过 ID 查找节点
```typescript
async getNodeById(id: string): Promise<any>
```
通过 ID 查找节点。

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

#### 点击 ID
```typescript
async clickId(id: string): Promise<boolean>
```
点击指定 ID 的元素。

## 错误处理

SDK 在以下情况下可能会抛出错误：
- 设备未初始化
- 操作超时（30秒）
- Python 进程失败
- 无效的结果类型
- JSON 解析错误

所有错误都会被包装在描述性消息中，指示失败的操作。

## 注意事项

- SDK 使用 Python 后端进程执行操作
- 操作有 30 秒的超时限制
- 使用前必须先调用 init 方法初始化设备连接
- 所有方法都是异步的，需要使用 async/await 或 Promise 处理 