import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Select, message, Card, Tag, List } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, BookOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { domainAPI } from '@/services/domain';
import { projectAPI } from '@/services/project';

const { confirm } = Modal;
const { TextArea } = Input;

const DomainKnowledge: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<any>(null);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();

  const columns: ProColumns<any>[] = [
    {
      title: '领域',
      dataIndex: 'domain',
      key: 'domain',
      render: (text, record) => (
        <a onClick={() => handleView(record)}>
          <BookOutlined /> {text}
        </a>
      ),
    },
    {
      title: '所属项目',
      dataIndex: ['project', 'name'],
      key: 'projectName',
    },
    {
      title: '概念数量',
      key: 'conceptsCount',
      render: (_, record) => record.concepts?.length || 0,
    },
    {
      title: '常见模式',
      key: 'patternsCount',
      render: (_, record) => record.commonPatterns?.length || 0,
    },
    {
      title: '最佳实践',
      key: 'bestPracticesCount',
      render: (_, record) => record.bestPractices?.length || 0,
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
    setCurrentDomain(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: any) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个领域知识吗？',
      icon: <ExclamationCircleOutlined />,
      content: `领域：${record.domain}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await domainAPI.delete(record.id);
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
        concepts: values.concepts ? values.concepts.split('\n').filter(Boolean) : [],
        commonPatterns: values.commonPatterns ? values.commonPatterns.split('\n').filter(Boolean) : [],
        bestPractices: values.bestPractices ? values.bestPractices.split('\n').filter(Boolean) : [],
        antiPatterns: values.antiPatterns ? values.antiPatterns.split('\n').filter(Boolean) : [],
      };
      await domainAPI.create(data);
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
        headerTitle="领域知识"
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
            新建领域知识
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const response = await domainAPI.list(params);
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
        title="新建领域知识"
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
            name="domain"
            label="领域名称"
            rules={[{ required: true, message: '请输入领域名称' }]}
          >
            <Input placeholder="例如：电商、金融、教育等" />
          </Form.Item>
          <Form.Item
            name="concepts"
            label="核心概念"
            extra="每行一个概念"
          >
            <TextArea rows={4} placeholder="请输入核心概念，每行一个" />
          </Form.Item>
          <Form.Item
            name="commonPatterns"
            label="常见模式"
            extra="每行一个模式"
          >
            <TextArea rows={4} placeholder="请输入常见模式，每行一个" />
          </Form.Item>
          <Form.Item
            name="bestPractices"
            label="最佳实践"
            extra="每行一个实践"
          >
            <TextArea rows={4} placeholder="请输入最佳实践，每行一个" />
          </Form.Item>
          <Form.Item
            name="antiPatterns"
            label="反模式"
            extra="每行一个反模式"
          >
            <TextArea rows={4} placeholder="请输入需要避免的反模式，每行一个" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="领域知识详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentDomain && (
          <div>
            <h3><BookOutlined /> {currentDomain.domain}</h3>
            <p><strong>所属项目：</strong>{currentDomain.project?.name}</p>
            
            <Card title="核心概念" size="small" style={{ marginTop: 16 }}>
              <Space wrap>
                {currentDomain.concepts?.map((concept: string, index: number) => (
                  <Tag key={index} color="blue">{concept}</Tag>
                ))}
              </Space>
            </Card>

            <Card title="常见模式" size="small" style={{ marginTop: 16 }}>
              <List
                size="small"
                dataSource={currentDomain.commonPatterns}
                renderItem={(item: string) => (
                  <List.Item>• {item}</List.Item>
                )}
              />
            </Card>

            <Card title="最佳实践" size="small" style={{ marginTop: 16 }}>
              <List
                size="small"
                dataSource={currentDomain.bestPractices}
                renderItem={(item: string) => (
                  <List.Item>
                    <Tag color="green">✓</Tag> {item}
                  </List.Item>
                )}
              />
            </Card>

            {currentDomain.antiPatterns && currentDomain.antiPatterns.length > 0 && (
              <Card title="反模式（需要避免）" size="small" style={{ marginTop: 16 }}>
                <List
                  size="small"
                  dataSource={currentDomain.antiPatterns}
                  renderItem={(item: string) => (
                    <List.Item>
                      <Tag color="red">✗</Tag> {item}
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default DomainKnowledge;