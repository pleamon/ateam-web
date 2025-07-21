import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, DatePicker, Select, message, Empty } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, ThunderboltOutlined, PauseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { history, useModel } from 'umi';
import { getSprints, getSprint, createSprint, updateSprint, deleteSprint } from '@/services/sprint';
import moment from 'moment';

const { confirm } = Modal;
const { RangePicker } = DatePicker;

const SprintList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();
  const { currentProjectId } = useModel('useProjectModel');

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'processing', text: '进行中', icon: <ThunderboltOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      planned: { color: 'default', text: '计划中', icon: <PauseOutlined /> },
    };
    const config = statusConfig[status] || statusConfig.planned;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns: ProColumns<API.Sprint>[] = [
    {
      title: 'Sprint名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => history.push(`/sprints/${record.id}`)}>
          {record.name}
        </a>
      ),
    },
    {
      title: '所属项目',
      dataIndex: ['project', 'name'],
      key: 'projectName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      valueType: 'date',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      valueType: 'date',
    },
    {
      title: '目标',
      dataIndex: 'goal',
      key: 'goal',
      ellipsis: true,
      width: 300,
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
          <a onClick={() => history.push(`/sprints/${record.id}`)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: API.Sprint) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: API.Sprint) => {
    confirm({
      title: '确定删除这个Sprint吗？',
      icon: <ExclamationCircleOutlined />,
      content: `Sprint名称：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteSprint(record.id);
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
      const [startDate, endDate] = values.dateRange;
      const payload = {
        ...values,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dateRange: undefined,
      };
      await createSprint(payload);
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
      <ProTable<API.Sprint>
        headerTitle="Sprint列表"
        actionRef={tableRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建Sprint
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const requestParams = currentProjectId 
              ? { ...params, projectId: currentProjectId }
              : params;
            const response = await getSprints(requestParams);
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
        title="新建Sprint"
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
            label="Sprint名称"
            rules={[{ required: true, message: '请输入Sprint名称' }]}
          >
            <Input placeholder="请输入Sprint名称" />
          </Form.Item>
          <Form.Item
            name="projectId"
            label="所属项目"
            rules={[{ required: true, message: '请选择所属项目' }]}
          >
            <Select placeholder="请选择所属项目">
              {/* 这里应该动态加载项目列表 */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="goal"
            label="Sprint目标"
          >
            <Input.TextArea rows={4} placeholder="请输入Sprint目标" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SprintList;