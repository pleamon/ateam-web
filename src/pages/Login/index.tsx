import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import styles from './index.less';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { loginUser, loading } = useModel('user');

  const handleSubmit = async (values: any) => {
    await loginUser(values.username, values.password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <Title level={2}>ATeam 系统登录</Title>
            <Text type="secondary">AI 驱动的项目管理平台</Text>
          </div>
          
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名或邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>

            <div className={styles.footer}>
              <a href="/register">注册新账号</a>
              <a href="/forgot-password">忘记密码？</a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;