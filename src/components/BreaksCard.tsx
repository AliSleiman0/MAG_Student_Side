import React from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import IconButton from './IconButton'; // adjust path
import EventButton from './EventButton'; // adjust path

interface BreakItem {
    title: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
}

interface BreaksCardProps {
    breaks: BreakItem[];
    onAddBreak: () => void;
    onDeleteBreak: (index: number) => void;
    onQuickConstraint: (start: string, end: string, title: string, days: number[]) => void;
}

const BreaksCard: React.FC<BreaksCardProps> = ({ breaks, onAddBreak, onDeleteBreak, onQuickConstraint }) => {
    return (
        <Row style={{ marginBottom: "15px" }}>
            <Col style={{ width: "100%" }}>
                <Card
                    title={
                        <Row justify="space-between">
                            <Col>
                                <Typography.Text>Time Constraints</Typography.Text>
                            </Col>
                            <Col>
                                <IconButton icon={<PlusOutlined />} text="Add Break" onClick={onAddBreak} />
                            </Col>
                        </Row>
                    }
                    style={{ width: "100%", borderLeft: "4px solid #038b94" }}
                >
                    <Row justify="center" style={{ color: "#4a8f94", marginBlock: "20px" }}>
                        {breaks.length === 0 ? (
                            "No time constraint added"
                        ) : (
                            <Space direction="vertical" style={{ width: '100%', maxWidth: '600px' }}>
                                {breaks.map((breakItem, index) => (
                                    <Row
                                        key={index}
                                        align="middle"
                                        justify="space-between"
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '4px',
                                            width: '100%'
                                        }}
                                    >
                                        <Col>
                                            <Typography.Text strong>{breakItem.title}</Typography.Text>
                                            <Typography.Text type="secondary" style={{ marginLeft: 16 }}>
                                                {`${breakItem.startTime} - ${breakItem.endTime} (${[1, 2, 3, 4, 5].every(d => breakItem.daysOfWeek.includes(d))
                                                        ? 'All Week'
                                                        : breakItem.daysOfWeek
                                                            .map(day => moment().day(day).format('ddd'))
                                                            .join(', ')
                                                    })`}
                                            </Typography.Text>
                                        </Col>
                                        <Col>
                                            <DeleteOutlined
                                                onClick={() => onDeleteBreak(index)}
                                                style={{
                                                    color: '#ff4d4f',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    transition: 'color 0.3s'
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = 'black')}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = '#ff4d4f')}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                            </Space>
                        )}
                    </Row>

                    <Row>Quick Restrictions</Row>
                    <Row gutter={[16, 8]} style={{ marginTop: "10px" }}>
                        <Col><EventButton text="No Evening Classes (3-5 PM)" onClick={() => onQuickConstraint('15:00', '17:00', 'No Evening Classes', [1, 2, 3, 4, 5])} /></Col>
                        <Col><EventButton text="No Morning Classes (8-10 AM)" onClick={() => onQuickConstraint('08:00', '10:45', 'No Morning Classes', [1, 2, 3, 4, 5])} /></Col>
                        <Col><EventButton text="Lunch Break (12-1 PM)" onClick={() => onQuickConstraint('12:00', '13:00', 'Lunch Break', [1, 2, 3, 4, 5])} /></Col>
                        <Col><EventButton text="No Wednesday Classes" onClick={() => onQuickConstraint('08:00', '17:00', 'No Wednesday Classes', [3])} /></Col>
                        <Col><EventButton text="No Friday Classes" onClick={() => onQuickConstraint('08:00', '17:00', 'No Friday Classes', [5])} /></Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default BreaksCard;
