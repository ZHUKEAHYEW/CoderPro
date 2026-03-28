# CoderPro

<div align="center">

**面向开发者的桌面端效率辅助工具**  
**Desktop Efficiency Tool for Developers**

🚀 本地驱动 · 🎨 赛博美学 · ⚡ 极速体验  
🚀 Local-Driven · 🎨 Cyber Aesthetics · ⚡ Lightning Fast

[MIT License](LICENSE) · [Issues](https://github.com/ZHUKEAHYEW/CoderPro/issues)

[中文](#-项目介绍) | [English](#-introduction)

</div>

---

## 📖 项目介绍

CoderPro 是一款专为开发者设计的桌面端效率辅助工具，采用 **Electron + Vue 3 + Vite** 技术栈构建。它以本地 JSON 数据驱动，无需联网即可使用，保证数据私密性的同时，提供极致的使用体验。

### ✨ 核心特性

- **🎨 苹果玻璃质感设计** - 极致的毛玻璃特效（Glassmorphism）、等宽字体、赛博青/荧光绿点缀色
- **🪟 全局无边框悬浮窗** - 随时拖拽、不遮挡工作视线、保持置顶
- **💾 本地数据驱动** - 无需联网，极简极速，保证数据私密
- **⚡ 快速启动** - 基于 Electron，跨平台支持
- **🔧 开发者友好** - 专为开发工作流优化的功能设计

### 🎯 功能模块

| 模块 | 功能描述 |
|------|----------|
| **网址记录** | 记录常用开发文档、服务器链接，一键浏览器打开 |
| **文本片段** | 保存代码片段 (Snippets)、AI 提示词 (Prompts)，支持一键复制 |
| **今日任务** | 规划每日待办，实时同步状态，独立悬浮窗预览 |

---

## 🖼️ 功能预览

![CoderPro 应用截图](eg.png)

*上图：CoderPro 桌面应用界面展示，包含主悬浮窗、任务管理面板和文本片段面板*

### 主悬浮窗（反应堆核心）
- 启动后桌面显示赛博青色高光的悬浮图标
- 支持拖拽移动，带有发光动画反馈
- 点击展开/收起二级菜单面板

### 二级菜单（功能面板）
- 左侧导航栏包含三大核心模块
- 支持完整的**增删查改**操作
- 毛玻璃背景，科技感十足

### 任务悬浮窗（独立面板）
- 独立透明面板，可自由拖拽
- 实时预览任务进度
- 支持快速标记完成状态

---

## 🚀 快速开始

### 环境要求

- **Node.js**: v16 及以上版本
- **npm**: v8 及以上版本
- **Python**: v3.8+（可选，用于 Python 启动器）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/ZHUKEAHYEW/CoderPro.git
cd CoderPro
```

2. **安装依赖**
```bash
npm install
```

> 💡 **提示**: 如果安装 Electron 速度较慢，可以设置 npm 镜像：
> ```bash
> npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
> ```

3. **启动开发环境**
```bash
npm run electron:dev
```

此时桌面上会出现主悬浮窗和任务悬浮窗。

---

## 📦 构建与打包

### 方式一：使用 npm 构建（推荐）

```bash
npm run electron:build
```

打包成功后，安装程序会输出在 `dist_electron` 目录下。

### 方式二：使用 Python 启动器

项目提供了 Python 启动器，可以自动处理依赖安装和启动流程。

```bash
# 安装 PyInstaller（如果需要打包启动器）
pip install pyinstaller

# 打包启动器
pyinstaller --onefile --windowed --name CoderProLauncher main.py

# 运行启动器
python main.py
```

启动器会自动：
- 检查并安装 node_modules 依赖
- 启动 Vite 开发服务器
- 启动 Electron 主进程

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Electron** | ^41.0.4 | 桌面应用框架 |
| **Vue** | ^3.5.0 | 前端框架 |
| **Vite** | ^5.2.0 | 构建工具 |
| **Tailwind CSS** | ^3.4.4 | 原子化 CSS |
| **Lucide Vue** | ^0.400.0 | 图标库 |
| **Electron Builder** | ^24.13.3 | 打包工具 |

---

## 📁 项目结构

```
CoderPro/
├── src/                    # 前端源代码
│   ├── components/        # Vue 组件
│   │   ├── MainWidget.vue      # 主悬浮窗
│   │   ├── TaskManager.vue     # 任务管理
│   │   ├── TextManager.vue     # 文本管理
│   │   └── UrlManager.vue      # 网址管理
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── build/               # 构建资源（图标等）
├── main.js              # Electron 主进程
├── preload.js           # Electron 预加载脚本
├── main.py              # Python 启动器
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
└── postcss.config.js    # PostCSS 配置
```

---

## 💾 数据存储

所有数据均存储在操作系统级别的应用数据目录下：

- **Windows**: `C:\Users\用户名\AppData\Roaming\coderpro\coderpro_data.json`
- **macOS**: `~/Library/Application Support/coderpro/coderpro_data.json`
- **Linux**: `~/.config/coderpro/coderpro_data.json`

数据文件格式为 JSON，包含：
- 网址记录
- 文本片段
- 任务列表

---

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（Vite + Electron）
npm run electron:dev
```

### 可用脚本

```bash
# 开发模式
npm run dev          # 仅启动 Vite
npm run electron:dev # 启动 Vite + Electron

# 构建
npm run build        # 构建前端资源
npm run electron:build # 构建 Electron 应用

# 预览
npm run preview      # 预览构建结果
```

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v1.0.0 (2026-03-28)
- ✨ 初始版本发布
- 🎨 实现主悬浮窗和任务悬浮窗
- 📝 支持网址记录、文本片段、任务管理
- 💾 本地 JSON 数据存储
- 🚀 Python 启动器支持

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美丽的图标库

---

## 📧 联系方式

- **项目地址**: https://github.com/ZHUKEAHYEW/CoderPro
- **问题反馈**: https://github.com/ZHUKEAHYEW/CoderPro/issues

---

<div align="center">

**如果觉得有用，请给个 ⭐ Star 支持一下！**  
**If you find this useful, please give it a ⭐ Star!**

Made with ❤️ by CoderPro Team

</div>

---

# 🇺🇸 English Version

## 📖 Introduction

CoderPro is a desktop efficiency tool designed specifically for developers, built with the **Electron + Vue 3 + Vite** technology stack. It's driven by local JSON data, requiring no internet connection, ensuring data privacy while providing an exceptional user experience.

### ✨ Key Features

- **🎨 Apple Glass Morphism Design** - Ultimate glassmorphism effects, monospace fonts, cyber青色/neon green accents
- **🪟 Global Borderless Floating Window** - Drag anytime, doesn't block work view, always on top
- **💾 Local Data Driven** - No internet needed, minimal and fast, ensures data privacy
- **⚡ Fast Startup** - Based on Electron, cross-platform support
- **🔧 Developer Friendly** - Features optimized for development workflows

### 🎯 Function Modules

| Module | Description |
|--------|-------------|
| **URL Manager** | Save frequently used dev docs and server links, open with one click |
| **Text Snippets** | Save code snippets and AI prompts, support one-click copy |
| **Today's Tasks** | Plan daily tasks, real-time sync status, independent floating window preview |

---

## 🖼️ Feature Preview

### Main Floating Window (Reactor Core)
- Displays a cyber青色 highlighted floating icon on the desktop after startup
- Supports drag-and-drop movement with glowing animation feedback
- Click to expand/collapse the secondary menu panel

### Secondary Menu (Function Panel)
- Left navigation bar contains three core modules
- Supports complete **CRUD** operations
- Glassmorphism background, full of tech feel

### Task Floating Window (Independent Panel)
- Independent transparent panel, freely draggable
- Real-time task progress preview
- Support quick marking of completion status

---

## 🚀 Quick Start

### Requirements

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **Python**: v3.8+ (optional, for Python launcher)

### Installation Steps

1. **Clone the Project**
```bash
git clone https://github.com/ZHUKEAHYEW/CoderPro.git
cd CoderPro
```

2. **Install Dependencies**
```bash
npm install
```

> 💡 **Tip**: If Electron installation is slow, set npm mirror:
> ```bash
> npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
> ```

3. **Start Development Environment**
```bash
npm run electron:dev
```

The main floating window and task floating window will appear on your desktop.

---

## 📦 Build and Package

### Method 1: Using npm Build (Recommended)

```bash
npm run electron:build
```

After successful build, the installer will be output in the `dist_electron` directory.

### Method 2: Using Python Launcher

The project provides a Python launcher that automatically handles dependency installation and startup process.

```bash
# Install PyInstaller (if you need to package the launcher)
pip install pyinstaller

# Package the launcher
pyinstaller --onefile --windowed --name CoderProLauncher main.py

# Run the launcher
python main.py
```

The launcher will automatically:
- Check and install node_modules dependencies
- Start Vite development server
- Start Electron main process

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Electron** | ^41.0.4 | Desktop application framework |
| **Vue** | ^3.5.0 | Frontend framework |
| **Vite** | ^5.2.0 | Build tool |
| **Tailwind CSS** | ^3.4.4 | Utility-first CSS |
| **Lucide Vue** | ^0.400.0 | Icon library |
| **Electron Builder** | ^24.13.3 | Packaging tool |

---

## 📁 Project Structure

```
CoderPro/
├── src/                    # Frontend source code
│   ├── components/        # Vue components
│   │   ├── MainWidget.vue      # Main floating window
│   │   ├── TaskManager.vue     # Task management
│   │   ├── TextManager.vue     # Text management
│   │   └── UrlManager.vue      # URL management
│   ├── App.vue          # Root component
│   ├── main.js          # Entry file
│   └── style.css        # Global styles
├── build/               # Build assets (icons, etc.)
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── main.py              # Python launcher
├── index.html           # HTML template
├── package.json         # Project configuration
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

---

## 💾 Data Storage

All data is stored in the OS-level application data directory:

- **Windows**: `C:\Users\Username\AppData\Roaming\coderpro\coderpro_data.json`
- **macOS**: `~/Library/Application Support/coderpro/coderpro_data.json`
- **Linux**: `~/.config/coderpro/coderpro_data.json`

Data file format is JSON, containing:
- URL records
- Text snippets
- Task lists

---

## 🔧 Development Guide

### Local Development

```bash
# Install dependencies
npm install

# Start development server (Vite + Electron)
npm run electron:dev
```

### Available Scripts

```bash
# Development mode
npm run dev          # Start Vite only
npm run electron:dev # Start Vite + Electron

# Build
npm run build        # Build frontend assets
npm run electron:build # Build Electron application

# Preview
npm run preview      # Preview build results
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Changelog

### v1.0.0 (2026-03-28)
- ✨ Initial release
- 🎨 Implemented main floating window and task floating window
- 📝 Added URL manager, text snippets, and task management
- 💾 Local JSON data storage
- 🚀 Python launcher support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Electron](https://www.electronjs.org/) - Cross-platform desktop app framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons library

---

## 📧 Contact

- **Project URL**: https://github.com/ZHUKEAHYEW/CoderPro
- **Issues**: https://github.com/ZHUKEAHYEW/CoderPro/issues

---

<div align="center">

**If you find this useful, please give it a ⭐ Star!**

Made with ❤️ by CoderPro Team

</div>
