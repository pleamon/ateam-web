import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { history } from 'umi';
import { documentAPI } from '@/services/document';
import { projectAPI } from '@/services/project';

const { confirm } = Modal;
const { TextArea } = Input;

const Documentation: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();

  const getDocTypeTag = (type: string) => {
    const typeMap = {
      overview: { color: 'blue', text: '概览', icon: <FileTextOutlined /> },
      technical: { color: 'green', text: '技术' },
      design: { color: 'orange', text: '设计' },
      research: { color: 'purple', text: '研究' },
      other: { color: 'default', text: '其他' },
    };
    const config = typeMap[type] || typeMap.other;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns: ProColumns<API.Documentation>[] = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => handleView(record)}>
          {record.name}
        </a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getDocTypeTag(type),
      filters: [
        { text: '概览', value: 'overview' },
        { text: '技术', value: 'technical' },
        { text: '设计', value: 'design' },
        { text: '研究', value: 'research' },
        { text: '其他', value: 'other' },
      ],
    },
    {
      title: '所属项目',
      dataIndex: ['project', 'name'],
      key: 'projectName',
    },
    {
      title: '所属团队',
      dataIndex: ['team', 'name'],
      key: 'teamName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
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

  const handleView = (record: API.Documentation) => {
    Modal.info({
      title: record.name,
      content: (
        <div>
          <p><strong>类型：</strong>{getDocTypeTag(record.type)}</p>
          <p><strong>内容：</strong></p>
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{record.content}</pre>
          </div>
          {record.url && (
            <p>
              <strong>链接：</strong>
              <a href={record.url} target="_blank" rel="noopener noreferrer">
                {record.url}
              </a>
            </p>
          )}
        </div>
      ),
      width: 800,
    });
  };

  const handleEdit = (record: API.Documentation) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: API.Documentation) => {
    confirm({
      title: '确定删除这个文档吗？',
      icon: <ExclamationCircleOutlined />,
      content: `文档名称：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await documentAPI.delete(record.id);
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
      await documentAPI.create(values);
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
      <ProTable<API.Documentation>
        headerTitle="项目文档"
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
            新建文档
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const response = await documentAPI.list(params);
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
        title="新建文档"
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
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="文档名称"
            rules={[{ required: true, message: '请输入文档名称' }]}
          >
            <Input placeholder="请输入文档名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="文档类型"
            rules={[{ required: true, message: '请选择文档类型' }]}
            initialValue="overview"
          >
            <Select>
              <Select.Option value="overview">概览</Select.Option>
              <Select.Option value="technical">技术</Select.Option>
              <Select.Option value="design">设计</Select.Option>
              <Select.Option value="research">研究</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
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
            name="content"
            label="文档内容"
            rules={[{ required: true, message: '请输入文档内容' }]}
          >
            <TextArea rows={8} placeholder="请输入文档内容" />
          </Form.Item>
          <Form.Item
            name="url"
            label="相关链接"
          >
            <Input placeholder="请输入相关链接（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Documentation;