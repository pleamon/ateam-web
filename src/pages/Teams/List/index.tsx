import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Avatar, Modal, Form, Input, message, Tag, Empty } from 'antd';
import { PlusOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { history, useModel } from 'umi';
import { teamAPI } from '@/services/api';

const { confirm } = Modal;

const TeamList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();
  const { currentProjectId } = useModel('useProjectModel');
  const columns: ProColumns<API.Team>[] = [
    {
      title: '团队名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => history.push(`/teams/${record.id}`)}>
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
      title: '成员数量',
      dataIndex: 'TeamMember',
      key: 'memberCount',
      render: (members: API.TeamMember[]) => members?.length || 0,
    },
    {
      title: '团队成员',
      dataIndex: 'TeamMember',
      key: 'members',
      render: (members: API.TeamMember[]) => {
        if (!members || members.length === 0) return '-';
        return (
          <Space wrap>
            {members.slice(0, 3).map(member => (
              <Tag key={member.id} icon={<UserOutlined />}>
                {member.name}
              </Tag>
            ))}
            {members.length > 3 && <Tag>+{members.length - 3}</Tag>}
          </Space>
        );
      },
    },
    {
      title: '成员职责',
      dataIndex: 'TeamMember',
      key: 'responsibilities',
      width: 200,
      render: (members: API.TeamMember[]) => {
        if (!members || members.length === 0) return '-';
        const allResponsibilities = members.flatMap(m => m.responsibilities || []);
        const uniqueResponsibilities = [...new Set(allResponsibilities)];
        return (
          <Space wrap>
            {uniqueResponsibilities.slice(0, 3).map(resp => (
              <Tag key={resp} color="green">{resp}</Tag>
            ))}
            {uniqueResponsibilities.length > 3 && <Tag>+{uniqueResponsibilities.length - 3}</Tag>}
          </Space>
        );
      },
    },
    {
      title: '成员技能',
      dataIndex: 'TeamMember',
      key: 'skills',
      width: 200,
      render: (members: API.TeamMember[]) => {
        if (!members || members.length === 0) return '-';
        const allSkills = members.flatMap(m => m.skills || []);
        const uniqueSkills = [...new Set(allSkills)];
        return (
          <Space wrap>
            {uniqueSkills.slice(0, 3).map(skill => (
              <Tag key={skill} color="blue">{skill}</Tag>
            ))}
            {uniqueSkills.length > 3 && <Tag>+{uniqueSkills.length - 3}</Tag>}
          </Space>
        );
      },
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
          <a onClick={() => history.push(`/teams/${record.id}`)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: API.Team) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: API.Team) => {
    confirm({
      title: '确定删除这个团队吗？',
      icon: <ExclamationCircleOutlined />,
      content: `团队名称：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await teamAPI.delete(record.id);
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
      await teamAPI.create(values);
      message.success('创建成功');
      setCreateModalVisible(false);
      form.resetFields();
      tableRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  if (!currentProjectId) {
    return (
      <PageContainer>
        <Empty 
          description="请先选择一个项目" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProTable<API.Team>
        headerTitle="团队列表"
        actionRef={tableRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建团队
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const requestParams = currentProjectId 
              ? { ...params, projectId: currentProjectId }
              : params;
            const response = await teamAPI.list(requestParams);
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
        title="新建团队"
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
            label="团队名称"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="团队描述"
          >
            <Input.TextArea rows={4} placeholder="请输入团队描述" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TeamList;