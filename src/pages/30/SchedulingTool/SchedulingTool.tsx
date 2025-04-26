import { Modal, Row, Col, Typography, Space, Button, Card, Form, Input, TimePicker, FormInstance } from 'antd';
import { useMemo, useState } from 'react';
import { BookOutlined, BuildOutlined, CalendarOutlined, ClockCircleOutlined, ControlOutlined, DeleteOutlined, DownCircleTwoTone, DragOutlined, EditOutlined, ImportOutlined, InfoCircleOutlined, PlusOutlined, ReadOutlined, ScheduleOutlined, ThunderboltOutlined, ToolOutlined, WarningFilled, WarningOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useResponsive } from '../../../hooks/useResponsive';
import AcademicCalendar from '../../../components/AcademicCalendar';
import PlannerTypeModal from '../../../components/ PlannerTypeModal';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '../../../components/common/PageTitle/PageTitle';
import IconButton from '../../../components/IconButton';
import Banner from '../../../components/Banner';
import './SchedulingTool.styles.css';
import EmptyCourseCard from '../../../components/EmptyCourseCard';
import EventButton from '../../../components/EventButton';
import moment, { Moment } from 'moment';
import { S } from '@fullcalendar/core/internal-common';
import type { RangeValue } from 'rc-picker/lib/interface';
import DaysButton from '../../../components/DaysButton';
interface CalendarEvent {
    title: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    color?: string;
    professor?: string;
}


