import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Select, Dropdown, Avatar, Space } from 'antd';
import { Link, Outlet, useLocation, useModel } from 'umi';
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  DragOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  RocketOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { getProjects, type Project } from '@/services/project';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">仪表盘</Link>,
  },
  {
    key: '/projects',
    icon: <ProjectOutlined />,
    label: '项目管理',
    children: [
      {
        key: '/projects/list',
        label: <Link to="/projects/list">项目列表</Link>,
      },
    ],
  },
  {
    key: '/teams',
    icon: <TeamOutlined />,
    label: '团队管理',
    children: [
      {
        key: '/teams/list',
        label: <Link to="/teams/list">团队列表</Link>,
      },
      {
        key: '/teams/prompt-templates',
        label: <Link to="/teams/prompt-templates">提示词模板</Link>,
      },
    ],
  },
  {
    key: '/sprints',
    icon: <DragOutlined />,
    label: 'Sprint管理',
    children: [
      {
        key: '/sprints/list',
        label: <Link to="/sprints/list">Sprint列表</Link>,
      },
    ],
  },
  {
    key: '/scrum',
    icon: <DragOutlined />,
    label: <Link to="/scrum">Scrum看板</Link>,
  },
  {
    key: '/roadmap',
    icon: <RocketOutlined />,
    label: '产品路线图',
    children: [
      {
        key: '/roadmap/list',
        label: <Link to="/roadmap/list">路线图列表</Link>,
      },
      {
        key: '/roadmap/milestones',
        label: <Link to="/roadmap/milestones">里程碑管理</Link>,
      },
      {
        key: '/roadmap/versions',
        label: <Link to="/roadmap/versions">版本管理</Link>,
      },
    ],
  },
  {
    key: '/docs',
    icon: <FileTextOutlined />,
    label: '文档中心',
    children: [
      {
        key: '/docs/overview',
        label: <Link to="/docs/overview">文档概览</Link>,
      },
      {
        key: '/docs/documentation',
        label: <Link to="/docs/documentation">项目文档</Link>,
      },
      {
        key: '/docs/requirements',
        label: <Link to="/docs/requirements">需求管理</Link>,
      },
      {
        key: '/docs/questions',
        label: <Link to="/docs/questions">需求问答</Link>,
      },
      {
        key: '/docs/domain',
        label: <Link to="/docs/domain">领域知识</Link>,
      },
      {
        key: '/docs/architecture',
        label: <Link to="/docs/architecture">系统架构</Link>,
      },
    ],
  },
];
const BasicLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { currentProject, setCurrentProject, currentProjectId } = useModel('useProjectModel');
  const { currentUser, logoutUser } = useModel('user');
  
  // 计算当前路径应该展开的菜单项
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/projects')) return ['/projects'];
    if (path.startsWith('/teams')) return ['/teams'];
    if (path.startsWith('/sprints')) return ['/sprints'];
    if (path.startsWith('/roadmap')) return ['/roadmap'];
    if (path.startsWith('/docs')) return ['/docs'];
    return [];
  };

  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys());

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setOpenKeys(getOpenKeys());
  }, [location.pathname]);

  useEffect(() => {
    // 从 localStorage 恢复上次选中的项目
    const savedProjectId = localStorage.getItem('currentProjectId');
    if (savedProjectId && projects.length > 0 && !currentProject) {
      const savedProject = projects.find(p => p.id === savedProjectId);
      if (savedProject) {
        setCurrentProject(savedProject);
      }
    }
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      if (response.success && response.data) {
        setProjects(response.data.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setCurrentProject(project || null);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logoutUser,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#001529' }} trigger={null} collapsible collapsed={collapsed}>
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: 18 }}>ATeam</h2>
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          <Select
            style={{ width: '100%' }}
            placeholder="选择项目"
            value={currentProjectId}
            onChange={handleProjectChange}
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {projects.map(project => (
              <Select.Option key={project.id} value={project.id}>
                {project.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={onOpenChange}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {currentProject && (
            <div style={{ flex: 1, paddingLeft: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
                <ProjectOutlined style={{ marginRight: 8 }} />
                {currentProject.name}
              </h3>
            </div>
          )}
          <div style={{ marginRight: 24 }}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{currentUser?.name || currentUser?.username || '用户'}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet key={currentProjectId} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;