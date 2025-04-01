import { Card, Row, Col, Tag, Typography, Divider, Statistic } from 'antd';
import { BookOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

const { Title, Text } = Typography;

// Interface for Course Card component
interface CourseCardProps {
    courseName: string;
    grade?: string;
    semester: string;
    credits: number;
    textBottom?: string;
    textColor?: string;
    gradeColor?: string;
    iconBottom?: ReactNode;
    borderC?: string;
    canRegister?: boolean | null;
    
}

const CourseCard: React.FC<CourseCardProps> = ({
    courseName,
    grade = "Current",
    semester,
    credits,
    textBottom,
    textColor,
    gradeColor = '#52c41a',
    iconBottom = <BookOutlined />,
    canRegister=null,
    borderC = "#dedede",
}) => {
    const borderRaduisDynamic = grade == "Current" ? "10%" : "30%";
    return (
        <Card hoverable style={{ marginBottom: "10px", borderColor: borderC } }>
            <Card.Meta
                title={
                    <Row wrap={false} justify="space-between" align="middle" gutter={[16, 0]} style={{ width: '100%' }}>
                        <Col>
                            <Title style={{ margin: 0, fontSize: "0.9rem" }}>
                                {courseName}
                            </Title>
                        </Col>
                        <Col>
                            <Tag style={{
                                borderRadius:  borderRaduisDynamic ,
                                padding: '4px 8px',
                                backgroundColor: gradeColor,
                                color: "white",
                                border: "none"
                            }}>
                                {canRegister === null
                                    ? grade
                                    : (canRegister ? <UnlockOutlined style={{ color: "black", fontSize: "1.5rem" }} /> : <LockOutlined style={{ color: "black", fontSize: "1.5rem" }} />)}
                            </Tag>
                        </Col>
                    </Row>
                }
                description={
                    <div>
                        <Divider style={{ margin: '12px 0' }} />
                        <Row justify="space-between">
                            <Col><Text type="secondary">{semester}</Text></Col>
                            <Col>
                                <Statistic
                                    value={credits}
                                    suffix="Credits"
                                    valueStyle={{ fontSize: 14 }}
                                />
                            </Col>
                        </Row>
                        <Row align="middle" gutter={8} style={{ marginTop: 8 }}>
                            <Col>{iconBottom}</Col>
                            <Col><Text type="secondary" style={{ color: textColor } }>{textBottom}</Text></Col>
                        </Row>
                    </div>
                }
            />
        </Card>
    );
};
export default CourseCard