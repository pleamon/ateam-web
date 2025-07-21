import { defineConfig } from '@umijs/max';

export default defineConfig({
  model: {},
  request: {},
  initialState: {},
  title: 'ATeam - 智能项目管理',
  routes: [
    {
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      path: '/',
      wrappers: ['@/wrappers/auth'],
      redirect: '/dashboard',
    },
    {
      name: '仪表盘',
      path: '/dashboard',
      component: './Dashboard',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: '项目列表',
      path: '/projects/list',
      component: './Projects/List',
    },
    {
      name: '项目详情',
      path: '/projects/:id',
      component: './Projects/Detail',
    },
    {
      name: '团队列表',
      path: '/teams/list',
      component: './Teams/List',
    },
    {
      name: '团队详情',
      path: '/teams/:id',
      component: './Teams/Detail',
    },
    {
      name: '提示词模板',
      path: '/teams/prompt-templates',
      component: './Teams/PromptTemplates',
    },
    {
      name: 'Sprint列表',
      path: '/sprints/list',
      component: './Sprints/List',
    },
    {
      name: 'Sprint详情',
      path: '/sprints/:id',
      component: './Sprints/Detail',
    },
    {
      name: 'Scrum看板',
      path: '/scrum',
      component: './Scrum',
    },
    {
      name: '路线图列表',
      path: '/roadmap/list',
      component: './Roadmap/List',
    },
    {
      name: '路线图详情',
      path: '/roadmap/:id',
      component: './Roadmap/Detail',
    },
    {
      name: '里程碑管理',
      path: '/roadmap/milestones',
      component: './Roadmap/Milestones',
    },
    {
      name: '版本管理',
      path: '/roadmap/versions',
      component: './Roadmap/Versions',
    },
    {
      name: '文档概览',
      path: '/docs/overview',
      component: './Documents/Overview',
    },
    {
      name: '项目文档',
      path: '/docs/documentation',
      component: './Documents/Documentation',
    },
    {
      name: '需求管理',
      path: '/docs/requirements',
      component: './Documents/Requirements',
    },
    {
      name: '需求问答',
      path: '/docs/questions',
      component: './Documents/Questions',
    },
    {
      name: '领域知识',
      path: '/docs/domain',
      component: './Documents/Domain',
    },
    {
      name: '系统架构',
      path: '/docs/architecture',
      component: './Documents/Architecture',
    },
  ],
  npmClient: 'pnpm',
  // 配置代理
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
});