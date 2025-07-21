import React, { useEffect, useState } from 'react';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { useParams } from 'umi';
import { Descriptions, Card, Tabs, Spin, Empty, Tag, Space, Button, Modal, Form, Input, message } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { getProject, updateProject } from '@/services/project';
import type { ProColumns } from '@ant-design/pro-components';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<API.Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getProject(id);
      if (response.success) {
        setProject(response.data);
      }
    } catch (error) {
      console.error('获取项目详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
      });
      setEditModalVisible(true);
    }
  };

  const handleUpdate = async (values: any) => {
    if (!id) return;
    
    try {
      const response = await updateProject(id, values);
      if (response.success) {
        message.success('项目更新成功');
        setEditModalVisible(false);
        fetchProjectDetail();
      }
    } catch (error) {
      message.error('项目更新失败');
    }
  };

  const taskColumns: ProColumns<API.Task>[] = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          todo: { color: 'default', text: '待办' },
          in_progress: { color: 'processing', text: '进行中' },
          testing: { color: 'warning', text: '测试中' },
          done: { color: 'success', text: '已完成' },
        };
        const config = statusMap[status] || statusMap.todo;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      valueType: 'date',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
  ];

  const docColumns: ProColumns<API.Documentation>[] = [
    {
      title: '文档名称',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Space>
          <FileTextOutlined />
          <span>{record.title}</span>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <a>查看</a>
          <a>编辑</a>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <PageContainer title="项目详情">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer title="项目详情">
        <Empty description="项目不存在" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={project.name}
      onBack={() => window.history.back()}
      extra={[
        <Button key="edit" type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          编辑项目
        </Button>
      ]}
    >
      <ProCard>
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
          <Descriptions.Item label="项目ID">{project.id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(project.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{new Date(project.updatedAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="项目描述" span={2}>
            {project.description || '暂无描述'}
          </Descriptions.Item>
        </Descriptions>
      </ProCard>

      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                任务列表 ({project.tasks?.length || 0})
              </span>
            } 
            key="1"
          >
            {project.tasks && project.tasks.length > 0 ? (
              <ProTable<API.Task>
                columns={taskColumns}
                dataSource={project.tasks}
                rowKey="id"
                search={false}
                pagination={false}
                toolBarRender={false}
              />
            ) : (
              <Empty description="暂无任务" />
            )}
          </Tabs.TabPane>
          
          <Tabs.TabPane 
            tab={
              <span>
                <FileTextOutlined />
                项目文档 ({project.documentation?.length || 0})
              </span>
            } 
            key="2"
          >
            {project.documentation && project.documentation.length > 0 ? (
              <ProTable<API.Documentation>
                columns={docColumns}
                dataSource={project.documentation}
                rowKey="id"
                search={false}
                pagination={false}
                toolBarRender={false}
              />
            ) : (
              <Empty description="暂无文档" />
            )}
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                Sprint ({project.Sprint?.length || 0})
              </span>
            } 
            key="3"
          >
            {project.Sprint && project.Sprint.length > 0 ? (
              <ProTable<API.Sprint>
                columns={[
                  { title: '名称', dataIndex: 'name', key: 'name' },
                  { title: '目标', dataIndex: 'goal', key: 'goal' },
                  { title: '状态', dataIndex: 'status', key: 'status' },
                  { title: '开始日期', dataIndex: 'startDate', key: 'startDate', valueType: 'date' },
                  { title: '结束日期', dataIndex: 'endDate', key: 'endDate', valueType: 'date' },
                ]}
                dataSource={project.Sprint}
                rowKey="id"
                search={false}
                pagination={false}
                toolBarRender={false}
              />
            ) : (
              <Empty description="暂无Sprint" />
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="编辑项目"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            label="项目描述"
            name="description"
          >
            <Input.TextArea rows={4} placeholder="请输入项目描述" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProjectDetail;