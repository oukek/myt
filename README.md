# Myt Monorepo

这是一个包含Python和Node.js项目的monorepo。

## 项目结构

- `myt-python`: Python项目，支持打包成可执行文件
- `myt-node`: Node.js SDK项目，发布为npm包 `@oukek/myt`

## 使用方法

### 完整构建流程

1. 安装依赖：
```bash
pnpm install
```

2. 构建所有项目：
```bash
pnpm run build
```
这个命令会：
- 构建Python可执行文件并复制到Node.js项目的dist目录
- 构建Node.js SDK

### 单独构建

#### Python项目

1. 进入Python项目目录：
```bash
cd myt-python
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 打包：
```bash
pyinstaller main.spec
```

#### Node.js SDK

1. 安装依赖：
```bash
pnpm install
```

2. 构建：
```bash
pnpm run build
```

3. 发布到npm：
```bash
pnpm publish
```

## 跨平台支持

- Windows: 生成 `myt-python.exe`
- macOS: 生成 `myt-python`（可执行文件）
- Linux: 生成 `myt-python`（可执行文件）

## 注意事项

- Python可执行文件会被自动复制到Node.js项目的dist目录
- 在macOS下会自动添加可执行权限
- 发布的npm包中会包含对应平台的可执行文件
- 在Node.js代码中可以通过相对路径访问Python可执行文件 