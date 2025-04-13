import React from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Col, Row } from 'antd/lib/grid';
import { BookOutlined, CalendarOutlined, CreditCardOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, Divider, List, Space, Typography } from 'antd';
import Card from 'antd/lib/card/Card';
import DonutChart from '../../components/antvDonutChart';
import CoursesList from '../../components/CoursesList';
import BarChart from '../../components/antvBarChart';
import styled from 'styled-components';
import { useResponsive } from '../../hooks/useResponsive';
//$env:NODE_OPTIONS = "--openssl-legacy-provider"; yarn start
const { } = Typography;

const AutoPOS: React.FC = () => {
    //$env: NODE_OPTIONS = "--openssl-legacy-provider"; yarn start

    const { t } = useTranslation();


    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ];

    return (
        <>
            <PageTitle>{t('Automated POS')}</PageTitle>

            <Collapse
                activeKey={[1]}
                expandIcon={() => null}
                style={{ backgroundColor: "#e3faf8", borderLeft: "4px solid #038b94" }}
            >
                <Collapse.Panel
                    key="1"
                    header={
                        <Row justify="space-between" >
                            <Col>
                                <Row  style={{ marginBottom:"10px" }}>
                                  
                                    <Col>Spring 2004</Col>
                                </Row>
                                <Row>

                                    <Space size="large">
                                        <Col style={{ backgroundColor: "#cae8e6", borderRadius: 30, padding: "5px", paddingLeft: "12px", paddingRight: "12px" }}  >

                                            <CalendarOutlined style={{ color: '#038b94', fontSize: '18px',marginRight:"5px" }} />
                                            <span style={{ fontSize: '16px' }}>17 credits</span>
                                        </Col>
                                        <Col style={{ backgroundColor: "#cae8e6", borderRadius: 30, padding: "5px", paddingLeft: "12px", paddingRight: "12px", }}  >

                                            <BookOutlined style={{ color: '#038b94', fontSize: '18px', marginRight: "5px" }} />
                                            <span style={{ fontSize: '16px' }}>17 credits</span>
                                        </Col>
                                    </Space>

                                </Row>
                            </Col>
                            <Col style={{ borderRadius: 30, padding: "5px", paddingLeft: "12px", paddingRight: "12px", maxHeight: "fit-content" }}  >
                                <span style={{ fontSize: '16px' }}>Upcoming</span>
                            </Col>
                        </Row>}

                >
                    <Row justify="space-between">
                        <Col>
                            <Row gutter={[5, 0]}>
                                <Col>icon</Col>
                                <Col>CENG400</Col>
                            </Row>
                            <Row>MicroController Course</Row>
                        </Col>
                        <Col style={{ paddingTop: "10px" }}>
                            col
                        </Col>
                    </Row>

                </Collapse.Panel>
            </Collapse>
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

export default AutoPOS;
