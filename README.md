# ATeam Web - 智能项目管理系统前端

基于 React + TypeScript + Ant Design Pro 构建的智能项目管理系统前端应用。

## 功能特性

- 📊 项目管理 - 创建、编辑、查看项目信息
- 👥 团队管理 - 团队成员管理和权限控制
- 📋 Scrum看板 - 可视化任务管理
- 📄 文档管理 - 项目文档的创建和管理
- 🎯 仪表盘 - 项目和团队的统计概览

## 技术栈

- React 18
- TypeScript 5
- Ant Design Pro 2.6
- UmiJS 4
- Axios

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
src/
├── pages/          # 页面组件
│   ├── Dashboard/  # 仪表盘
│   ├── Projects/   # 项目管理
│   ├── Teams/      # 团队管理
│   ├── Scrum/      # Scrum看板
│   └── Documents/  # 文档管理
├── services/       # API服务
├── components/     # 公共组件
├── models/         # 数据模型
├── utils/          # 工具函数
└── app.tsx         # 应用入口配置
```

## 环境变量

- `API_BASE_URL` - 后端API地址，默认为 `http://localhost:3000/api`