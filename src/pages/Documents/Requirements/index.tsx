import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { requirementAPI } from '@/services/requirement';
import { projectAPI } from '@/services/project';

const { confirm } = Modal;
const { TextArea } = Input;

const Requirements: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState<any>(null);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();

  const columns: ProColumns<any>[] = [
    {
      title: '需求内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 400,
      render: (text, record) => (
        <a onClick={() => handleView(record)}>
          {text}
        </a>
      ),
    },
    {
      title: '所属项目',
      dataIndex: ['project', 'name'],
      key: 'projectName',
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

  const handleView = (record: any) => {
    setCurrentRequirement(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: any) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个需求吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await requirementAPI.delete(record.id);
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
      await requirementAPI.create(values);
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
        headerTitle="需求管理"
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
            新建需求
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const response = await requirementAPI.list(params);
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
        title="新建需求"
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
            label="需求内容"
            rules={[{ required: true, message: '请输入需求内容' }]}
          >
            <TextArea rows={8} placeholder="请详细描述需求内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="需求详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {currentRequirement && (
          <div>
            <p><strong>所属项目：</strong>{currentRequirement.project?.name}</p>
            <p><strong>创建时间：</strong>{new Date(currentRequirement.createdAt).toLocaleString()}</p>
            <p><strong>需求内容：</strong></p>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{currentRequirement.content}</pre>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Requirements;