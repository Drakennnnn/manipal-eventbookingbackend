"use client";

import { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, message, Tabs } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../services/firebase';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

interface AuthFormValues {
  email: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: AuthFormValues) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      message.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: AuthFormValues) => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      message.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      message.error('Signup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div style={{
        backgroundImage: 'url(/mahe.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '10px',
        }}>
          <Image src="/event.png" alt="Event Logo" width={40} height={40} />
          <Title level={3} style={{ color: '#fff', margin: '0 10px' }}>
            College Event Manager
          </Title>
        </div>
      </div>

      <Content style={{ padding: '50px 20px' }}>
        <Card style={{ maxWidth: 400, margin: '0 auto' }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Login" key="login">
              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Login
                </Button>
              </Form>
            </TabPane>
            <TabPane tab="Sign Up" key="signup">
              <Form layout="vertical" onFinish={handleSignup}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, min: 6 }]}
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Sign Up
                </Button>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}