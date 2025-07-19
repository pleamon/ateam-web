import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Select, message, Card, Tag, Tabs, List } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, ApartmentOutlined, CloudOutlined, MobileOutlined, DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { architectureAPI, projectAPI } from '@/services/api';

const { confirm } = Modal;
const { TextArea } = Input;

const SystemArchitecture: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentArchitecture, setCurrentArchitecture] = useState<any>(null);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();

  const getPlatformIcon = (platform: string) => {
    const iconMap = {
      web: <GlobalOutlined />,
      mobile: <MobileOutlined />,
      desktop: <DesktopOutlined />,
      cloud: <CloudOutlined />,
    };
    return iconMap[platform] || <ApartmentOutlined />;
  };

  const columns: ProColumns<any>[] = [
    {
      title: '项目',
      dataIndex: ['project', 'name'],
      key: 'projectName',
      render: (text, record) => (
        <a onClick={() => handleView(record)}>
          <ApartmentOutlined /> {text}
        </a>
      ),
    },
    {
      title: '支持平台',
      dataIndex: 'platforms',
      key: 'platforms',
      render: (platforms: string[]) => (
        <Space>
          {platforms?.map((platform) => (
            <Tag key={platform} icon={getPlatformIcon(platform)}>
              {platform}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '技术栈',
      dataIndex: 'technologies',
      key: 'technologies',
      render: (technologies: string[]) => (
        <Space wrap>
          {technologies?.slice(0, 3).map((tech) => (
            <Tag key={tech} color="blue">{tech}</Tag>
          ))}
          {technologies?.length > 3 && <Tag>+{technologies.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: '组件数量',
      key: 'componentsCount',
      render: (_, record) => record.components?.length || 0,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleView = (record: any) => {
    setCurrentArchitecture(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: any) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个系统架构吗？',
      icon: <ExclamationCircleOutlined />,
      content: `项目：${record.project?.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await architectureAPI.delete(record.id);
          message.success('删除成功');
          tableRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCreate = async (values: any) => {
    try {
      const data = {
        ...values,
        platforms: values.platforms,
        technologies: values.technologies ? values.technologies.split('\n').filter(Boolean) : [],
        components: values.components ? values.components.split('\n').filter(Boolean) : [],
      };
      await architectureAPI.create(data);
      message.success('创建成功');
      setCreateModalVisible(false);
      form.resetFields();
      tableRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.list();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('获取项目列表失败:', error);
    }
  };

  return (
    <PageContainer>
      <ProTable<any>
        headerTitle="系统架构"
        actionRef={tableRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              fetchProjects();
              setCreateModalVisible(true);
            }}
          >
            新建架构文档
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const response = await architectureAPI.list(params);
            return {
              data: response.data || [],
              success: response.success,
              total: response.data?.length || 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
      />

      <Modal
        title="新建系统架构"
        open={createModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="projectId"
            label="所属项目"
            rules={[{ required: true, message: '请选择所属项目' }]}
          >
            <Select placeholder="请选择所属项目">
              {projects.map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="overview"
            label="架构总览"
            rules={[{ required: true, message: '请输入架构总览' }]}
          >
            <TextArea rows={4} placeholder="请描述系统的整体架构" />
          </Form.Item>
          <Form.Item
            name="platforms"
            label="支持平台"
            rules={[{ required: true, message: '请选择支持平台' }]}
          >
            <Select mode="multiple" placeholder="请选择支持的平台">
              <Select.Option value="web">Web</Select.Option>
              <Select.Option value="mobile">Mobile</Select.Option>
              <Select.Option value="desktop">Desktop</Select.Option>
              <Select.Option value="cloud">Cloud</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="technologies"
            label="技术栈"
            extra="每行一个技术"
          >
            <TextArea rows={4} placeholder="例如：React、Node.js、PostgreSQL等，每行一个" />
          </Form.Item>
          <Form.Item
            name="components"
            label="主要组件"
            extra="每行一个组件"
          >
            <TextArea rows={4} placeholder="例如：用户服务、订单服务、支付网关等，每行一个" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="备注"
          >
            <TextArea rows={3} placeholder="其他需要说明的内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="系统架构详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={900}
      >
        {currentArchitecture && (
          <div>
            <h3><ApartmentOutlined /> {currentArchitecture.project?.name} - 系统架构</h3>
            
            <Card title="架构总览" size="small" style={{ marginTop: 16 }}>
              <p>{currentArchitecture.overview}</p>
            </Card>

            <Card title="支持平台" size="small" style={{ marginTop: 16 }}>
              <Space>
                {currentArchitecture.platforms?.map((platform: string) => (
                  <Tag key={platform} icon={getPlatformIcon(platform)} color="blue">
                    {platform}
                  </Tag>
                ))}
              </Space>
            </Card>

            <Tabs defaultActiveKey="tech" style={{ marginTop: 16 }}>
              <Tabs.TabPane tab="技术栈" key="tech">
                <Space wrap>
                  {currentArchitecture.technologies?.map((tech: string) => (
                    <Tag key={tech} color="green">{tech}</Tag>
                  ))}
                </Space>
              </Tabs.TabPane>
              <Tabs.TabPane tab="主要组件" key="components">
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={currentArchitecture.components}
                  renderItem={(component: string) => (
                    <List.Item>
                      <Card size="small">
                        <ApartmentOutlined /> {component}
                      </Card>
                    </List.Item>
                  )}
                />
              </Tabs.TabPane>
              {currentArchitecture.notes && (
                <Tabs.TabPane tab="备注" key="notes">
                  <p>{currentArchitecture.notes}</p>
                </Tabs.TabPane>
              )}
            </Tabs>

            <p style={{ marginTop: 16, color: '#999' }}>
              更新时间：{new Date(currentArchitecture.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default SystemArchitecture;