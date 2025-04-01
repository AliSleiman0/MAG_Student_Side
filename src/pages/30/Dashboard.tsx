import React from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Col, Row } from 'antd/lib/grid';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Space, Typography } from 'antd';
import Card from 'antd/lib/card/Card';
import DonutChart from '../../components/antvDonutChart';
import CoursesList from '../../components/CoursesList';

const {  } = Typography;

const Dashboard: React.FC = () => {
   
    const { t } = useTranslation();
    const bannerStyles = {
        banner: {
            backgroundColor: '#e3faf8', // Subtle grey matching Ant Design's palette
            padding: '16px 24px',
            borderRadius: '8px',
            width: '100%',
        },
        icon: {
            fontSize: '20px',
            color: '#038b94', // Medium grey for contrast
        },
        text: {
            fontSize: '16px',
            color: '#262626', // Dark grey for readability
        },
        responsiveText: {
            '@media (max-width: 768px)': {
                fontSize: '14px',
            }
        }
    };
    const stats = [
        { title: 'Courses Completed to Graduate', completed: 8, total: 12, key:"something" },
        { title: 'Courses Passed/Courses Taken', completed: 5, total: 50, key:"percentage"},
        { title: 'Credits Completed', completed: 5, total: 7, key: "something" }
    ];
    return (
        <>
            <PageTitle>{t('common.dashboard')}</PageTitle>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <div style={bannerStyles.banner}>
                        <Space align="center">
                            {/* Info icon */}
                            <InfoCircleOutlined style={bannerStyles.icon} />

                            {/* Dynamic content */}
                            <Typography.Text
                                style={{ ...bannerStyles.text, ...bannerStyles.responsiveText }}
                            >
                                Welcome back! It's Fall semester. Registration is currently {' '}
                                <span style={{
                                    color: true ? '#038b94' : '#cf1322', // Ant Design success/danger colors
                                    fontWeight: 500
                                }}>
                                    {true ? 'OPEN' : 'CLOSED'}
                                </span>
                                . {13 > 0 ? `View ${13} available courses` : 'No courses currently available'}
                            </Typography.Text>
                        </Space>
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify="space-between">
                {stats.map((stat, index) => (
                    <Col
                        key={index}
                        xs={24}    // Full width on mobile
                        sm={24}    // Full width on small tablets
                        md={24}    // 2 per row on tablets
                        lg={7}     // 3 per row on desktops
                        xl={7}
                        style={{ display: 'flex' }} 
                    >
                        <Card
                            title={stat.title}
                            
                            style={{
                                width: '100%',
                                minHeight: '400px', // Consistent card height
                                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                            }}
                        >
                            <DonutChart
                                completed={stat.completed}
                                total={stat.total}
                                height={300} // Fixed chart height
                                kkey={stat.key}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <br/><br/>
            <Divider style={{ borderColor: '#038b94' }}>My Courses</Divider>
            <br />
            <Row>
                <CoursesList />
            </Row>
        </>
    );
};

export default Dashboard;
