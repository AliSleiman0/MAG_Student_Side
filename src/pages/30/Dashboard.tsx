import React from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Col, Row } from 'antd/lib/grid';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Space, Typography } from 'antd';
import Card from 'antd/lib/card/Card';
import DonutChart from '../../components/antvDonutChart';
import CoursesList from '../../components/CoursesList';
import BarChart from '../../components/antvBarChart';
import styled from 'styled-components';
import { useResponsive } from '../../hooks/useResponsive';
//$env:NODE_OPTIONS = "--openssl-legacy-provider"; yarn start
const { } = Typography;

const Dashboard: React.FC = () => {
    //$env:NODE_OPTIONS = "--openssl-legacy-provider"; yarn start
    const { isDesktop } = useResponsive();
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
                fontSize: '10px',
            }
        }
    };
    const stats = [
        { title: t('courses.completed_vs_required.title') , completed: 8, total: 12, key: "something" },
        { title: t('courses.passed_percentage.title'), completed: 5, total: 50, key: "percentage" },
        { title: t('courses.credits.title'), completed: 5, total: 7, key: "something" }
    ];
    const data = [
        { grade: 'A', count: 8 },
        { grade: 'B', count: 5 },
        { grade: 'C', count: 5 },
        { grade: 'D', count: 8 },
        { grade: 'F', count: 8 },
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
                                {t('welcome.title')}{' '}{t('welcome.semester_fall')}{'. '}{t('welcome.registration')} {' '}
                                <span style={{
                                    color: true ? '#038b94' : '#cf1322', // Ant Design success/danger colors
                                    fontWeight: 500
                                }}>
                                    {true ? t('welcome.reg_status_open') : t('welcome.reg_status_closed')}
                                </span>
                                {t('welcome.contact')}
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
                        <HoverableDiv>
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
                        </HoverableDiv>
                    </Col>
                ))}
            </Row>
            <br />
            <Row >

                <Col

                    xs={24}    // Full width on mobile
                    sm={24}    // Full width on small tablets
                    md={24}    // 2 per row on tablets
                    lg={24}     // 3 per row on desktops
                    xl={24}
                    style={{ display: 'flex' }}
                >
                    <HoverableDiv2>
                        <Card
                            title={t("grades.distribution")}

                            style={{
                                width: '100%',
                                padding: "20px",
                                minHeight: '400px', // Consistent card height
                                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                            }}
                        >
                            <BarChart
                                data={data}
                            />
                        </Card>
                    </HoverableDiv2>
                </Col>

            </Row>
            <br /><br />
            <Divider style={{ borderColor: '#038b94' }}>{t("courses.my_courses") }</Divider>
            <br />
            <Row>

                <CoursesList />
            </Row>
          
        </>
    );
};
const HoverableDiv = styled.div`
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: none;
      width: 100%;
  &:hover {
    transform: scale(1.01);
    box-shadow: 0 10px 20px rgba(3, 139, 148, 0.3);
  }
`;
const HoverableDiv2 = styled.div`
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: none;
      width: 100%;
  &:hover {
   
    box-shadow: 0 10px 20px rgba(3, 139, 148, 0.3);
  }
`;
export default Dashboard;
