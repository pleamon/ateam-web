import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, List, Tag, Typography } from 'antd';
import { FileTextOutlined, QuestionCircleOutlined, BookOutlined, ApartmentOutlined, BulbOutlined, ReadOutlined } from '@ant-design/icons';
import { documentAPI } from '@/services/document';
import { history } from 'umi';

const { Title, Paragraph } = Typography;

const DocumentOverview: React.FC = () => {
  const [stats, setStats] = useState({
    documentation: 0,
    requirements: 0,
    questions: 0,
    domainKnowledge: 0,
    architecture: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    fetchDocumentStats();
    fetchRecentDocuments();
  }, []);

  const fetchDocumentStats = async () => {
    try {
      const response = await documentAPI.getStats();
      if (response.success && response.data) {
        // 后端只返回文档的统计，其他类型暂时设为0
        setStats({
          documentation: response.data.totalDocs || 0,
          requirements: 0, // 后端暂未提供
          questions: 0, // 后端暂未提供
          domainKnowledge: 0, // 后端暂未提供
          architecture: 0, // 后端暂未提供
        });
      }
    } catch (error) {
      console.error('获取文档统计失败:', error);
      // 如果失败，使用默认值
      setStats({
        documentation: 0,
        requirements: 0,
        questions: 0,
        domainKnowledge: 0,
        architecture: 0,
      });
    }
  };

  const fetchRecentDocuments = async () => {
    // 获取最近的文档
    try {
      const response = await documentAPI.list({ limit: 10 });
      if (response.success) {
        setRecentDocs(response.data || []);
      }
    } catch (error) {
      console.error('获取文档失败:', error);
    }
  };

  const documentTypes = [
    {
      title: '项目文档',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      count: stats.documentation,
      color: '#1890ff',
      path: '/docs/documentation',
      description: '项目相关的技术文档、设计文档等',
    },
    {
      title: '需求管理',
      icon: <ReadOutlined style={{ fontSize: 24 }} />,
      count: stats.requirements,
      color: '#52c41a',
      path: '/docs/requirements',
      description: '产品需求、功能规格说明',
    },
    {
      title: '需求问答',
      icon: <QuestionCircleOutlined style={{ fontSize: 24 }} />,
      count: stats.questions,
      color: '#faad14',
      path: '/docs/questions',
      description: '需求澄清和问答记录',
    },
    {
      title: '领域知识',
      icon: <BookOutlined style={{ fontSize: 24 }} />,
      count: stats.domainKnowledge,
      color: '#722ed1',
      path: '/docs/domain',
      description: '业务领域知识和最佳实践',
    },
    {
      title: '系统架构',
      icon: <ApartmentOutlined style={{ fontSize: 24 }} />,
      count: stats.architecture,
      color: '#eb2f96',
      path: '/docs/architecture',
      description: '系统架构设计和技术选型',
    },
  ];

  const getDocTypeTag = (type: string) => {
    const typeMap = {
      overview: { color: 'blue', text: '概览' },
      technical: { color: 'green', text: '技术' },
      design: { color: 'orange', text: '设计' },
      research: { color: 'purple', text: '研究' },
      other: { color: 'default', text: '其他' },
    };
    const config = typeMap[type] || typeMap.other;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <PageContainer>
      <Card>
        <Title level={4}>
          <BulbOutlined /> 文档中心
        </Title>
        <Paragraph>
          集中管理项目的所有文档资料，包括技术文档、需求文档、领域知识和系统架构等。
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {documentTypes.map((type) => (
          <Col key={type.title} span={8}>
            <Card
              hoverable
              onClick={() => history.push(type.path)}
              style={{ height: '100%' }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ color: type.color }}>{type.icon}</div>
                <Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
                  {type.title}
                </Title>
              </div>
              <Statistic
                value={type.count}
                suffix="篇"
                style={{ textAlign: 'center' }}
              />
              <Paragraph
                type="secondary"
                style={{ marginTop: 16, marginBottom: 0, fontSize: 12 }}
              >
                {type.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="最近文档" style={{ marginTop: 16 }}>
        <List
          dataSource={recentDocs}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                getDocTypeTag(item.type),
                <a key="view" onClick={() => history.push(`/docs/documentation`)}>
                  查看
                </a>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`${item.project?.name || '未分配项目'} • ${new Date(
                  item.createdAt
                ).toLocaleDateString()}`}
              />
            </List.Item>
          )}
          locale={{ emptyText: '暂无文档' }}
        />
      </Card>
    </PageContainer>
  );
};

export default DocumentOverview;