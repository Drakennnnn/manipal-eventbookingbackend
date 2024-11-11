"use client";

import { useState, useEffect } from 'react';
import { Layout, Select, Typography, Card, Button, Row, Col, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { User } from 'firebase/auth';

const { Content, Footer } = Layout;
const { Option } = Select;
const { Text } = Typography;

const locations = ['All', 'Sports Complex (Marena)', 'Hostel Block 3', 'Open Sports Area', 'ACAD Blocks', 'Amphitheater'];
const categories = ['All', 'Sports', 'Cultural', 'Food Fest', 'Seminars'];

const eventsData = [
  {
    title: 'Football Tournament',
    category: 'Sports',
    location: 'Sports Complex (Marena)',
    date: '2024-11-05',
    image: '/event1.jpg',
    ongoing: true,
  },
  {
    title: 'Open Mic Night',
    category: 'Cultural',
    location: 'Amphitheater',
    date: '2024-12-01',
    image: '/event2.jpg',
    ongoing: false,
  },
  {
    title: 'Food Carnival',
    category: 'Food Fest',
    location: 'Hostel Block 3',
    date: '2024-12-15',
    image: '/event3.jpg',
    ongoing: true,
  },
  {
    title: 'Dance Event',
    category: 'Cultural',
    location: 'ACAD Blocks',
    date: '2024-11-12',
    image: '/event4.jpg',
    ongoing: false,
  },
  {
    title: 'Basketball League',
    category: 'Sports',
    location: 'Open Sports Area',
    date: '2024-11-08',
    image: '/event5.jpg',
    ongoing: true,
  },
  {
    title: 'DJ Night',
    category: 'Cultural',
    location: 'Hostel Block 3',
    date: '2024-11-10',
    image: '/event6.jpg',
    ongoing: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      message.error('Logout failed');
    }
  };

  const handleEventRegistration = (eventTitle) => {
    if (!user) {
      message.info('Please login to register for events');
      router.push('/auth');
    } else {
      router.push(`/register?event=${encodeURIComponent(eventTitle)}`);
    }
  };

  const filteredEvents = eventsData.filter((event) => {
    return (
      (selectedLocation === 'All' || event.location === selectedLocation) &&
      (selectedCategory === 'All' || event.category === selectedCategory)
    );
  });

  const ongoingEvents = filteredEvents.filter((event) => event.ongoing);
  const upcomingEvents = filteredEvents.filter((event) => !event.ongoing);

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
      {/* Top Part of the Page */}
      <div style={{
        backgroundImage: 'url(/mahe.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '500px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/event.png" alt="Event Logo" width={40} height={40} />
            <Typography.Title level={5} style={{ color: '#fff', margin: '0 10px' }}>
              College Event Manager
            </Typography.Title>
          </div>
          <div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Text style={{ color: '#fff' }}>{user.email}</Text>
                <Button type="link" style={{ color: '#fff' }} onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button type="link" style={{ color: '#fff' }} onClick={() => router.push('/auth')}>
                  Login
                </Button>
                <Button type="link" style={{ color: '#fff' }} onClick={() => router.push('/auth')}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Dropdown Menus */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          borderRadius: '10px',
          margin: '0 auto 20px auto',
          width: 'auto',
        }}>
          <div>
            <Text strong>Location within Campus</Text>
            <Select
              defaultValue={selectedLocation}
              style={{ width: 200, marginLeft: '10px' }}
              onChange={(value) => setSelectedLocation(value)}
            >
              {locations.map((location) => (
                <Option key={location} value={location}>{location}</Option>
              ))}
            </Select>
          </div>
          <div>
            <Text strong>Categories</Text>
            <Select
              defaultValue={selectedCategory}
              style={{ width: 200, marginLeft: '10px' }}
              onChange={(value) => setSelectedCategory(value)}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <Content style={{ padding: '20px' }}>
        {/* Ongoing Events */}
        <Typography.Title level={3}>Ongoing Events</Typography.Title>
        <Row gutter={[16, 16]}>
          {ongoingEvents.map((event, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={<img alt={event.title} src={event.image} style={{ height: '200px', objectFit: 'cover' }} />}
              >
                <Typography.Title level={4}>{event.title}</Typography.Title>
                <Text>{event.category}</Text><br />
                <Text>{event.location}</Text><br />
                <Text strong>Date: {event.date}</Text><br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '10px' }}
                  onClick={() => handleEventRegistration(event.title)}
                >
                  Register Now
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Upcoming Events */}
        <Typography.Title level={3} style={{ marginTop: '40px' }}>Upcoming Events</Typography.Title>
        <Row gutter={[16, 16]}>
          {upcomingEvents.map((event, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={<img alt={event.title} src={event.image} style={{ height: '200px', objectFit: 'cover' }} />}
              >
                <Typography.Title level={4}>{event.title}</Typography.Title>
                <Text>{event.category}</Text><br />
                <Text>{event.location}</Text><br />
                <Text strong>Date: {event.date}</Text><br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '10px' }}
                  onClick={() => handleEventRegistration(event.title)}
                >
                  Register Now
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* How It Works Section */}
      <Content style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>How it Works for Students</Typography.Title>
        <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
          <Col span={8}>
            <div>
              <Typography.Title level={4}>1. Choose Event</Typography.Title>
              <Text>Signup, choose your favorite event.</Text>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Typography.Title level={4}>2. Get Tickets</Typography.Title>
              <Text>Get your tickets from the event page.</Text>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Typography.Title level={4}>3. Attend Event</Typography.Title>
              <Text>Go attend the event and have fun.</Text>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ backgroundColor: '#1f1f1f', color: '#fff', padding: '40px' }}>
        <Row gutter={[32, 32]}>
          <Col span={6}>
            <Typography.Title level={5} style={{ color: '#fff' }}>Useful Links</Typography.Title>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li>About</li>
              <li>Events</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </Col>
          <Col span={6}>
            <Typography.Title level={5} style={{ color: '#fff' }}>Social Connections</Typography.Title>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
              <li>LinkedIn</li>
            </ul>
          </Col>
          <Col span={6}>
            <Typography.Title level={5} style={{ color: '#fff' }}>Contact</Typography.Title>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li>Send us a message</li>
              <li>Find us on Map</li>
            </ul>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <Image src="/event.png" alt="Event Logo" width={100} height={100} />
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}