# ATeam Web 前端应用

ATeam 的 Web 前端应用，基于 React + TypeScript + Ant Design Pro 构建，提供直观易用的项目管理界面。

## 功能特性

### 📊 项目管理
- 项目的创建、编辑、删除
- 项目列表和详情查看
- 项目切换和状态管理

### 👥 团队管理
- AI Agent 团队成员配置
- 提示词模板管理
- 技能标签设置

### 📋 任务管理
- Scrum 看板界面
- 任务拖拽操作
- Sprint 周期管理
- 任务状态流转

### 📄 文档中心
- 项目文档管理
- 需求管理
- 领域知识库
- 系统架构文档

### 🗺️ 产品路线图
- 路线图规划
- 里程碑管理
- 版本发布管理

### 🎯 仪表盘
- 项目统计概览
- 任务完成进度
- 团队工作状态
- 实时数据展示

## 技术栈

- **框架**: React 18
- **语言**: TypeScript 5
- **UI 库**: Ant Design Pro 2.6
- **应用框架**: UmiJS 4
- **网络请求**: Axios
- **状态管理**: 内置 Model
- **样式**: Less + CSS Modules

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 环境配置

```bash
cp .env.example .env
# 编辑 .env 文件，配置 API 地址等
```

### 3. 启动开发服务器

```bash
npm start
# 或
pnpm dev
```

应用将在 http://localhost:8001 启动

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── pages/              # 页面组件
│   ├── Dashboard/      # 仪表盘
│   ├── Project/        # 项目管理
│   ├── Team/          # 团队管理
│   ├── Task/          # 任务管理
│   ├── Sprint/        # Sprint管理
│   ├── Documentation/ # 文档中心
│   └── Roadmap/       # 产品路线图
├── components/        # 公共组件
├── services/          # API 服务
├── models/           # 状态管理
├── utils/            # 工具函数
├── locales/          # 国际化
└── app.tsx           # 应用配置
```

## 开发命令

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 运行测试
npm test

# 分析构建包大小
npm run analyze
```

## 配置说明

主要配置文件：
- `config/config.ts` - UmiJS 配置
- `config/routes.ts` - 路由配置
- `.env` - 环境变量

详细配置请参考 [配置文档](../docs/getting-started/configuration.md)

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 贡献指南

请参考项目根目录的 [贡献指南](../docs/development/contributing.md)

## 许可证

MIT License
