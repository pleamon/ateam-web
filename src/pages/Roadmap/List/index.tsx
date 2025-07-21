import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, DatePicker, Select, message, Progress, Empty } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, RocketOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { history, useModel } from 'umi';
import { roadmapAPI } from '@/services/roadmap';
import { projectAPI } from '@/services/project';
import moment from 'moment';

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const RoadmapList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();
  const { currentProjectId } = useModel('useProjectModel');

  const getStatusTag = (status: string) => {
    const statusMap = {
      planning: { color: 'default', text: '规划中', icon: <ClockCircleOutlined /> },
      active: { color: 'processing', text: '进行中', icon: <RocketOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: '已取消', icon: <StopOutlined /> },
    };
    const config = statusMap[status] || statusMap.planning;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const calculateProgress = (roadmap: any) => {
    if (!roadmap.milestones || roadmap.milestones.length === 0) return 0;
    const completedCount = roadmap.milestones.filter((m: any) => m.status === 'completed').length;
    return Math.round((completedCount / roadmap.milestones.length) * 100);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '路线图名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => history.push(`/roadmap/${record.id}`)}>
          <RocketOutlined /> {record.name}
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
      filters: [
        { text: '规划中', value: 'planning' },
        { text: '进行中', value: 'active' },
        { text: '已完成', value: 'completed' },
        { text: '已取消', value: 'cancelled' },
      ],
    },
    {
      title: '进度',
      key: 'progress',
      render: (_, record) => {
        const progress = calculateProgress(record);
        return <Progress percent={progress} size="small" />;
      },
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
      title: '里程碑数',
      key: 'milestoneCount',
      render: (_, record) => record.milestones?.length || 0,
    },
    {
      title: '版本数',
      key: 'versionCount',
      render: (_, record) => record.versions?.length || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => history.push(`/roadmap/${record.id}`)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个路线图吗？',
      icon: <ExclamationCircleOutlined />,
      content: `路线图名称：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await roadmapAPI.delete(record.id);
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
      await roadmapAPI.create(payload);
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
        headerTitle="产品路线图"
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
            新建路线图
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const requestParams = currentProjectId 
              ? { ...params, projectId: currentProjectId }
              : params;
            const response = await roadmapAPI.list(requestParams);
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
        title="新建路线图"
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
            label="路线图名称"
            rules={[{ required: true, message: '请输入路线图名称' }]}
          >
            <Input placeholder="请输入路线图名称" />
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
            name="dateRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入路线图描述" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RoadmapList;