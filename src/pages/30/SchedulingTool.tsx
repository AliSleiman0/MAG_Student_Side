import { Modal, Row, Col, Typography, Space, Button, Card } from 'antd';
import { useState } from 'react';
import { CalendarOutlined, EditOutlined, ImportOutlined, InfoCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useResponsive } from '../../hooks/useResponsive';
import AcademicCalendar from '../../components/AcademicCalendar';
import PlannerTypeModal from '../../components/ PlannerTypeModal';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';
import IconButton from '../../components/IconButton';
import Banner from '../../components/Banner';

export default function SchedulingTool() {
    const { mobileOnly, isTablet } = useResponsive();
    const [plannerType, setPlannerType] = useState<"Manual" | "Smart" | "">("");
    const [plannerTypeModalVisible, setPlannerTypeModalVisible] = useState<boolean>(true);
    const [courseModalVisible, setCourseModalVisible] = useState<boolean>(false);
    const [SourceType, setSourceType] = useState<"CUS" | "AUTO" | "">("");
    const [editingPlanner, setEditingPlanner] = useState(false);
    const handlePlannerSelect = (type: "Manual" | "Smart") => {
        setPlannerType(type);
        setPlannerTypeModalVisible(false);
    };
    const handleSourceSelect = (type: "CUS" | "AUTO") => {
        setSourceType(type);
        setCourseModalVisible(false);
    };

    const { t } = useTranslation();

    return (
        <>
            <PageTitle>{t('common.Scheduling_Tool')}</PageTitle>

            <PlannerTypeModal
                edit={editingPlanner}
                open={plannerTypeModalVisible}
                mobileOnly={mobileOnly}
                onPlannerSelect={handlePlannerSelect}
                onCancel={() => setPlannerTypeModalVisible(false)}
                modalCoursesSource={false}
            />
            <PlannerTypeModal // this modal is for importing courses from either customized or advanced POS
                open={courseModalVisible}
                edit={true}
                mobileOnly={mobileOnly}
                onCancel={() => setCourseModalVisible(false)}
                onSourceSelect={handleSourceSelect}
                titleText="Choose Courses Source"
                bannerText="Choose the courses you want to make a schedule with."
                manualTitle="Customized POS"
                manualDescription="Take control and make a schedule with your own courses previouly planned for the upcoming semester"
                smartTitle="Best POS"
                smartDescription="Let the system craft the best path for you using the optimal plan for the upcoming semester"
                modalCoursesSource={true}
            />
            {/* Main Content (only shown after selecting planner) */}
            {(!plannerTypeModalVisible && plannerType == "Manual") ? (
                <>

                    <Row align="top" gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8}  >
                            {mobileOnly && (
                                <Row style={{ marginBottom: "8px", marginTop: "8px", }} gutter={[4, 16]}>
                                    <Col flex="none">
                                        <Space size={8}>
                                            <IconButton icon={<CalendarOutlined />} text="Switch Planner Type" onClick={() => { setPlannerTypeModalVisible(prev => !prev); setEditingPlanner(true); }} />

                                            <IconButton icon={<ImportOutlined />} text="Import Courses" onClick={() => { setCourseModalVisible(prev => !prev); }} />
                                        </Space >
                                    </Col>
                                </Row>)}
                            <Row style={{ marginBottom: "8px", marginTop: "8px" }}>
                                <Col style={{ width: "100%" }}>
                                    <Banner
                                        color={{ background: '#e3faf8', icon: '#038b94' }}
                                        text="This is the manual schedule tool. You may select only one offering per course. Time conflicts will trigger warnings, and you may add descriptive breaks to customize your weekly schedule."
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "8px", marginTop: "8px" }}>
                                <Col style={{ width: "100%" }}>
                                    <Card title={<Typography.Text>Choose Courses Offerings</Typography.Text>} style={{ width: "100%", borderLeft: "4px solid #038b94" }}>
                                    
                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "15px" }}>
                                <Col style={{ width: "100%" }}>
                                    <Card title="Add Breaks" style={{ width: "100%", borderLeft: "4px solid #038b94" }}>
                                    
                                    </Card>
                                </Col>
                            </Row>


                        </Col>
                        <Col md={24} lg={16} >
                            <Row
                                justify="space-between"
                                align="bottom"
                                style={{ margin: '0 0 10px' }}
                            >
                                {/* Title always on the left */}
                                <Col flex="auto" >
                                    <Typography.Text
                                        style={{
                                            color: '#038b94',
                                            fontWeight: 'bold',
                                            fontSize: mobileOnly ? 20 : 25,
                                        }}
                                    >
                                        {plannerType} Weekly Schedule:
                                    </Typography.Text>
                                </Col>

                                {/* Buttons grouped on the right, only if on tablet+ */}
                                {isTablet && (
                                    <Col flex="none" >
                                        <Space size={8}>
                                            <IconButton
                                                icon={<CalendarOutlined />}
                                                text="Switch Planner Type"
                                                onClick={() => {
                                                    setPlannerTypeModalVisible(v => !v);
                                                    setEditingPlanner(true);
                                                }}
                                            />
                                            <IconButton
                                                icon={<ImportOutlined />}
                                                text="Import Courses"
                                                onClick={() => { setCourseModalVisible(prev => !prev); }}
                                            />
                                        </Space>
                                    </Col>
                                )}
                            </Row>
                            <Row justify="end" align="top">
                                <Col>

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
                        </Col>
                    </Row>
                </>
            ) : (!plannerTypeModalVisible) && (
                <>
                    <Row justify="end" style={{ marginBottom: "40px" }}>
                        <IconButton icon={<CalendarOutlined />} onClick={() => setPlannerTypeModalVisible(prev => !prev)} text="Select Planner Type" />
                    </Row>
                    <Row justify="space-evenly" style={{ marginBottom: "10px", }} gutter={[16, 16]}>

                        <Banner
                            text=" You did not choose a schedule planner type, please select one using the button above or reload the page for in-modal selection."
                        />


                    </Row >

                </>
            )
            }
        </>
    )
}