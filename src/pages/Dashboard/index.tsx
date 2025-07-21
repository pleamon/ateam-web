import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin, Progress, List, Tag, Typography, Empty, Space } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  UserOutlined,
  FolderOutlined,
  FileDoneOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { getDashboardStats, getProjectDashboard } from '@/services/dashboard';
import { Pie, Column } from '@ant-design/plots';
import { history, useModel } from 'umi';

const { Title, Text } = Typography;

interface DashboardData {
  overview: {
    projectCount: number;
    teamCount: number;
    memberCount: number;
    totalTasks: number;
    totalSprints: number;
    totalDocs: number;
  };
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    testing: number;
    done: number;
    completionRate: number;
  };
  sprintStats: {
    total: number;
    active: number;
    completed: number;
  };
  docStats: {
    total: number;
    overview: number;
    technical: number;
    design: number;
  };
  recent: {
    projects: any[];
    tasks: any[];
    activeSprints: any[];
  };
  charts: {
    taskStatusDistribution: Array<{ status: string; count: number; color: string }>;
    docTypeDistribution: Array<{ type: string; count: number; color: string }>;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentProjectId } = useModel('useProjectModel');

  useEffect(() => {
    fetchDashboardData();
  }, [currentProjectId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let response;
      if (currentProjectId) {
        // 如果选中了项目，获取项目特定的仪表盘数据
        response = await getProjectDashboard(currentProjectId);
      } else {
        // 否则获取整体仪表盘数据
        response = await getDashboardStats();
      }
      if (response && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <Empty description="暂无数据" />;
  }

  // 任务状态饼图配置
  const taskPieConfig = {
    appendPadding: 10,
    data: data.charts?.taskStatusDistribution || [],
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
    color: ({ status }: any) => {
      const statusColors: any = {
        '待办': '#1890ff',
        '进行中': '#faad14',
        '测试中': '#722ed1',
        '已完成': '#52c41a',
      };
      return statusColors[status];
    },
  };

  // 文档类型柱状图配置
  const docColumnConfig = {
    data: data.charts?.docTypeDistribution || [],
    xField: 'type',
    yField: 'count',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '文档类型',
      },
      count: {
        alias: '数量',
      },
    },
    color: ({ type }: any) => {
      const typeColors: any = {
        '概览文档': '#1890ff',
        '技术文档': '#13c2c2',
        '设计文档': '#eb2f96',
      };
      return typeColors[type];
    },
  };

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <Title level={2}>仪表盘</Title>

      {/* 概览统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="项目总数"
              value={data.overview.projectCount}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="团队数量"
              value={data.overview.teamCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="团队成员"
              value={data.overview.memberCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="任务总数"
              value={data.overview.totalTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Sprint数量"
              value={data.overview.totalSprints}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="文档数量"
              value={data.overview.totalDocs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 任务完成率和Sprint状态 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12} lg={8}>
          <Card title="任务完成进度">
            <Progress
              type="dashboard"
              percent={data.taskStats.completionRate}
              format={(percent) => `${percent}%`}
            />
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Statistic
                  title="已完成"
                  value={data.taskStats.done}
                  valueStyle={{ color: '#52c41a', fontSize: 20 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="进行中"
                  value={data.taskStats.inProgress + data.taskStats.testing}
                  valueStyle={{ color: '#faad14', fontSize: 20 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Sprint 状态">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" style={{ backgroundColor: '#e6f7ff' }}>
                  <Statistic
                    title="活跃 Sprint"
                    value={data.sprintStats.active}
                    prefix={<ThunderboltOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                  <Statistic
                    title="已完成 Sprint"
                    value={data.sprintStats.completed}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Sprint 完成率</Text>
              <Progress
                percent={Math.round((data.sprintStats.completed / data.sprintStats.total) * 100)}
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="文档分布">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic
                  title="概览"
                  value={data.docStats.overview}
                  prefix={<FolderOutlined />}
                  valueStyle={{ fontSize: 20 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="技术"
                  value={data.docStats.technical}
                  prefix={<FileDoneOutlined />}
                  valueStyle={{ fontSize: 20 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="设计"
                  value={data.docStats.design}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ fontSize: 20 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="任务状态分布" style={{ height: 400 }}>
            <Pie {...taskPieConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="文档类型分布" style={{ height: 400 }}>
            <Column {...docColumnConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 最近动态 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card
            title="最近项目"
            extra={<a onClick={() => history.push('/projects/list')}>查看全部</a>}
            style={{ height: 400 }}
          >
            <List
              dataSource={data.recent.projects}
              renderItem={(project: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<ProjectOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                    title={
                      <a onClick={() => history.push(`/projects/${project.id}`)}>
                        {project.name}
                      </a>
                    }
                    description={
                      <Space size="small">
                        <Text type="secondary">任务: {project._count.tasks}</Text>
                        <Text type="secondary">文档: {project._count.documentation}</Text>
                        <Text type="secondary">Sprint: {project._count.Sprint}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="最近任务"
            extra={<a onClick={() => history.push('/scrum')}>查看全部</a>}
            style={{ height: 400 }}
          >
            <List
              dataSource={data.recent.tasks}
              renderItem={(task: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Text
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%'
                        }}
                        title={task.title}
                      >
                        {task.title}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Space size="small" wrap>
                          <Tag color={
                            task.status === 'done' ? 'green' :
                              task.status === 'in_progress' ? 'orange' :
                                task.status === 'testing' ? 'purple' : 'blue'
                          }>
                            {task.status === 'done' ? '已完成' :
                              task.status === 'in_progress' ? '进行中' :
                                task.status === 'testing' ? '测试中' : '待办'}
                          </Tag>
                          <Text type="secondary" ellipsis>{task.team?.name}</Text>
                        </Space>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 12,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={task.project?.name}
                        >
                          {task.project?.name}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="活跃 Sprint"
            style={{ height: 400 }}
          >
            {data.recent.activeSprints.length > 0 ? (
              <List
                dataSource={data.recent.activeSprints}
                renderItem={(sprint: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<RocketOutlined style={{ fontSize: 24, color: '#faad14' }} />}
                      title={sprint.name}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">{sprint.project?.name}</Text>
                          <Space size="small">
                            <ClockCircleOutlined />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {new Date(sprint.startDate).toLocaleDateString()} -
                              {new Date(sprint.endDate).toLocaleDateString()}
                            </Text>
                          </Space>
                          {sprint.goal && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              目标: {sprint.goal}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无活跃的 Sprint" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;