import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, DatePicker, Select, message, Empty } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, FlagOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { milestoneAPI, roadmapAPI } from '@/services/api';
import { useModel } from 'umi';
import moment from 'moment';

const { confirm } = Modal;
const { TextArea } = Input;

const Milestones: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();
  const { currentProjectId } = useModel('useProjectModel');

  const getStatusTag = (status: string) => {
    const statusMap = {
      planned: { color: 'default', text: '计划中' },
      in_progress: { color: 'processing', text: '进行中' },
      completed: { color: 'success', text: '已完成' },
      delayed: { color: 'error', text: '已延期' },
    };
    const config = statusMap[status] || statusMap.planned;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const priorityMap = {
      low: { color: 'default', text: '低' },
      medium: { color: 'blue', text: '中' },
      high: { color: 'orange', text: '高' },
      critical: { color: 'red', text: '紧急' },
    };
    const config = priorityMap[priority] || priorityMap.medium;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ProColumns<any>[] = [
    {
      title: '里程碑名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span>
          <FlagOutlined /> {text}
        </span>
      ),
    },
    {
      title: '所属路线图',
      dataIndex: ['roadmap', 'name'],
      key: 'roadmapName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '计划中', value: 'planned' },
        { text: '进行中', value: 'in_progress' },
        { text: '已完成', value: 'completed' },
        { text: '已延期', value: 'delayed' },
      ],
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => getPriorityTag(priority),
      filters: [
        { text: '低', value: 'low' },
        { text: '中', value: 'medium' },
        { text: '高', value: 'high' },
        { text: '紧急', value: 'critical' },
      ],
    },
    {
      title: '目标日期',
      dataIndex: 'targetDate',
      key: 'targetDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: '功能数量',
      key: 'featuresCount',
      render: (_, record) => record.features?.length || 0,
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
          <a onClick={() => handleUpdateStatus(record)}>更新状态</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleUpdateStatus = (record: any) => {
    Modal.confirm({
      title: '更新里程碑状态',
      content: (
        <Select
          defaultValue={record.status}
          style={{ width: '100%', marginTop: 16 }}
          onChange={async (value) => {
            try {
              await milestoneAPI.update(record.id, { status: value });
              message.success('状态更新成功');
              tableRef.current?.reload();
              Modal.destroyAll();
            } catch (error) {
              message.error('状态更新失败');
            }
          }}
        >
          <Select.Option value="planned">计划中</Select.Option>
          <Select.Option value="in_progress">进行中</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="delayed">已延期</Select.Option>
        </Select>
      ),
      okButtonProps: { style: { display: 'none' } },
    });
  };

  const handleEdit = (record: any) => {
    setEditingMilestone(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      priority: record.priority,
      targetDate: moment(record.targetDate),
      roadmapId: record.roadmapId,
    });
    setCreateModalVisible(true);
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个里程碑吗？',
      icon: <ExclamationCircleOutlined />,
      content: `里程碑名称：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await milestoneAPI.delete(record.id);
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
      if (editingMilestone) {
        // 编辑模式
        await milestoneAPI.update(editingMilestone.id, {
          ...values,
          targetDate: values.targetDate.toISOString(),
        });
        message.success('更新成功');
      } else {
        // 创建模式
        await milestoneAPI.create({
          ...values,
          targetDate: values.targetDate.toISOString(),
        });
        message.success('创建成功');
      }
      setCreateModalVisible(false);
      form.resetFields();
      setEditingMilestone(null);
      tableRef.current?.reload();
    } catch (error) {
      message.error(editingMilestone ? '更新失败' : '创建失败');
    }
  };

  const fetchRoadmaps = async () => {
    try {
      const response = await roadmapAPI.list();
      if (response.success) {
        setRoadmaps(response.data || []);
      }
    } catch (error) {
      console.error('获取路线图列表失败:', error);
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
      <ProTable<any>
        headerTitle="里程碑管理"
        actionRef={tableRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              fetchRoadmaps();
              setCreateModalVisible(true);
            }}
          >
            新建里程碑
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const requestParams = currentProjectId 
              ? { ...params, projectId: currentProjectId }
              : params;
            const response = await milestoneAPI.list(requestParams);
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
        title={editingMilestone ? '编辑里程碑' : '新建里程碑'}
        open={createModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setEditingMilestone(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="roadmapId"
            label="所属路线图"
            rules={[{ required: true, message: '请选择所属路线图' }]}
          >
            <Select placeholder="请选择路线图">
              {roadmaps.map((roadmap) => (
                <Select.Option key={roadmap.id} value={roadmap.id}>
                  {roadmap.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="里程碑名称"
            rules={[{ required: true, message: '请输入里程碑名称' }]}
          >
            <Input placeholder="请输入里程碑名称" />
          </Form.Item>
          <Form.Item
            name="targetDate"
            label="目标日期"
            rules={[{ required: true, message: '请选择目标日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            initialValue="medium"
          >
            <Select>
              <Select.Option value="low">低</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="critical">紧急</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入里程碑描述" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Milestones;