interface BreakFormValues {
    description: string;
    timeRange: [Moment, Moment];
}
export default function SchedulingTool() {
    const { RangePicker } = TimePicker;

    // Memoize disabled hours calculation
    const disabledHours = useMemo(() => {
        const hours = [];
        // Disable hours before 8AM (0-7)
        for (let i = 0; i < 8; i++) hours.push(i);
        // Disable hours after 5PM (17-23)
        for (let i = 18; i < 24; i++) hours.push(i);
        return hours;
    }, []);

    // Memoize static times
    const minTime = useMemo(() => moment().set({ hour: 7, minute: 59 }), []);
    const maxTime = useMemo(() => moment().set({ hour: 17, minute: 0 }), []);

    const [breaks, setBreaks] = useState<CalendarEvent[]>([]);

    const [isModalBreaksVisible, setIsModalBreaksVisible] = useState(false);
    const [form] = Form.useForm();
    const { mobileOnly, isTablet } = useResponsive();
    const [plannerType, setPlannerType] = useState<"Manual" | "Smart" | "">("");
    const [plannerTypeModalVisible, setPlannerTypeModalVisible] = useState<boolean>(true);
    const [courseModalVisible, setCourseModalVisible] = useState<boolean>(false);
    const [SourceType, setSourceType] = useState<"CUS" | "AUTO" | "">("");
    const [editingPlanner, setEditingPlanner] = useState(false);
    const [shouldFlash, setShouldFlash] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [conflictingEvent, setConflictingEvent] = useState<CalendarEvent | null>(null);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [pendingBreak, setPendingBreak] = useState<CalendarEvent | null>(null);
    const courses = [
        {
            title: "Math Class",
            professor: "Prof. Smith",
            daysOfWeek: [1, 3],
            startTime: "08:00",
            endTime: "09:15",
            color: 'linear-gradient(150deg, #038b94 0%, #036956 100%)',
        },
        {
            title: "Science Lab",
            professor: "Prof. Smith",
            daysOfWeek: [2, 4],
            startTime: "09:30",
            endTime: "10:45",
            color: 'linear-gradient(150deg, #038b94 0%, #036956 100%)',
        },
    ];
    const handleFlashButton = () => {
        setShouldFlash(true);
        setTimeout(() => setShouldFlash(false), 3000);
    };
    const handlePlannerSelect = (type: "Manual" | "Smart") => {
        setPlannerType(type);
        setPlannerTypeModalVisible(false);
    };
    const handleSourceSelect = (type: "CUS" | "AUTO") => {
        setSourceType(type);
        setCourseModalVisible(false);
    };
    const checkForConflicts = (newEvent: CalendarEvent, existingEvents: CalendarEvent[]): CalendarEvent | null => {
        const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const newDays = new Set(newEvent.daysOfWeek);
        const newStart = timeToMinutes(newEvent.startTime);
        const newEnd = timeToMinutes(newEvent.endTime);

        for (const existingEvent of existingEvents) {
            // Check day overlap
            const hasDayOverlap = existingEvent.daysOfWeek.some(day => newDays.has(day));
            if (!hasDayOverlap) continue;

            // Check time overlap
            const existingStart = timeToMinutes(existingEvent.startTime);
            const existingEnd = timeToMinutes(existingEvent.endTime);

            if (newStart < existingEnd && existingStart < newEnd) {
                return existingEvent;
            }
        }
        return null;
    };
    const handleAddBreak = () => {
        form.validateFields().then(values => {
            const { timeRange, description, days } = values;
            const [startMoment, endMoment] = timeRange;

            const newBreak: CalendarEvent = {
                title: description,
                startTime: startMoment.format('HH:mm'),
                endTime: endMoment.format('HH:mm'),
                daysOfWeek: days,
                color: 'linear-gradient(130deg, #bf0a37, #850122)',
            };

            // Check for conflicts with existing events
            const conflict = checkForConflicts(newBreak, [...courses, ...breaks]);

            if (conflict) {
                setConflictingEvent(conflict);
                setPendingBreak(newBreak);
                setShowConflictModal(true);
            } else {
                setBreaks(prev => [...prev, newBreak]);
                setIsModalBreaksVisible(false);
                form.resetFields();
            }
        });
    };

    // Modified handleQuickConstraint function
    const handleQuickConstraint = (
        startTime: string,
        endTime: string,
        description: string,
        daysOfWeek?: number[]
    ) => {
        const newBreak: CalendarEvent = {
            title: description,
            startTime,
            endTime,
            daysOfWeek: daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
            color: 'linear-gradient(130deg, #bf0a37, #850122)',
        };

        // Check for conflicts with existing events
        const conflict = checkForConflicts(newBreak, [...courses, ...breaks]);

        if (conflict) {
            setConflictingEvent(conflict);
            setPendingBreak(newBreak);
            setShowConflictModal(true);
        } else {
            setBreaks(prev => [...prev, newBreak]);
        }
    };
    const handleDeleteBreak = (index: number) => {
        setBreaks(prev => prev.filter((_, i) => i !== index));
    };
    const { t } = useTranslation();

    return (
        <>
            <PageTitle>{t('common.Scheduling_Tool')}</PageTitle>
            <Modal
                style={{ zIndex: 4000 }}
                title={null}
                open={showConflictModal}
                onOk={() => {
                    if (pendingBreak) setBreaks(prev => [...prev, pendingBreak]);
                    setShowConflictModal(false);
                    setConflictingEvent(null);
                    setPendingBreak(null);
                    setIsModalBreaksVisible(false);
                }}
                onCancel={() => {
                    setShowConflictModal(false);
                    setConflictingEvent(null);
                    setPendingBreak(null);
                }}
                footer={null}
                centered
                closable={false}

            >
                {/* Custom Header */}
                <div style={{
                    background: 'linear-gradient(211.49deg, #014145 15.89%, #038b94 48.97%)',
                    padding: '24px',
                    margin: '-24px -24px 24px -24px',

                    position: 'relative'
                }}>
                    <WarningFilled style={{
                        fontSize: '32px',
                        color: '#e3faf8',
                        position: 'absolute',
                        right: 24,
                        top: 24
                    }} />
                    <Typography.Title
                        level={3}
                        style={{
                            color: '#e3faf8',
                            margin: 0,
                            fontWeight: 600
                        }}
                    >
                        Schedule Conflict
                    </Typography.Title>
                </div>

                {/* Conflict Content */}
                {conflictingEvent && (
                    <div style={{ padding: '0 16px' }}>
                        <div style={{
                            backgroundColor: '#e3faf8',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px',
                            border: '1px solid rgba(4, 139, 148, 0.15)'
                        }}>
                            <Typography.Text strong style={{ color: '#4a8f94', display: 'block', marginBottom: 8 }}>
                                ⚠️ Conflicting With:
                            </Typography.Text>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr',
                                gap: '8px',
                                alignItems: 'center'
                            }}>
                                <CalendarOutlined style={{ color: '#038b94' }} />
                                <Typography.Text strong style={{ color: '#038b94' }}>
                                    {conflictingEvent.title}
                                </Typography.Text>

                                <ClockCircleOutlined style={{ color: '#4a8f94' }} />
                                <Typography.Text style={{ color: '#4a8f94' }}>
                                    {conflictingEvent.startTime} - {conflictingEvent.endTime}
                                </Typography.Text>

                                <ScheduleOutlined style={{ color: '#4a8f94' }} />
                                <Typography.Text style={{ color: '#4a8f94' }}>
                                    {conflictingEvent.daysOfWeek
                                        .map(day => moment().day(day).format('ddd'))
                                        .join(', ')}
                                </Typography.Text>
                            </div>
                        </div>

                        {/* Resolution Options */}
                        <Typography.Title
                            level={5}
                            style={{
                                color: '#038b94',
                                marginBottom: 16,
                                fontWeight: 500
                            }}
                        >
                            Available Options
                        </Typography.Title>

                        <div style={{
                            display: 'grid',
                            gap: '12px',
                            marginBottom: 32
                        }}>
                            {[
                                { icon: <EditOutlined />, text: 'Adjust new time constraint' },
                                { icon: <DeleteOutlined />, text: 'Remove existing event first' },

                            ].map((option, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: index === 2 ? 'rgba(255, 77, 79, 0.08)' : 'transparent',
                                        border: index === 2 ? '1px solid rgba(255, 77, 79, 0.2)' : 'none'
                                    }}
                                >
                                    <span style={{ color: index === 2 ? '#ff4d4f' : '#4a8f94' }}>
                                        {option.icon}
                                    </span>
                                    <Typography.Text
                                        style={{
                                            color: index === 2 ? '#ff4d4f' : '#4a8f94',
                                            fontWeight: index === 2 ? 500 : 400
                                        }}
                                    >
                                        {option.text}
                                    </Typography.Text>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            borderTop: '1px solid rgba(4, 139, 148, 0.1)',
                            paddingTop: '24px'
                        }}>
                            <IconButton
                                onClick={() => {
                                    setShowConflictModal(false);
                                    setConflictingEvent(null);
                                    setPendingBreak(null);
                                }}

                                text="Confirm"
                            />



                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                title="Add Break"
                open={isModalBreaksVisible}

                onOk={handleAddBreak}
                onCancel={() => setIsModalBreaksVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={(_, allValues) => {
                        if (allValues.days) {
                            setSelectedDays(allValues.days);
                        }
                    }}
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="days"
                        label="Select Days"
                        rules={[{ required: true, message: 'Please select at least one day' }]}
                        initialValue={[]}
                    >
                        <Row gutter={[8, 8]}>
                            {[1, 2, 3, 4, 5].map(day => (
                                <Col key={day}>
                                    <DaysButton
                                        text={moment().day(day).format("ddd")}
                                        onClick={() => {
                                            const currentDays = form.getFieldValue('days') || [];
                                            const newDays = currentDays.includes(day)
                                                ? currentDays.filter(d => d !== day)
                                                : [...currentDays, day];
                                            form.setFieldsValue({ days: newDays });
                                            setSelectedDays(newDays); // Directly update state
                                        }}
                                        isSelected={selectedDays.includes(day)} // Use state instead of form value
                                        style={{ marginBottom: 8 }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Item>
                    <Form.Item
                        name="timeRange"
                        label="Time Range"
                        rules={[
                            { required: true, message: 'Please select time range' },
                            ({ getFieldValue }) => ({
                                validator(_, value: RangeValue<Moment>) {
                                    if (!value?.[0] || !value?.[1]) {
                                        return Promise.reject(new Error('Please select both start and end times'));
                                    }

                                    const [start, end] = value;

                                    // Use pre-memoized times
                                    if (start.isBefore(minTime)) {
                                        return Promise.reject(new Error('Start time cannot be before 8:00 AM'));
                                    }
                                    if (end.isAfter(maxTime)) {
                                        return Promise.reject(new Error('End time cannot be after 5:00 PM'));
                                    }
                                    if (!start.isBefore(end)) {
                                        return Promise.reject(new Error('End time must be after start time'));
                                    }

                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <RangePicker
                            format="HH:mm"
                            minuteStep={15}
                            style={{ width: '100%' }}
                            disabledTime={() => ({
                                disabledHours: () => disabledHours,
                                disabledMinutes: (selectedHour) => {
                                    if (selectedHour === 17) {
                                        return Array.from({ length: 60 }, (_, i) => i);
                                    }
                                    return [];
                                }
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
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

                                            <IconButton icon={<ImportOutlined />} className={`${shouldFlash ? 'flash-highlight' : ''}`} text="Import Courses" onClick={() => { setCourseModalVisible(prev => !prev); }} />
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
                            <Row style={{ marginBottom: "16px", marginTop: "8px" }}>
                                <Col style={{ width: "100%" }}>
                                    <Card
                                        title={
                                            <>
                                                <Row style={{ marginBottom: "7px" }}>
                                                    <Typography.Text>Choose Courses Offerings</Typography.Text>
                                                </Row>
                                                <Row >
                                                    <Space style={{ borderRadius: "20px", color: "#0b58b8", backgroundColor: "#cae0fa", fontSize: "10px", padding: "6px", fontWeight: "bold", paddingLeft: "9px", paddingRight: "9px" }}>
                                                        <ToolOutlined style={{ fontSize: "12px" }} />
                                                        Manual Selection Mode
                                                    </Space>
                                                </Row>
                                            </>
                                        } style={{ width: "100%", borderLeft: "4px solid #038b94" }}>
                                        <EmptyCourseCard onClick={handleFlashButton} />
                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "15px" }}>
                                <Col style={{ width: "100%" }}>
                                    <Card title={
                                        <Row justify="space-between">
                                            <Col>
                                                <Typography.Text>Time Constraints</Typography.Text>
                                            </Col>
                                            <Col>
                                                <IconButton icon={<PlusOutlined />} text="Add Break" onClick={() => setIsModalBreaksVisible(true)} />
                                            </Col>
                                        </Row>
                                    } style={{ width: "100%", borderLeft: "4px solid #038b94" }}>
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
                                                                    {`${breakItem.startTime} - ${breakItem.endTime} (${breakItem.daysOfWeek
                                                                        .map(day => moment().day(day).format('ddd'))
                                                                        .join(', ')})`}
                                                                </Typography.Text>
                                                            </Col>
                                                            <Col>
                                                                <DeleteOutlined
                                                                    onClick={() => handleDeleteBreak(index)}
                                                                    style={{
                                                                        color: '#ff4d4f',
                                                                        cursor: 'pointer',
                                                                        fontSize: '16px',
                                                                        transition: 'color 0.3s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff7875'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.color = '#ff4d4f'}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Space>
                                            )}
                                        </Row>
                                        <Row>Quick Restrictions</Row>
                                        <Row gutter={[16, 8]} style={{ marginTop: "10px" }}>
                                            <Col><EventButton text="No Evening Classes (3-5 PM)" onClick={() => handleQuickConstraint('15:00', '17:00', 'No Evening Classes', [1, 2, 3, 4, 5, 6],)} /></Col>
                                            <Col><EventButton text="No Morning Classes (8-10 PM)" onClick={() => handleQuickConstraint('08:00', '10:45', 'No Morning Classes', [1, 2, 3, 4, 5, 6])} /></Col>
                                            <Col><EventButton text="Lunch Break (12-1 PM)" onClick={() => handleQuickConstraint('12:00', '13:00', 'Lunch Break', [1, 2, 3, 4, 5, 6])} /></Col>
                                            <Col><EventButton text="No Wednesday Classes" onClick={() => handleQuickConstraint('00:00', '23:59', 'No Wednesday Classes', [3])} /></Col>
                                            <Col><EventButton text="No Friday Classes" onClick={() => handleQuickConstraint('00:00', '23:59', 'No Friday Classes', [5])} /></Col>
                                        </Row>
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
                                                className={`${shouldFlash ? 'flash-highlight' : ''}`}

                                            />
                                        </Space>
                                    </Col>
                                )}
                            </Row>
                            <Row justify="end" align="top">
                                <Col>

                                    <AcademicCalendar
                                        mobileOnly={mobileOnly}
                                        events={[...courses, ...breaks]}
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
                    <Row justify="space-evenly" style={{ marginBottom: "10px", }} gutter={[8, 8]}>
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