import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Form, Input, Select, message, Card } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { questionAPI, projectAPI } from '@/services/api';

const { confirm } = Modal;
const { TextArea } = Input;

const Questions: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [projects, setProjects] = useState<API.Project[]>([]);
  const [form] = Form.useForm();
  const [answerForm] = Form.useForm();
  const tableRef = React.useRef<any>();

  const getStatusTag = (status: string, clarified: boolean) => {
    if (clarified) {
      return <Tag color="success" icon={<CheckCircleOutlined />}>已澄清</Tag>;
    }
    const statusMap = {
      todo: { color: 'default', text: '待处理', icon: <QuestionCircleOutlined /> },
      in_progress: { color: 'processing', text: '处理中', icon: <ClockCircleOutlined /> },
      done: { color: 'success', text: '已回答', icon: <CheckCircleOutlined /> },
    };
    const config = statusMap[status] || statusMap.todo;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      width: 300,
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
      title: '状态',
      key: 'status',
      render: (_, record) => getStatusTag(record.status, record.clarified),
      filters: [
        { text: '待处理', value: 'todo' },
        { text: '处理中', value: 'in_progress' },
        { text: '已回答', value: 'done' },
      ],
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
          <a onClick={() => handleView(record)}>查看</a>
          {record.status !== 'done' && (
            <a onClick={() => handleAnswer(record)}>回答</a>
          )}
          {record.status === 'done' && !record.clarified && (
            <a onClick={() => handleClarify(record)}>标记为已澄清</a>
          )}
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleView = (record: any) => {
    Modal.info({
      title: '问题详情',
      content: (
        <div>
          <Card size="small" title="问题" style={{ marginBottom: 16 }}>
            <p>{record.question}</p>
          </Card>
          {record.answer && (
            <Card size="small" title="回答">
              <p>{record.answer}</p>
            </Card>
          )}
          <p style={{ marginTop: 16 }}>
            <strong>状态：</strong>{getStatusTag(record.status, record.clarified)}
          </p>
          <p><strong>所属项目：</strong>{record.project?.name}</p>
          <p><strong>创建时间：</strong>{new Date(record.createdAt).toLocaleString()}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleAnswer = (record: any) => {
    setCurrentQuestion(record);
    answerForm.setFieldsValue({ answer: record.answer });
    setAnswerModalVisible(true);
  };

  const handleClarify = async (record: any) => {
    try {
      await questionAPI.update(record.id, { clarified: true });
      message.success('已标记为已澄清');
      tableRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确定删除这个问题吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后不可恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await questionAPI.delete(record.id);
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
      await questionAPI.create(values);
      message.success('创建成功');
      setCreateModalVisible(false);
      form.resetFields();
      tableRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleSubmitAnswer = async (values: any) => {
    try {
      await questionAPI.update(currentQuestion.id, {
        answer: values.answer,
        status: 'done',
      });
      message.success('回答提交成功');
      setAnswerModalVisible(false);
      answerForm.resetFields();
      tableRef.current?.reload();
    } catch (error) {
      message.error('提交失败');
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
        headerTitle="需求问答"
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
            新建问题
          </Button>,
        ]}
        columns={columns}
        request={async (params) => {
          try {
            const response = await questionAPI.list(params);
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
        title="新建问题"
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
            name="question"
            label="问题"
            rules={[{ required: true, message: '请输入问题' }]}
          >
            <TextArea rows={4} placeholder="请输入需要澄清的问题" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="回答问题"
        open={answerModalVisible}
        onOk={() => answerForm.submit()}
        onCancel={() => {
          setAnswerModalVisible(false);
          answerForm.resetFields();
        }}
        width={600}
      >
        {currentQuestion && (
          <div>
            <Card size="small" title="问题" style={{ marginBottom: 16 }}>
              <p>{currentQuestion.question}</p>
            </Card>
            <Form
              form={answerForm}
              layout="vertical"
              onFinish={handleSubmitAnswer}
            >
              <Form.Item
                name="answer"
                label="回答"
                rules={[{ required: true, message: '请输入回答' }]}
              >
                <TextArea rows={6} placeholder="请输入问题的回答" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Questions;