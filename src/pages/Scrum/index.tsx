import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Tag, Avatar, Space, Spin, Button, Modal, Form, Input, Select, DatePicker, message, Empty } from 'antd';
import { UserOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { taskAPI, projectAPI, teamAPI } from '@/services/api';
import { useModel } from 'umi';
import './index.css';

interface Column {
  id: string;
  title: string;
  status: string;
}

const ScrumBoard: React.FC = () => {
  const [tasks, setTasks] = useState<API.Task[]>([]);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [teams, setTeams] = useState<API.Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('todo');
  const [form] = Form.useForm();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const { currentProjectId } = useModel('useProjectModel');

  const columns: Column[] = [
    { id: 'todo', title: '待办', status: 'todo' },
    { id: 'in_progress', title: '进行中', status: 'in_progress' },
    { id: 'testing', title: '测试中', status: 'testing' },
    { id: 'done', title: '已完成', status: 'done' },
  ];

  const priorityColorMap = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  };

  const priorityTextMap = {
    low: '低',
    medium: '中',
    high: '高',
  };

  useEffect(() => {
    fetchData();
  }, [currentProjectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes, teamsRes] = await Promise.all([
        taskAPI.list(currentProjectId ? { projectId: currentProjectId } : {}),
        projectAPI.list(),
        teamAPI.list(currentProjectId ? { projectId: currentProjectId } : {}),
      ]);

      setTasks(tasksRes.data || []);
      setProjects(projectsRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };
  const fetchTasks = async () => {
    const res = await taskAPI.list(currentProjectId ? { projectId: currentProjectId } : {});
    setTasks(res.data || []);
  };

  const handleCreateTask = async (values: any) => {
    try {
      await taskAPI.create({
        ...values,
        dueDate: values.dueDate?.toISOString(),
        status: selectedStatus,
      });
      message.success('创建任务成功');
      setCreateModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('创建任务失败');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      message.success('更新状态成功');
      // fetchData();
      fetchTasks();
    } catch (error) {
      message.error('更新状态失败');
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // 检查是否真的离开了列
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setDragOverColumn(null);
    if (taskId) {
      handleStatusChange(taskId, status);
    }
  };

  const renderTask = (task: API.Task) => {
    const priority = task.content?.includes('高优先级') ? 'high' :
      task.content?.includes('低优先级') ? 'low' : 'medium';

    return (
      <Card
        key={task.id}
        className={`task-card ${draggedTaskId === task.id ? 'dragging' : ''}`}
        size="small"
        style={{ marginBottom: 8 }}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
      >
        <div style={{ marginBottom: 8 }}>
          <strong>{task.title}</strong>
        </div>
        {task.content && (
          <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            {task.content}
          </p>
        )}
        <Space size="small" style={{ fontSize: 12 }}>
          <Tag color={priorityColorMap[priority]}>{priorityTextMap[priority]}</Tag>
          {task.team && (
            <span>
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ marginLeft: 4 }}>{task.team.name}</span>
            </span>
          )}
          {task.dueDate && (
            <span>
              <ClockCircleOutlined />
              <span style={{ marginLeft: 4 }}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </span>
          )}
        </Space>
      </Card>
    );
  };

  if (!currentProjectId) {
    return (
      <PageContainer title="Scrum看板">
        <Empty 
          description="请先选择一个项目" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title="Scrum看板">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Scrum看板"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          新建任务
        </Button>
      }
    >
      <Row gutter={16}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status);

          return (
            <Col key={column.id} span={6}>
              <Card
                title={`${column.title} (${columnTasks.length})`}
                className={`column-card ${dragOverColumn === column.id ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className="task-list">
                  {columnTasks.map((task) => renderTask(task))}
                </div>
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedStatus(column.status);
                    setCreateModalVisible(true);
                  }}
                >
                  添加任务
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title="新建任务"
        open={createModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTask}
        >
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="任务描述"
          >
            <Input.TextArea rows={4} placeholder="请输入任务描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="projectId"
                label="所属项目"
                rules={[{ required: true, message: '请选择项目' }]}
                initialValue={currentProjectId}
              >
                <Select placeholder="请选择项目">
                  {projects.map((project) => (
                    <Select.Option key={project.id} value={project.id}>
                      {project.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teamId"
                label="负责团队"
                rules={[{ required: true, message: '请选择团队' }]}
              >
                <Select placeholder="请选择团队">
                  {teams.map((team) => (
                    <Select.Option key={team.id} value={team.id}>
                      {team.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="dueDate"
            label="截止日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ScrumBoard;