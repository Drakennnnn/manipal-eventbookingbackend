"use client";

import { useState, useEffect } from 'react';
import { Layout, Select, Typography, Card, Button, Row, Col, message } from 'antd';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '../services/firebase';
import { saveTicketData } from '../services/ticketservice';

const { Content } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;

// Sample ticket codes for each event
const ticketCodes = {
  'Football Tournament': 'FT2024-8765',
  'Open Mic Night': 'OMN2024-4321',
  'Food Carnival': 'FC2024-9876',
  'Dance Event': 'DE2024-5432',
  'Basketball League': 'BL2024-1098',
  'DJ Night': 'DJ2024-7654'
};

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

export default function RegisterPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        message.info('Please login to register for events');
        router.push('/auth');
      }
    });

    const eventFromUrl = searchParams.get('event');
    if (eventFromUrl) {
      const event = eventsData.find(e => e.title === eventFromUrl);
      if (event) {
        setSelectedEvent(event);
      }
    }

    return () => unsubscribe();
  }, [searchParams]);

  const handleEventSelect = (value) => {
    const event = eventsData[value];
    setSelectedEvent(event);
    setTicketCode('');
    setIsRegistered(false);
  };

  const handleRegister = () => {
    if (!user) {
      message.info('Please login to register for events');
      router.push('/auth');
      return;
    }

    if (selectedEvent) {
      // Save to localStorage and get ticket code
      const code = ticketCodes[selectedEvent.title];
      setTicketCode(code);
      setIsRegistered(true);
      
      // Save to localStorage
      const ticketData = {
        ticketCode: code,
        eventTitle: selectedEvent.title,
        userEmail: user.email,
        userName: user.email.split('@')[0],
        purchaseDate: new Date().toISOString(),
      };
      
      // Get existing tickets or initialize empty array
      const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      existingTickets.push(ticketData);
      localStorage.setItem('tickets', JSON.stringify(existingTickets));
      
      message.success('Registration successful!');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      message.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      message.error('Logout failed');
    }
  };

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
      {/* Top Part with background */}
      <div style={{
        backgroundImage: 'url(/mahe.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '300px',
        position: 'relative',
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
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push('/')}>
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
              <Button type="link" style={{ color: '#fff' }} onClick={() => router.push('/auth')}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Content */}
      <Content style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <Title level={2}>Event Registration</Title>
          <div style={{ marginBottom: '20px' }}>
            <Text strong>Select Event</Text>
            <Select
              style={{ width: '100%', marginTop: '10px' }}
              placeholder="Choose an event to register"
              value={selectedEvent ? eventsData.findIndex(e => e.title === selectedEvent.title) : undefined}
              onChange={handleEventSelect}
            >
              {eventsData.map((event, index) => (
                <Option key={index} value={index}>
                  {event.title} - {event.date}
                </Option>
              ))}
            </Select>
          </div>

          {selectedEvent && (
            <Card style={{ marginTop: '20px' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                {/* Centered Event Image */}
                <div style={{ 
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                </div>

                {/* Event Details */}
                <div style={{ 
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <Title level={4}>{selectedEvent.title}</Title>
                  <Text>Category: {selectedEvent.category}</Text><br />
                  <Text>Location: {selectedEvent.location}</Text><br />
                  <Text>Date: {selectedEvent.date}</Text><br />
                  
                  {!isRegistered ? (
                    <Button 
                      type="primary" 
                      style={{ marginTop: '20px' }}
                      onClick={handleRegister}
                    >
                      Register for Event
                    </Button>
                  ) : (
                    <div style={{ 
                      marginTop: '20px',
                      padding: '20px',
                      backgroundColor: '#f0f8ff',
                      borderRadius: '8px',
                      textAlign: 'center',
                      maxWidth: '400px',
                      margin: '0 auto'
                    }}>
                      <Title level={4} style={{ color: '#52c41a' }}>
                        Registration Successful!
                      </Title>
                      <Text strong>Your Ticket Code:</Text>
                      <div style={{
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '1px dashed #ccc',
                        marginTop: '10px',
                        fontSize: '18px',
                        fontFamily: 'monospace'
                      }}>
                        {ticketCode}
                      </div>
                      <Text type="secondary" style={{ display: 'block', marginTop: '10px' }}>
                        Event: {selectedEvent.title}<br/>
                        Registered Email: {user.email}<br/>
                        Please save this code. You'll need it at the event.
                      </Text>
                      <Button 
                        type="primary"
                        style={{ marginTop: '20px' }}
                        onClick={() => router.push('/')}
                      >
                        Back to Events
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </Card>

        {/* Important Information Section */}
        <div style={{ marginTop: '40px' }}>
          <Title level={2}>Important Information</Title>
          <Row gutter={[24, 24]} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <Image
                    src="/college.jpg"
                    alt="college"
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title="College Overview"
                  description=""
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <Image
                    src="/acad.jpg"
                    alt="acad"
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title="ACAD & Amphitheater"
                  description=""
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <Image
                    src="/hb.jpg"
                    alt="hb&sports"
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title="HB3 & Sports"
                  description=""
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12}>
              <Card
                hoverable
                cover={
                  <Image
                    src="/gmap1.png"
                    alt="google map"
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title="Google Map Gate 2 and Gate 3"
                  description=""
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12}>
              <Card
                hoverable
                cover={
                  <Image
                    src="/gmap2.png"
                    alt="google map"
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title="Google Map Acad and others"
                  description=""
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}