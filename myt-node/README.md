# Myt Node SDK

本 SDK 提供了一个简单的接口，通过 Python 后端执行数学运算。

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

### 加法运算

执行两个数字的加法运算。

```typescript
async add(a: number, b: number): Promise<number>
```

**参数：**
- `a`: 第一个数字
- `b`: 第二个数字

**返回值：**
- 返回一个 Promise，解析为 `a` 和 `b` 的和

**示例：**
```typescript
const result = await myt.add(5, 3);
console.log(result); // 输出: 8
```

### 减法运算

执行两个数字的减法运算。

```typescript
async subtract(a: number, b: number): Promise<number>
```

**参数：**
- `a`: 第一个数字
- `b`: 第二个数字

**返回值：**
- 返回一个 Promise，解析为 `a` 和 `b` 的差

**示例：**
```typescript
const result = await myt.subtract(5, 3);
console.log(result); // 输出: 2
```

## 错误处理

SDK 在以下情况下可能会抛出错误：
- 提供了无效的数字
- 无效的操作
- 操作超时（5秒）
- Python 进程失败
- 无效的结果类型
- JSON 解析错误

所有错误都会被包装在描述性消息中，指示失败的操作。

## 注意事项

- SDK 使用 Python 后端进程执行计算
- 操作有 5 秒的超时限制
- 输入的两个数字都必须是有效数字
- 结果始终是一个数字 