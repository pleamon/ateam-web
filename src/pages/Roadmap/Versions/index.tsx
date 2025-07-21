import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, DatePicker, Select, message, Empty } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, TagOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { versionAPI } from '@/services/version';
import { roadmapAPI } from '@/services/roadmap';
import { useModel } from 'umi';
import moment from 'moment';

const { confirm } = Modal;
const { TextArea } = Input;

const Versions: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [editingVersion, setEditingVersion] = useState<any>(null);
  const [form] = Form.useForm();
  const tableRef = React.useRef<any>();
  const { currentProjectId } = useModel('useProjectModel');

  const getStatusTag = (status: string) => {
    const statusMap = {
      planned: { color: 'default', text: '计划中' },
      in_development: { color: 'processing', text: '开发中' },
      testing: { color: 'warning', text: '测试中' },
      released: { color: 'success', text: '已发布' },
      deprecated: { color: 'error', text: '已废弃' },
    };
    const config = statusMap[status] || statusMap.planned;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ProColumns<any>[] = [
    {
      title: '版本号',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span>
          <TagOutlined /> {text}
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
        { text: '开发中', value: 'in_development' },
        { text: '测试中', value: 'testing' },
        { text: '已发布', value: 'released' },
        { text: '已废弃', value: 'deprecated' },
      ],
    },
    {
      title: '计划发布日期',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: '功能数量',
      key: 'featuresCount',
      render: (_, record) => record.features?.length || 0,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      title: '更新版本状态',
      content: (
        <Select
          defaultValue={record.status}
          style={{ width: '100%', marginTop: 16 }}
          onChange={async (value) => {
            try {
              await versionAPI.update(record.id, { status: value });
              message.success('状态更新成功');
              tableRef.current?.reload();
              Modal.destroyAll();
            } catch (error) {
              message.error('状态更新失败');
            }
          }}
        >
          <Select.Option value="planned">计划中</Select.Option>
          <Select.Option value="in_development">开发中</Select.Option>
          <Select.Option value="testing">测试中</Select.Option>
          <Select.Option value="released">已发布</Select.Option>
          <Select.Option value="deprecated">已废弃</Select.Option>
        </Select>
      ),
      okButtonProps: { style: { display: 'none' } },
    });
  };

  const handleEdit = (record: any) => {
    setEditingVersion(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
      releaseDate: record.releaseDate ? moment(record.releaseDate) : null,
      roadmapId: record.roadmapId,
    });
    setCreateModalVisible(true);
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个版本吗？',
      icon: <ExclamationCircleOutlined />,
      content: `版本号：${record.name}`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await versionAPI.delete(record.id);
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
      if (editingVersion) {
        // 编辑模式
        await versionAPI.update(editingVersion.id, {
          ...values,
          releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null,
        });
        message.success('更新成功');
      } else {
        // 创建模式
        await versionAPI.create({
          ...values,
          releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null,
        });
        message.success('创建成功');
      }
      setCreateModalVisible(false);
      form.resetFields();
      setEditingVersion(null);
      tableRef.current?.reload();
    } catch (error) {
      message.error(editingVersion ? '更新失败' : '创建失败');
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
        headerTitle="版本管理"
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
            新建版本
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const requestParams = currentProjectId 
              ? { ...params, projectId: currentProjectId }
              : params;
            const response = await versionAPI.list(requestParams);
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
        title={editingVersion ? '编辑版本' : '新建版本'}
        open={createModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setEditingVersion(null);
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
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如：v1.0.0" />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="计划发布日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="planned"
          >
            <Select>
              <Select.Option value="planned">计划中</Select.Option>
              <Select.Option value="in_development">开发中</Select.Option>
              <Select.Option value="testing">测试中</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="版本说明"
          >
            <TextArea rows={4} placeholder="请输入版本说明" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Versions;