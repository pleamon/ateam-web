import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { history } from 'umi';
import { projectAPI } from '@/services/api';


const ProjectList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();

  const columns: ProColumns<API.Project>[] = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => history.push(`/projects/${record.id}`)}>
          {record.name}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '任务数',
      dataIndex: 'tasks',
      key: 'taskCount',
      render: (tasks: API.Task[]) => tasks?.length || 0,
    },
    {
      title: '文档数',
      dataIndex: 'documentation',
      key: 'docCount',
      render: (docs: API.Documentation[]) => docs?.length || 0,
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
          <a onClick={() => history.push(`/projects/${record.id}`)}>查看</a>
          <a onClick={() => history.push(`/projects/${record.id}`)}>编辑</a>
        </Space>
      ),
    },
  ];


  const handleCreate = async (values: any) => {
    try {
      await projectAPI.create(values);
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
      <ProTable<API.Project>
        headerTitle="项目列表"
        actionRef={tableRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建项目
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const response = await projectAPI.list(params);
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
        title="新建项目"
        open={createModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="项目描述"
          >
            <Input.TextArea rows={4} placeholder="请输入项目描述" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProjectList;