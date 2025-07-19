import React, { useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams } from 'umi';
import { Descriptions, Card, List, Avatar, Tag, Spin, Empty, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { teamAPI, promptTemplateAPI } from '@/services/api';

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<API.Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [editMemberVisible, setEditMemberVisible] = useState(false);
  const [currentMember, setCurrentMember] = useState<API.TeamMember | null>(null);
  const [promptTemplates, setPromptTemplates] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTeamDetail();
    fetchPromptTemplates();
  }, [id]);

  const fetchTeamDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await teamAPI.get(id);
      if (response.success) {
        setTeam(response.data);
      }
    } catch (error) {
      console.error('获取团队详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromptTemplates = async () => {
    try {
      const response = await promptTemplateAPI.list(true);
      if (response.success) {
        setPromptTemplates(response.data || []);
      }
    } catch (error) {
      console.error('获取提示词模板失败:', error);
    }
  };

  const handleResponsibilityChange = async (responsibility: string) => {
    // 当职责变化时，加载对应的提示词模板
    try {
      const response = await promptTemplateAPI.getByResponsibility(responsibility);
      if (response.success && response.data.length > 0) {
        // 如果有对应的模板，默认选择第一个
        const defaultTemplate = response.data[0];
        form.setFieldValue('workPrompt', defaultTemplate.prompt);
      }
    } catch (error) {
      console.error('获取提示词模板失败:', error);
    }
  };

  const handleAddMember = async (values: any) => {
    try {
      await teamAPI.addMember(id!, values);
      message.success('添加成员成功');
      setAddMemberVisible(false);
      form.resetFields();
      fetchTeamDetail();
    } catch (error) {
      message.error('添加成员失败');
    }
  };

  const handleEditMember = (member: API.TeamMember) => {
    setCurrentMember(member);
    form.setFieldsValue({
      name: member.name,
      workPrompt: member.workPrompt,
      responsibilities: member.responsibilities,
      skills: member.skills,
    });
    setEditMemberVisible(true);
  };

  const handleUpdateMember = async (values: any) => {
    if (!currentMember) return;
    
    try {
      await teamAPI.updateMember(id!, currentMember.id, values);
      message.success('更新成员成功');
      setEditMemberVisible(false);
      form.resetFields();
      fetchTeamDetail();
    } catch (error) {
      message.error('更新成员失败');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    Modal.confirm({
      title: '确定移除该成员吗？',
      onOk: async () => {
        try {
          await teamAPI.removeMember(id!, memberId);
          message.success('移除成员成功');
          fetchTeamDetail();
        } catch (error) {
          message.error('移除成员失败');
        }
      },
    });
  };

  if (loading) {
    return (
      <PageContainer title="团队详情">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!team) {
    return (
      <PageContainer title="团队详情">
        <Empty description="团队不存在" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={team.name}
      onBack={() => window.history.back()}
    >
      <ProCard>
        <Descriptions title="基本信息" bordered>
          <Descriptions.Item label="团队名称">{team.name}</Descriptions.Item>
          <Descriptions.Item label="团队ID">{team.id}</Descriptions.Item>
          <Descriptions.Item label="成员数量">{team.members?.length || 0}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(team.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{new Date(team.updatedAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="团队描述" span={3}>
            {team.description || '暂无描述'}
          </Descriptions.Item>
        </Descriptions>
      </ProCard>

      <Card 
        title="团队成员" 
        style={{ marginTop: 16 }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddMemberVisible(true)}
          >
            添加成员
          </Button>
        }
      >
        {team.TeamMember && team.TeamMember.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={team.TeamMember}
            renderItem={(member) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditMember(member)}
                  >
                    编辑
                  </Button>,
                  <Button
                    key="delete"
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<UserOutlined />} />
                  }
                  title={member.name || `成员 ${member.id.substring(0, 8)}`}
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>职责：</strong>
                        <Space wrap>
                          {member.responsibilities?.map((resp, index) => (
                            <Tag key={index} color="green">{resp}</Tag>
                          )) || '暂无'}
                        </Space>
                      </div>
                      <div>
                        <strong>技能：</strong>
                        <Space wrap>
                          {member.skills?.map((skill, index) => (
                            <Tag key={index} color="blue">{skill}</Tag>
                          )) || '暂无'}
                        </Space>
                      </div>
                      {member.workPrompt && (
                        <div style={{ marginTop: 8 }}>
                          <strong>工作指导：</strong>
                          <div style={{ color: '#666', marginTop: 4 }}>
                            {member.workPrompt}
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: 8, color: '#999' }}>
                        加入时间：{new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无团队成员" />
        )}
      </Card>

      <Modal
        title="添加成员"
        open={addMemberVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddMemberVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMember}
        >
          <Form.Item
            name="name"
            label="成员名称"
            rules={[{ required: true, message: '请输入成员名称' }]}
          >
            <Input placeholder="请输入AI Agent名称" />
          </Form.Item>
          <Form.Item
            name="workPrompt"
            label="工作指导提示词"
            tooltip="用于指导AI Agent如何工作的提示词"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="例如：你是一个专业的前端开发工程师，擅长React和TypeScript，负责开发用户界面..." 
            />
          </Form.Item>
          <Form.Item
            name="responsibilities"
            label="职责"
            rules={[{ required: true, message: '请输入职责' }]}
          >
            <Select 
              mode="tags" 
              placeholder="请输入团队职责，按回车添加"
              onChange={(values) => {
                // 当选择单个职责时，加载对应的提示词模板
                if (values.length === 1) {
                  handleResponsibilityChange(values[0]);
                }
              }}
            >
              <Select.Option value="前端开发">前端开发</Select.Option>
              <Select.Option value="后端开发">后端开发</Select.Option>
              <Select.Option value="产品设计">产品设计</Select.Option>
              <Select.Option value="项目管理">项目管理</Select.Option>
              <Select.Option value="UI设计">UI设计</Select.Option>
              <Select.Option value="测试">测试</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="提示词模板"
            tooltip="选择预定义的提示词模板"
          >
            <Select 
              placeholder="选择提示词模板（可选）"
              allowClear
              onChange={(templateId) => {
                if (templateId) {
                  const template = promptTemplates.find(t => t.id === templateId);
                  if (template) {
                    form.setFieldValue('workPrompt', template.prompt);
                  }
                }
              }}
            >
              {promptTemplates.map(template => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="skills"
            label="技能"
            rules={[{ required: true, message: '请输入技能' }]}
          >
            <Select mode="tags" placeholder="请输入技能标签，按回车添加">
              <Select.Option value="React">React</Select.Option>
              <Select.Option value="TypeScript">TypeScript</Select.Option>
              <Select.Option value="Node.js">Node.js</Select.Option>
              <Select.Option value="Python">Python</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑成员"
        open={editMemberVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditMemberVisible(false);
          form.resetFields();
          setCurrentMember(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateMember}
        >
          <Form.Item
            name="name"
            label="成员名称"
            rules={[{ required: true, message: '请输入成员名称' }]}
          >
            <Input placeholder="请输入AI Agent名称" />
          </Form.Item>
          <Form.Item
            name="workPrompt"
            label="工作指导提示词"
            tooltip="用于指导AI Agent如何工作的提示词"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="例如：你是一个专业的前端开发工程师，擅长React和TypeScript，负责开发用户界面..." 
            />
          </Form.Item>
          <Form.Item
            name="responsibilities"
            label="职责"
            rules={[{ required: true, message: '请输入职责' }]}
          >
            <Select 
              mode="tags" 
              placeholder="请输入团队职责，按回车添加"
              onChange={(values) => {
                // 当选择单个职责时，加载对应的提示词模板
                if (values.length === 1) {
                  handleResponsibilityChange(values[0]);
                }
              }}
            >
              <Select.Option value="前端开发">前端开发</Select.Option>
              <Select.Option value="后端开发">后端开发</Select.Option>
              <Select.Option value="产品设计">产品设计</Select.Option>
              <Select.Option value="项目管理">项目管理</Select.Option>
              <Select.Option value="UI设计">UI设计</Select.Option>
              <Select.Option value="测试">测试</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="提示词模板"
            tooltip="选择预定义的提示词模板"
          >
            <Select 
              placeholder="选择提示词模板（可选）"
              allowClear
              onChange={(templateId) => {
                if (templateId) {
                  const template = promptTemplates.find(t => t.id === templateId);
                  if (template) {
                    form.setFieldValue('workPrompt', template.prompt);
                  }
                }
              }}
            >
              {promptTemplates.map(template => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="skills"
            label="技能"
            rules={[{ required: true, message: '请输入技能' }]}
          >
            <Select mode="tags" placeholder="请输入技能标签，按回车添加">
              <Select.Option value="React">React</Select.Option>
              <Select.Option value="TypeScript">TypeScript</Select.Option>
              <Select.Option value="Node.js">Node.js</Select.Option>
              <Select.Option value="Python">Python</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TeamDetail;