import React, { useState, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, Select, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { promptTemplateAPI } from '@/services/api';

const { TextArea } = Input;
const { confirm } = Modal;

interface PromptTemplate {
  id: string;
  name: string;
  responsibility: string;
  prompt: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PromptTemplates: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [form] = Form.useForm();
  const tableRef = useRef<any>();

  const responsibilities = [
    '前端开发',
    '后端开发',
    '产品设计',
    '项目管理',
    'UI设计',
    '测试',
    '运维',
    '数据分析',
  ];

  const columns: ProColumns<PromptTemplate>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '对应职责',
      dataIndex: 'responsibility',
      key: 'responsibility',
      render: (text) => <Tag color="blue">{text}</Tag>,
      filters: responsibilities.map(r => ({ text: r, value: r })),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        <Tag color={active ? 'green' : 'default'}>
          {active ? '启用' : '停用'}
        </Tag>
      ),
      filters: [
        { text: '启用', value: true },
        { text: '停用', value: false },
      ],
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
          <a onClick={() => handleEdit(record)}>
            <EditOutlined /> 编辑
          </a>
          <a onClick={() => handleDelete(record)} style={{ color: 'red' }}>
            <DeleteOutlined /> 删除
          </a>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: PromptTemplate) => {
    setEditingTemplate(record);
    form.setFieldsValue(record);
    setCreateModalVisible(true);
  };

  const handleDelete = (record: PromptTemplate) => {
    confirm({
      title: '确定删除这个提示词模板吗？',
      icon: <ExclamationCircleOutlined />,
      content: `模板名称：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await promptTemplateAPI.delete(record.id);
          message.success('删除成功');
          tableRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTemplate) {
        await promptTemplateAPI.update(editingTemplate.id, values);
        message.success('更新成功');
      } else {
        await promptTemplateAPI.create(values);
        message.success('创建成功');
      }
      setCreateModalVisible(false);
      form.resetFields();
      setEditingTemplate(null);
      tableRef.current?.reload();
    } catch (error) {
      message.error(editingTemplate ? '更新失败' : '创建失败');
    }
  };

  const handleInitialize = async () => {
    confirm({
      title: '初始化默认模板',
      content: '这将创建系统预定义的提示词模板，确定继续吗？',
      onOk: async () => {
        try {
          await promptTemplateAPI.initialize();
          message.success('初始化成功');
          tableRef.current?.reload();
        } catch (error) {
          message.error('初始化失败');
        }
      },
    });
  };

  return (
    <PageContainer
      extra={
        <Space>
          <Button onClick={handleInitialize}>
            初始化默认模板
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建模板
          </Button>
        </Space>
      }
    >
      <ProTable<PromptTemplate>
        headerTitle="提示词模板管理"
        actionRef={tableRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          try {
            const response = await promptTemplateAPI.list();
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
        title={editingTemplate ? '编辑提示词模板' : '新建提示词模板'}
        open={createModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setEditingTemplate(null);
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="例如：前端开发工程师" />
          </Form.Item>
          <Form.Item
            name="responsibility"
            label="对应职责"
            rules={[{ required: true, message: '请选择对应职责' }]}
          >
            <Select placeholder="请选择对应职责">
              {responsibilities.map(r => (
                <Select.Option key={r} value={r}>{r}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="模板描述"
          >
            <TextArea 
              rows={2} 
              placeholder="简要描述这个模板的用途" 
            />
          </Form.Item>
          <Form.Item
            name="prompt"
            label="提示词内容"
            rules={[{ required: true, message: '请输入提示词内容' }]}
          >
            <TextArea 
              rows={10} 
              placeholder="输入完整的提示词内容..." 
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="是否启用"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PromptTemplates;