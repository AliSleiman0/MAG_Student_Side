import { Row, Col, Typography, Space, Card, Form, TimePicker, Switch } from 'antd';
import { useMemo, useState } from 'react';
import { CalendarOutlined, DownloadOutlined, ImportOutlined, ToolOutlined } from '@ant-design/icons';
import { useResponsive } from '../../../hooks/useResponsive';
import AcademicCalendar from '../../../components/AcademicCalendar';
import PlannerTypeModal from '../../../components/ PlannerTypeModal';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '../../../components/common/PageTitle/PageTitle';
import IconButton from '../../../components/IconButton';
import Banner from '../../../components/Banner';
import './SchedulingTool.styles.css';
import EmptyCourseCard from '../../../components/EmptyCourseCard';
import moment from 'moment';
import { ConflictModal } from '../../../components/TimeConflictModal';
import { AddBreakModal } from '../../../components/AddBreakModal';
import BreaksCard from '../../../components/BreaksCard';
import { CourseOpenedForRegistation } from '../CustomizedPOS/CustomizedPOS';

import CourseCard from '../../../components/CourseOfferingCard';
import styled from 'styled-components';
import CourseCardOfferingSmart, { CourseSection } from '../../../components/CourseCardOfferingSmart';
// ====================== Interfaces ======================
/** 
 * Represents a calendar event with scheduling details
 * Used for both courses and breaks in the calendar
 */
export interface CalendarEvent {
    title: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    color?: string;
    borderColor?: string;
    professor?: string;
}

/**
 * Defines course structure with multiple section offerings
 * Contains core course information and available sections
 */
interface Course {
    id: string;
    code: string;
    name: string;
    credits: number;
    sections: {
        id: string;
        name: string;
        schedule: string;
        daysOfWeek: number[];
        startTime: string;
        endTime: string;
        instructor: string;
    }[];
}
const permanentCourses = [{
    id: 'math151',
    code: 'MATH 151',
    name: 'Calculus I',
    credits: 4,
    sections: [{
        id: 'section1',
        name: 'Section 1',
        schedule: 'Mon/Wed/Fri: 8:00-9:50',
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        startTime: '8:00',
        endTime: '9:50',
        instructor: 'Prof. Taylor'
    },
    {
        id: 'section2',
        name: 'Section 2',
        schedule: 'Tue/Thu: 11:00-12:30',
        daysOfWeek: [2, 4],
        startTime: '11:00',
        endTime: '12:30',
        instructor: 'Prof. Smith'
    },
    {
        id: 'section3',
        name: 'Section 3',
        schedule: 'Tue/Thu: 11:00-12:30',
        daysOfWeek: [2, 4],
        startTime: '11:00',
        endTime: '12:30',
        instructor: 'Prof. Ahmad'
    }]
}, {
    id: 'math101',
    code: 'MATH 101',
    name: 'Calculus II',
    credits: 4,
    sections: [{
        id: 'section1',
        name: 'Section 1',
        schedule: 'Mon/Wed/Fri: 12:00-13:50',
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        startTime: '12:00',
        endTime: '13:50',
        instructor: 'Prof. Taylor'
    },
    {
        id: 'section2',
        name: 'Section 2',
        schedule: 'Tue/Thu: 16:00-16:50',
        daysOfWeek: [2, 4],
        startTime: '16:00',
        endTime: '16:50',
        instructor: 'Prof. Smith'
    }]
}];

