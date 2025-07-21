import React, { useEffect, useState } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, Button, Space, Timeline, Tag, Row, Col, Progress, List, Modal, Form, Input, DatePicker, Select, message, Tabs } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined, RocketOutlined, FlagOutlined, TagOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { history, useParams } from 'umi';
import { roadmapAPI } from '@/services/roadmap';
import { milestoneAPI } from '@/services/milestone';
import { versionAPI } from '@/services/version';
import moment from 'moment';

const { TextArea } = Input;

const RoadmapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [milestoneForm] = Form.useForm();
  const [versionForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchRoadmapDetail();
    }
  }, [id]);

  const fetchRoadmapDetail = async () => {
    try {
      setLoading(true);
      const response = await roadmapAPI.get(id!);
      if (response.success && response.data) {
        setRoadmap(response.data);
      }
    } catch (error) {
      message.error('获取路线图详情失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      planning: { color: 'default', text: '规划中' },
      active: { color: 'processing', text: '进行中' },
      completed: { color: 'success', text: '已完成' },
      cancelled: { color: 'error', text: '已取消' },
    };
    const config = statusMap[status] || statusMap.planning;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getFeatureStatusText = (status: string) => {
    const statusMap = {
      planned: '计划中',
      in_development: '开发中',
      testing: '测试中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      critical: 'red',
    };
    return priorityMap[priority] || 'default';
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '紧急',
    };
    return priorityMap[priority] || priority;
  };

  const getMilestoneStatusTag = (status: string) => {
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

  const getVersionStatusTag = (status: string) => {
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

  const calculateProgress = () => {
    if (!roadmap?.milestones || roadmap.milestones.length === 0) return 0;
    const completedCount = roadmap.milestones.filter((m: any) => m.status === 'completed').length;
    return Math.round((completedCount / roadmap.milestones.length) * 100);
  };

  const handleCreateMilestone = async (values: any) => {
    try {
      await milestoneAPI.create({
        ...values,
        roadmapId: id,
        targetDate: values.targetDate.toISOString(),
      });
      message.success('创建里程碑成功');
      setMilestoneModalVisible(false);
      milestoneForm.resetFields();
      fetchRoadmapDetail();
    } catch (error) {
      message.error('创建里程碑失败');
    }
  };

  const handleCreateVersion = async (values: any) => {
    try {
      await versionAPI.create({
        ...values,
        roadmapId: id,
        releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null,
      });
      message.success('创建版本成功');
      setVersionModalVisible(false);
      versionForm.resetFields();
      fetchRoadmapDetail();
    } catch (error) {
      message.error('创建版本失败');
    }
  };

  return (
    <PageContainer
      title={roadmap?.name || '路线图详情'}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => history.push('/roadmap/list')}>
          返回列表
        </Button>,
        <Button key="edit" icon={<EditOutlined />}>
          编辑
        </Button>,
        <Button key="delete" danger icon={<DeleteOutlined />}>
          删除
        </Button>,
      ]}
      loading={loading}
    >
      <Card>
        <ProDescriptions column={2}>
          <ProDescriptions.Item label="路线图名称">{roadmap?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="状态">{roadmap && getStatusTag(roadmap.status)}</ProDescriptions.Item>
          <ProDescriptions.Item label="开始时间">
            {roadmap?.startDate && moment(roadmap.startDate).format('YYYY-MM-DD')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="结束时间">
            {roadmap?.endDate && moment(roadmap.endDate).format('YYYY-MM-DD')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="所属项目">{roadmap?.project?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="创建时间">
            {roadmap?.createdAt && moment(roadmap.createdAt).format('YYYY-MM-DD HH:mm')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="描述" span={2}>
            {roadmap?.description || '暂无描述'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Progress type="circle" percent={calculateProgress()} />
            <p style={{ textAlign: 'center', marginTop: 16 }}>整体进度</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h2 style={{ textAlign: 'center' }}>{roadmap?.milestones?.length || 0}</h2>
            <p style={{ textAlign: 'center' }}>里程碑总数</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h2 style={{ textAlign: 'center' }}>{roadmap?.versions?.length || 0}</h2>
            <p style={{ textAlign: 'center' }}>版本总数</p>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="milestones" style={{ marginTop: 16 }}>
        <Tabs.TabPane tab="里程碑" key="milestones">
          <Card
            title="里程碑列表"
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setMilestoneModalVisible(true)}
              >
                新建里程碑
              </Button>
            }
          >
            <Timeline mode="left">
              {roadmap?.milestones?.map((milestone: any) => (
                <Timeline.Item
                  key={milestone.id}
                  color={milestone.status === 'completed' ? 'green' : milestone.status === 'delayed' ? 'red' : 'blue'}
                  label={moment(milestone.targetDate).format('YYYY-MM-DD')}
                  dot={<FlagOutlined />}
                >
                  <h4>{milestone.name}</h4>
                  <Space>
                    {getMilestoneStatusTag(milestone.status)}
                    {getPriorityTag(milestone.priority)}
                  </Space>
                  <p>{milestone.description}</p>
                  {milestone.features && milestone.features.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ marginBottom: 8 }}>包含 {milestone.features.length} 个功能：</p>
                      <List
                        size="small"
                        dataSource={milestone.features}
                        renderItem={(feature: any) => (
                          <List.Item
                            actions={[
                              <Tag color={feature.status === 'completed' ? 'success' : 'default'}>
                                {getFeatureStatusText(feature.status)}
                              </Tag>,
                              <Tag color={getPriorityColor(feature.priority)}>
                                {getPriorityText(feature.priority)}
                              </Tag>
                            ]}
                          >
                            <List.Item.Meta
                              title={feature.name}
                              description={feature.description}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="版本计划" key="versions">
          <Card
            title="版本列表"
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setVersionModalVisible(true)}
              >
                新建版本
              </Button>
            }
          >
            <List
              dataSource={roadmap?.versions}
              renderItem={(version: any) => (
                <List.Item
                  actions={[
                    getVersionStatusTag(version.status),
                    version.releaseDate && (
                      <span>
                        <TagOutlined /> {moment(version.releaseDate).format('YYYY-MM-DD')}
                      </span>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={<TagOutlined style={{ fontSize: 24 }} />}
                    title={version.name}
                    description={version.description}
                  />
                  {version.features && version.features.length > 0 && (
                    <div style={{ marginTop: 12, width: '100%' }}>
                      <p style={{ marginBottom: 8 }}>包含 {version.features.length} 个功能：</p>
                      <List
                        size="small"
                        dataSource={version.features}
                        renderItem={(feature: any) => (
                          <List.Item
                            actions={[
                              <Tag color={feature.status === 'completed' ? 'success' : 'default'}>
                                {getFeatureStatusText(feature.status)}
                              </Tag>,
                              <Tag color={getPriorityColor(feature.priority)}>
                                {getPriorityText(feature.priority)}
                              </Tag>
                            ]}
                          >
                            <List.Item.Meta
                              title={feature.name}
                              description={feature.description}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </List.Item>
              )}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="新建里程碑"
        open={milestoneModalVisible}
        onOk={() => milestoneForm.submit()}
        onCancel={() => {
          setMilestoneModalVisible(false);
          milestoneForm.resetFields();
        }}
      >
        <Form
          form={milestoneForm}
          layout="vertical"
          onFinish={handleCreateMilestone}
        >
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

      <Modal
        title="新建版本"
        open={versionModalVisible}
        onOk={() => versionForm.submit()}
        onCancel={() => {
          setVersionModalVisible(false);
          versionForm.resetFields();
        }}
      >
        <Form
          form={versionForm}
          layout="vertical"
          onFinish={handleCreateVersion}
        >
          <Form.Item
            name="name"
            label="版本名称"
            rules={[{ required: true, message: '请输入版本名称' }]}
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

export default RoadmapDetail;