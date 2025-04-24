import { Modal, Row, Col, Typography } from 'antd';
import { useState } from 'react';
import { EditOutlined, ThunderboltOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useResponsive } from '../../hooks/useResponsive';
import AcademicCalendar from '../../components/AcademicCalendar';
import PlannerTypeModal from '../../components/ PlannerTypeModal';

export default function SchedulingTool() {
    const { mobileOnly } = useResponsive();
    const [plannerType, setPlannerType] = useState<"Manual" | "Smart" | "">("");
    const [plannerTypeModalVisible, setPlannerTypeModalVisible] = useState<boolean>(true);

    const handlePlannerSelect = (type: "Manual" | "Smart") => {
        setPlannerType(type);
        setPlannerTypeModalVisible(false);
    };

    return (
        <>
            <PlannerTypeModal
                open={plannerTypeModalVisible}
                mobileOnly={mobileOnly}
                onPlannerSelect={handlePlannerSelect}
                onCancel={() => setPlannerTypeModalVisible(false)}
            />
            {/* Main Content (only shown after selecting planner) */}
            {(!plannerTypeModalVisible && plannerType!="" ) && (
                <Row gutter={[0, 16]} justify="space-evenly" style={{ width: "100%" }}>
                    <Col md={24} lg={8} >
                        <Row>
                            <Col>list courses</Col>
                        </Row>
                        <Row>
                            <Col>list time constraint</Col>
                        </Row>
                    </Col>
                    <Col md={24} lg={16}>
                        <AcademicCalendar
                            mobileOnly={mobileOnly}
                            events={[
                                {
                                    title: "Math Class",
                                    professor: "Prof. Smith",
                                    daysOfWeek: [1, 3],
                                    startTime: "08:00",
                                    endTime: "09:15",
                                }, {
                                    title: "Science Lab",
                                    professor: "Prof. Smith",
                                    daysOfWeek: [2, 4],
                                    startTime: "09:30",
                                    endTime: "10:45",
                                }]}
                        />
                    </Col>
                </Row>
            )}
        </>
    )
}