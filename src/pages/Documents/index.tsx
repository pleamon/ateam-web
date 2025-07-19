import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { documentAPI } from '@/services/api';

const { confirm } = Modal;
const { TextArea } = Input;

const Documents: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();

  const documentTypes = [
    { label: '概览', value: 'overview' },
    { label: '技术文档', value: 'technical' },
    { label: '设计文档', value: 'design' },
    { label: '研究文档', value: 'research' },
    { label: '其他', value: 'other' },
  ];

  const columns: ProColumns<API.Documentation>[] = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <FileTextOutlined />
          <a>{record.name}</a>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          overview: { color: 'blue', text: '概览' },
          technical: { color: 'green', text: '技术文档' },
          design: { color: 'purple', text: '设计文档' },
          research: { color: 'orange', text: '研究文档' },
          other: { color: 'default', text: '其他' },
        };
        const config = typeMap[type] || typeMap.other;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '所属项目',
      dataIndex: 'project',
      key: 'project',
      render: (project: API.Project) => project?.name || '未关联项目',
    },
    {
      title: '团队',
      dataIndex: 'team',
      key: 'team',
      render: (team: API.Team) => team?.name || '未关联团队',
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => url ? <a href={url} target="_blank" rel="noopener noreferrer">查看</a> : '-',
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
          <p><strong>类型:</strong> {record.type}</p>
          <p><strong>内容:</strong></p>
          <div style={{ whiteSpace: 'pre-wrap' }}>{record.content}</div>
          {record.url && <p><strong>链接:</strong> <a href={record.url} target="_blank">{record.url}</a></p>}
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

  return (
    <PageContainer>
      <ProTable<API.Documentation>
        headerTitle="文档列表"
        actionRef={tableRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
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
          >
            <Select options={documentTypes} placeholder="请选择文档类型" />
          </Form.Item>
          <Form.Item
            name="content"
            label="文档内容"
            rules={[{ required: true, message: '请输入文档内容' }]}
          >
            <TextArea rows={6} placeholder="请输入文档内容" />
          </Form.Item>
          <Form.Item
            name="url"
            label="外部链接"
          >
            <Input placeholder="请输入外部链接（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Documents;