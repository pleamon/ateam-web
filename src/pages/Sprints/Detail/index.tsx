import React, { useEffect, useState } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, Tag, Button, Space, Progress, Row, Col, List, Avatar, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined, PauseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { history, useParams } from 'umi';
import { sprintAPI, taskAPI } from '@/services/api';
import moment from 'moment';

const SprintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sprint, setSprint] = useState<API.Sprint | null>(null);
  const [tasks, setTasks] = useState<API.Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSprintDetail();
      fetchSprintTasks();
    }
  }, [id]);

  const fetchSprintDetail = async () => {
    try {
      setLoading(true);
      const response = await sprintAPI.get(id!);
      if (response.success && response.data) {
        setSprint(response.data);
      }
    } catch (error) {
      message.error('获取Sprint详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchSprintTasks = async () => {
    try {
      const response = await taskAPI.list({ sprintId: id });
      if (response.success && response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      message.error('获取任务列表失败');
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'processing', text: '进行中', icon: <ThunderboltOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      planned: { color: 'default', text: '计划中', icon: <PauseOutlined /> },
    };
    const config = statusConfig[status] || statusConfig.planned;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getTaskStatusTag = (status: string) => {
    const statusMap = {
      todo: { color: 'default', text: '待开始' },
      in_progress: { color: 'processing', text: '进行中' },
      testing: { color: 'warning', text: '测试中' },
      done: { color: 'success', text: '已完成' },
    };
    const config = statusMap[status] || statusMap.todo;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const calculateProgress = () => {
    if (!tasks.length) return 0;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <PageContainer
      title={sprint?.name || 'Sprint详情'}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => history.push('/sprints/list')}>
          返回列表
        </Button>,
        <Button key="edit" icon={<EditOutlined />}>
          编辑
        </Button>,
        <Button key="delete" danger icon={<DeleteOutlined />}>
          删除
        </Button>,
      ]}
    >
      <Card loading={loading}>
        <ProDescriptions column={2}>
          <ProDescriptions.Item label="Sprint名称">{sprint?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="状态">{sprint && getStatusTag(sprint.status)}</ProDescriptions.Item>
          <ProDescriptions.Item label="开始时间">
            {sprint?.startDate && moment(sprint.startDate).format('YYYY-MM-DD')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="结束时间">
            {sprint?.endDate && moment(sprint.endDate).format('YYYY-MM-DD')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="所属项目">{sprint?.project?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="创建时间">
            {sprint?.createdAt && moment(sprint.createdAt).format('YYYY-MM-DD HH:mm')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Sprint目标" span={2}>
            {sprint?.goal || '暂无目标描述'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Card>

      <Card title="Sprint进度" style={{ marginTop: 16 }}>
        <Progress percent={calculateProgress()} status="active" />
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Card size="small">
              <p>待开始</p>
              <h3>{getTasksByStatus('todo').length}</h3>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <p>进行中</p>
              <h3>{getTasksByStatus('in_progress').length}</h3>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <p>测试中</p>
              <h3>{getTasksByStatus('testing').length}</h3>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <p>已完成</p>
              <h3>{getTasksByStatus('done').length}</h3>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="任务列表" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          renderItem={task => (
            <List.Item
              actions={[
                getTaskStatusTag(task.status),
                <a key="view" onClick={() => message.info('查看任务详情')}>查看</a>
              ]}
            >
              <List.Item.Meta
                title={task.title}
                description={task.content}
              />
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default SprintDetail;