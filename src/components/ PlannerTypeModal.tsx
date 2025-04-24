// PlannerTypeModal.tsx
import React from 'react';
import { Modal, Row, Col, Typography, ModalProps } from 'antd';
import { EditOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type PlannerType = 'Manual' | 'Smart';

interface PlannerTypeModalProps extends Omit<ModalProps, 'title' | 'visible'> {
    /** Controls modal visibility */
    open: boolean;
    /** Whether the view is mobile-only */
    mobileOnly: boolean;
    /** Callback when a planner type is selected */
    onPlannerSelect: (type: PlannerType) => void;
}

const PlannerTypeModal: React.FC<PlannerTypeModalProps> = ({
    open,
    mobileOnly,
    onPlannerSelect,
    ...modalProps
}) => {
    // base style for each card
    const cardBaseStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, #f0fafa 0%, #ffffff 100%)',
        borderRadius: '12px',
        padding: mobileOnly ? 16 : 24,
        cursor: 'pointer',
        height: mobileOnly ? 160 : 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };

    return (
        <Modal
            title={
                <Title
                    style={{
                        color: '#038b94',
                        marginBottom: 0,
                        fontSize: mobileOnly ? 24 : 35,
                    }}
                >
                    Select Planner Type
                </Title>
            }
            open={open}
            footer={null}
            closable={false}
            centered
            width={mobileOnly ? '90%' : 800}
            bodyStyle={{
                padding: mobileOnly ? 12 : 24,
                background: 'transparent',
            }}
            maskStyle={{ background: 'rgba(255, 255, 255, 0.8)' }}
            {...modalProps}
        >
            <Row gutter={[mobileOnly ? 0 : 24, 24]} justify="space-between">
                {/* Custom Plan */}
                <Col span={mobileOnly ? 24 : 11} style={{ marginBottom: mobileOnly ? 16 : 0 }}>
                    <div
                        style={{ ...cardBaseStyle, border: '2px solid #038b94' }}
                        onClick={() => onPlannerSelect('Manual')}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <EditOutlined
                            style={{
                                fontSize: mobileOnly ? 32 : 48,
                                color: '#038b94',
                                marginBottom: 16,
                            }}
                        />
                        <Title level={mobileOnly ? 4 : 3} style={{ color: '#038b94', margin: 0 }}>
                            Custom Plan
                        </Title>
                        <Text
                            type="secondary"
                            style={{ textAlign: 'center', fontSize: mobileOnly ? 12 : 14 }}
                        >
                            Manually create and adjust your academic schedule
                        </Text>
                    </div>
                </Col>

                {/* Smart Planner */}
                <Col span={mobileOnly ? 24 : 11}>
                    <div
                        style={{ ...cardBaseStyle, border: '2px solid #036956' }}
                        onClick={() => onPlannerSelect('Smart')}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <ThunderboltOutlined
                            style={{
                                fontSize: mobileOnly ? 32 : 48,
                                color: '#036956',
                                marginBottom: 16,
                            }}
                        />
                        <Title level={mobileOnly ? 4 : 3} style={{ color: '#036956', margin: 0 }}>
                            Smart Planner
                        </Title>
                        <Text
                            type="secondary"
                            style={{ textAlign: 'center', fontSize: mobileOnly ? 12 : 14 }}
                        >
                            Automatically generate optimized schedules
                        </Text>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default PlannerTypeModal;