export default function SchedulingTool() {
    const [showCourses, setShowCourses] = useState(true); // Default to showing courses
    // ====================== State Management ======================
    // Schedule constraints and breaks
    const [breaks, setBreaks] = useState<CalendarEvent[]>([]);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    // Modal visibility states
    const [isModalBreaksVisible, setIsModalBreaksVisible] = useState(false);
    const [plannerTypeModalVisible, setPlannerTypeModalVisible] = useState(true);
    const [courseModalVisible, setCourseModalVisible] = useState(false);

    // UI/UX states
    const [plannerType, setPlannerType] = useState<"Manual" | "Smart" | "">("");
    const [editingPlanner, setEditingPlanner] = useState(false);
    const [shouldFlash, setShouldFlash] = useState(false);

    // Conflict detection states
    const [conflictingEvent, setConflictingEvent] = useState<CalendarEvent | null>(null);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [pendingBreak, setPendingBreak] = useState<CalendarEvent | null>(null);
    const [pendingSection, setPendingSection] = useState<{ courseId: string; sectionId: string } | null>(null);

    // Course selection state
    const [selectedSections, setSelectedSections] = useState<Record<string, string>>({});

    const [SourceType, setSourceType] = useState<"CUS" | "AUTO" | "">("");
    // ====================== Smart starts here Functionality ======================
    const [selectedPrefferedSections, setSelectedPrefferedSections] = useState<CourseSection>();
    // ====================== Core Functionality ======================
    /** Convert course sections to calendar events */
    const calendarEventsToBeAdded = permanentCourses.flatMap(course => {
        const selectedSectionId = selectedSections[course.id];
        const section = course.sections.find(s => s.id === selectedSectionId);
        return section ? [{
            title: course.code,
            startTime: section.startTime,
            endTime: section.endTime,
            daysOfWeek: section.daysOfWeek,
            professor: section.instructor,
            color: 'rgba(185, 250, 227, 0.6)'
        }] : [];
    });

    /** Handle section selection with conflict checking */
    const handleSectionChange = (courseId: string, sectionId: string) => {
        const course = permanentCourses.find(c => c.id === courseId);
        const section = course?.sections.find(s => s.id === sectionId);

        if (!section) return;

        // Create calendar event for the new section
        const newEvent: CalendarEvent = {
            title: course!.code,
            startTime: section.startTime,
            endTime: section.endTime,
            daysOfWeek: section.daysOfWeek,
            professor: section.instructor
        };

        // Check for conflicts with existing events
        const conflict = checkForConflicts(newEvent, [...calendarEventsToBeAdded, ...breaks]);

        if (conflict) {
            setConflictingEvent(conflict);
            setPendingSection({ courseId, sectionId });
            setShowConflictModal(true);
        } else {
            // No conflict - update immediately
            setSelectedSections(prev => ({
                ...prev,
                [courseId]: sectionId
            }));
        }
    };

    // ====================== Event Handlers ======================
    /** UI interaction handlers */
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

    /** Break management functions */
    const handleAddBreak = () => {
        form.validateFields().then(values => {
            const { timeRange, description, days } = values;
            const [startMoment, endMoment] = timeRange;

            const newBreak: CalendarEvent = {
                title: description,
                startTime: startMoment.format('HH:mm'),
                endTime: endMoment.format('HH:mm'),
                daysOfWeek: days,
                color: '#fab9b980',
                borderColor: "#bf0a37"
            };

            // Check for conflicts with existing events
            const conflict = checkForConflicts(newBreak, [...calendarEventsToBeAdded, ...breaks]);

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
            color: '#fab9b980',
            borderColor: "#bf0a37"
        };

        // Check for conflicts with existing events
        const conflict = checkForConflicts(newBreak, [...breaks, ...calendarEventsToBeAdded]);

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

    /** Conflict detection logic */
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
    const [form] = Form.useForm();
    const { mobileOnly, isTablet } = useResponsive();
    const { t } = useTranslation();

    return (
        <>
            <PageTitle>{t('common.Scheduling_Tool')}</PageTitle>
            {/* ====================== Modals ====================== */}
            {/* Offering Conflict Resolution Modal */}
            <ConflictModal
                showConflictModal={showConflictModal}
                conflictingEvent={conflictingEvent}
                pendingBreak={null} // Explicitly set to null for section conflicts
                setShowConflictModal={setShowConflictModal}
                setConflictingEvent={setConflictingEvent}
                setPendingBreak={() => { }} // Empty function for section conflicts
                setBreaks={setBreaks}
                setIsModalBreaksVisible={setIsModalBreaksVisible}
            />
            {/* Break Conflict Resolution Modal */}
            <ConflictModal
                showConflictModal={showConflictModal}
                conflictingEvent={conflictingEvent}
                pendingBreak={pendingBreak}
                setShowConflictModal={setShowConflictModal}
                setConflictingEvent={setConflictingEvent}
                setPendingBreak={setPendingBreak}
                setBreaks={setBreaks}
                setIsModalBreaksVisible={setIsModalBreaksVisible}
            />
            {/* Break Management Modal */}
            <AddBreakModal
                isModalBreaksVisible={isModalBreaksVisible}
                selectedDays={selectedDays}
                form={form}

                setIsModalBreaksVisible={setIsModalBreaksVisible}
                setSelectedDays={setSelectedDays}
                handleAddBreak={handleAddBreak}
            />
            {/* Planner Selection Modals */}
            <PlannerTypeModal
                edit={editingPlanner}
                open={plannerTypeModalVisible}
                mobileOnly={mobileOnly}
                onPlannerSelect={handlePlannerSelect}
                onCancel={() => setPlannerTypeModalVisible(false)}
                modalCoursesSource={false}
            />
            {/* Course Importing Selection Modals */}
            <PlannerTypeModal
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
            {(!plannerTypeModalVisible) ? (
                <>

                    <Row align="top" gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8}  >
                            {mobileOnly && (
                                <Row style={{ marginBottom: "8px", marginTop: "8px", }} gutter={[4, 16]}>
                                    <Col flex="none">
                                        <Space size={8}>
                                            <IconButton icon={<CalendarOutlined />} text="Switch Planner Type" onClick={() => { setPlannerTypeModalVisible(prev => !prev); setEditingPlanner(true); }} />

                                            <IconButton icon={<ImportOutlined />} className={`${shouldFlash ? 'flash-highlight' : ''}`} text="Import Courses" onClick={() => { setCourseModalVisible(prev => !prev); }} />
                                            {plannerType != "Manual" && <IconButton icon={<DownloadOutlined />} text={'Generate Schedule'} onClick={() => console.log("doNothing")} />}
                                        </Space >
                                    </Col>
                                </Row>)}
                            <Row style={{ marginBottom: "8px", marginTop: "8px" }}>
                                <Col style={{ width: "100%" }}>
                                    <Banner
                                        color={{ background: '#e3faf8', icon: '#038b94' }}
                                        text={
                                            plannerType === "Manual"
                                                ? "This is the manual schedule tool. You may select only one offering per course. Time conflicts will trigger warnings, and you may add descriptive breaks to customize your weekly schedule."
                                                : "This is Smart Scheduling mode. It automatically optimizes your timetable based on your preferences. Mark sections (doctors, course offerings) as preferred or excluded, and the system will find the best combination with the fewest gaps between courses. Note that user-added breaks take top priority and will override course sections in case of time conflicts."
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "16px", marginTop: "8px" }}>
                                {plannerType == "Manual" ? (
                                    <Col style={{ width: "100%" }}>
                                        <HoverableDiv>
                                            <Card
                                                title={
                                                    <>
                                                        <Row style={{ marginBottom: "7px" }}>
                                                            <Typography.Text>Choose Courses Offerings</Typography.Text>
                                                        </Row>
                                                        <Row>
                                                            <Space
                                                                style={{
                                                                    borderRadius: "20px",
                                                                    color: "#0b58b8",
                                                                    backgroundColor: "#cae0fa",
                                                                    fontSize: "10px",
                                                                    padding: "6px",
                                                                    fontWeight: "bold",
                                                                    paddingLeft: "9px",
                                                                    paddingRight: "9px",
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <ToolOutlined style={{ fontSize: "12px" }} />
                                                                Manual Selection Mode
                                                            </Space>
                                                        </Row>
                                                    </>
                                                }
                                                style={{ width: "100%", borderLeft: "4px solid #038b94" }}
                                            >
                                                {showCourses ? (
                                                    permanentCourses.map((course: Course) => (
                                                        <CourseCard
                                                            key={course.id}
                                                            course={course}
                                                            selectedSectionId={selectedSections[course.id]}
                                                            onSectionChange={handleSectionChange}
                                                        />
                                                    ))
                                                ) : (
                                                    <EmptyCourseCard onClick={handleFlashButton} />
                                                )}
                                            </Card>
                                        </HoverableDiv>
                                    </Col>
                                ) : (<Col style={{ width: "100%" }}>
                                    <HoverableDiv>
                                        <Card
                                            title={
                                                <>
                                                    <Row style={{ marginBottom: "7px" }}>
                                                        <Typography.Text>Choose Preferences</Typography.Text>
                                                    </Row>
                                                    <Row>
                                                        <Space
                                                            style={{
                                                                borderRadius: "20px",
                                                                color: "#7e0bb8",
                                                                backgroundColor: "#e7cafa",
                                                                fontSize: "10px",
                                                                padding: "6px",
                                                                fontWeight: "bold",
                                                                paddingLeft: "9px",
                                                                paddingRight: "9px",
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <ToolOutlined style={{ fontSize: "12px" }} />
                                                            Smart Selection Mode
                                                        </Space>
                                                    </Row>
                                                </>
                                            }
                                            style={{ width: "100%", borderLeft: "4px solid #038b94" }}
                                        >
                                            {showCourses ? (
                                                permanentCourses.map((course: Course) => (
                                                    <CourseCardOfferingSmart
                                                        key={course.id}
                                                        course={course}
                                                        selectedSectionId={selectedSections[course.id]}
                                                    />
                                                ))
                                            ) : (
                                                <EmptyCourseCard onClick={handleFlashButton} />
                                            )}
                                        </Card>
                                    </HoverableDiv>
                                </Col>
                                )}
                            </Row>
                            <BreaksCard
                                breaks={breaks}
                                onAddBreak={() => setIsModalBreaksVisible(true)}
                                onDeleteBreak={handleDeleteBreak}
                                onQuickConstraint={handleQuickConstraint}
                            />
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
                                            fontSize: mobileOnly ? 16 : 20,
                                        }}
                                    >
                                        {plannerType} Weekly Schedule:
                                    </Typography.Text>
                                </Col>

                                {/* Buttons grouped on the right, only if on tablet+ */}
                                {isTablet && (
                                    <Col flex="none" >
                                        <Space size={8}>
                                            {plannerType != "Manual" && <IconButton icon={<DownloadOutlined />} text={'Generate Schedule'} onClick={() => console.log("doNothing")} />}
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
                                        events={[...calendarEventsToBeAdded, ...breaks]}
                                    />
                                    <Switch
                                        checked={showCourses}
                                        onChange={setShowCourses}
                                        checkedChildren="Visible"
                                        unCheckedChildren="Hidden"
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
} const HoverableDiv = styled.div`
  transition: all 0.3s ease;
  border-radius:12px;
  box-shadow: none;
      width: 100%;
  &:hover {
    box-shadow: 0 10px 20px rgba(3, 139, 148, 0.3);
  }
`;