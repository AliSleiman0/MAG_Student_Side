import React, { useState } from 'react';
import { AppstoreOutlined, LaptopOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, ScheduleOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps, TableColumnsType } from 'antd';
import { Button, Card, Col, ConfigProvider, Layout, Menu, Row, Table } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { CourseData, Semester_AutoPOS } from '../../../components/Semester_AutoPOS';
import Modal from 'antd/lib/modal/Modal';
import Spin from 'antd/es/spin';
import './DynamicPOS.styles.css';
import Typography from 'antd/lib/typography/Typography';
import { useResponsive } from '../../../hooks/useResponsive';
import MobileSiderMenu from '../../../components/sider_DPOS_xs';
import { useTranslation } from 'react-i18next';
const { Content, Sider } = Layout;
interface Corerequisite {
    courseid: number;
    prerequisitecourseid: number;
    corerequisiteid: number | null;
    created_at: string;
    updated_at: string;
}

export interface Course {
    courseid: number;
    coursename: string;
    coursecode: string | null;
    coursetype: string;
    credits: number;
    corerequisites?: Corerequisite[];
    postrequisitFor?: number;
    score: number;
    priority?: number | null
}

export interface Semester {
    semester: string,
    year?: string,
    courses: Course[],
    totalCredits?: number;
}

const CourseOpenedForRegistation: Course[] = [
    {
        "courseid": 107,
        "coursename": "Database Systems",
        "coursecode": "CS203",
        "coursetype": "Major",
        "credits": 3,
        "corerequisites": [

        ],
        "postrequisitFor": 2,
        "score": 6
    },
    {
        "courseid": 109,
        "coursename": "Operating Systems",
        "coursecode": "CS205",
        "coursetype": "Core",
        "credits": 4,
        "corerequisites": [

        ],
        "postrequisitFor": 1,
        "score": 6
    },
    {
        "courseid": 111,
        "coursename": "Artificial Intelligence",
        "coursecode": "CS301",
        "coursetype": "Major",
        "credits": 4,
        "corerequisites": [

        ],
        "postrequisitFor": 2,
        "score": 6
    },
    {
        "courseid": 108,
        "coursename": "Computer Networks",
        "coursecode": "CS204",
        "coursetype": "Major",
        "credits": 3,
        "corerequisites": [

        ],
        "postrequisitFor": 1,
        "score": 5
    },
    {
        "courseid": 113,
        "coursename": "Computer Graphics",
        "coursecode": "CS303",
        "coursetype": "Major",
        "credits": 3,
        "corerequisites": [

        ],
        "postrequisitFor": 1,
        "score": 5
    },
    {
        "courseid": 119,
        "coursename": "Capstone Project I",
        "coursecode": "CS401",
        "coursetype": "Major",
        "credits": 3,
        "corerequisites": [

        ],
        "postrequisitFor": 1,
        "score": 5
    },
    {
        "courseid": 110,
        "coursename": "Software Engineering",
        "coursecode": "CS206",
        "coursetype": "Major",
        "credits": 3,
        "corerequisites": [],
        "postrequisitFor": 0,
        "score": 4
    },
    {
        "courseid": 129,
        "coursename": "Ethics in Computing",
        "coursecode": "CS411",
        "coursetype": "Major",
        "credits": 2,
        "corerequisites": [],
        "postrequisitFor": 0,
        "score": 4
    },
    {
        "courseid": 125,
        "coursename": "Blockchain Technology",
        "coursecode": "CS407",
        "coursetype": "Major Elective",
        "credits": 3,
        "corerequisites": [],
        "postrequisitFor": 0,
        "score": 3
    },
    {
        "courseid": 127,
        "coursename": "Virtual Reality",
        "coursecode": "CS409",
        "coursetype": "Major Elective",
        "credits": 3,
        "corerequisites": [],
        "postrequisitFor": 0,
        "score": 3
    }
];
//].map(course => ({
//    ...course,
//    key: course.courseid // Ant Design requires unique keys
//}));
var DynamicSemesters: Semester[] = [
    {
        "semester": "Fall",
        "courses": [
            {
                "courseid": 107,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 2,
                "score": 6
            },
            {
                "courseid": 109,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Core",
                "credits": 4,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 6
            },
            {
                "courseid": 111,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 4,
                "corerequisites": [

                ],
                "postrequisitFor": 2,
                "score": 6
            },
            {
                "courseid": 108,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 5
            },
            {
                "courseid": 113,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 5
            },
            {
                "courseid": 110,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [],
                "postrequisitFor": 0,
                "score": 4
            }
        ]
    },
    {
        "semester": "Spring",
        "courses": [
            {
                "courseid": 112,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 4,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 5
            },
            {
                "courseid": 114,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 4
            },
            {
                "courseid": 129,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 2,
                "corerequisites": [],
                "postrequisitFor": 0,
                "score": 4
            },
            {
                "courseid": 116,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            },
            {
                "courseid": 118,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 4,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            },
            {
                "courseid": 122,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            }
        ]
    },
    {
        "semester": "Fall",
        "courses": [
            {
                "courseid": 119,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 5
            },
            {
                "courseid": 127,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [],
                "postrequisitFor": 0,
                "score": 3
            },
            {
                "courseid": 115,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 4
            },
            {
                "courseid": 117,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 4
            },
            {
                "courseid": 121,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            },
            {
                "courseid": 125,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [],
                "postrequisitFor": 0,
                "score": 3
            }]
    },
    {
        "semester": "Spring",
        "courses": [
            {
                "courseid": 112,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 4,
                "corerequisites": [

                ],
                "postrequisitFor": 1,
                "score": 5
            },
            {
                "courseid": 114,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 4
            },
            {
                "courseid": 129,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major",
                "credits": 2,
                "corerequisites": [],
                "postrequisitFor": 0,
                "score": 4
            },
            {
                "courseid": 116,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            },
            {
                "courseid": 118,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 4,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            },
            {
                "courseid": 122,
                "coursename": "Database Systems",
                "coursecode": "CS203",
                "coursetype": "Major Elective",
                "credits": 3,
                "corerequisites": [

                ],
                "postrequisitFor": 0,
                "score": 3
            }
        ]
    },
];
//create priorities based on score
const calculatePriorities = (courses: Course[]): Course[] => {
    // 1. Clone and sort by score (descending) and courseid (ascending for tie-breaker)
    const sorted = [...courses].sort((a, b) => {
        // First sort by score descending
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        // For equal scores, sort by courseid ascending
        return a.courseid - b.courseid;
    });

    // 2. Assign sequential priorities
    const priorityMap = new Map<number, number>();
    sorted.forEach((course, index) => {
        // Priority starts at 1 and increments by 1 for each course
        priorityMap.set(course.courseid, index + 1);
    });

    // 3. Merge priorities while preserving original order
    return courses.map(course => ({
        ...course,
        priority: priorityMap.get(course.courseid)!
    }));
};
const processedData = calculatePriorities(CourseOpenedForRegistation).map(course => ({
    ...course,
    key: course.courseid
}));
// Add temporary console log
console.log("Processed Data:", processedData);

const computeAcademicYears = (semesters: any[], baseYear: number) => {
    let currentYear = baseYear;
    let hasFallOccurred = false;

    return semesters.map((semester, index) => {
        // Calculate academic year based on sequence
        const academicYear = () => {
            if (semester.semester === 'Fall') {
                hasFallOccurred = true;
                return `${currentYear}-${currentYear + 1}`;
            }

            if (semester.semester === 'Spring' && hasFallOccurred) {
                const year = `${currentYear}-${currentYear + 1}`;
                currentYear++;
                hasFallOccurred = false;
                return year;
            }

            return `${currentYear}-${currentYear + 1}`;
        };

        return {
            ...semester,
            year: academicYear()
        };
    });
};

DynamicSemesters = computeAcademicYears(DynamicSemesters, new Date().getFullYear());

const DynamicPOS: React.FC = () => {
    const { t } = useTranslation();
    const translateCourseType = (courseType: string) => {
        return t(`courses.course_types.${courseType}` as any) as string;
    };
    const columns: TableColumnsType<Course> = [
        {

            title: t("customised_pos.priority"),
            key: 'priority',
            dataIndex: 'priority',
            // Original score remains hidden but used for sorting
            sorter: (a, b) => b.score - a.score, // Maintain score-based sorting
            render: (priority) => priority || 'Not ranked',
            // Visual styling for priority
            className: 'priority-column',
            align: 'center',
            width: '5%'
        },
        {
            title: t("customised_pos.course_name"),
            dataIndex: 'coursename',
            key: 'coursename',
            filterSearch: true,
            width: '25%'
        },
        {
            title: t("customised_pos.code"),
            dataIndex: 'coursecode',
            key: 'coursecode',
            width: '5%',
            render: (code: string | null) => code || 'N/A' // Handle null values
        },
        {
            title: t("customised_pos.type"),
            dataIndex: 'coursetype',
            key: 'coursetype',
            width: '5%',
            filters: [
                {
                    text: 'Core', value: t('courses.course_types.Core')
                },
                { text: 'Major', value: t('courses.course_types.Major') },
                { text: 'Major Elective', value: t('courses.course_types.Major Elective') },
                { text: 'General Requirement', value: t('courses.course_types.General Requirement') },
                { text: 'General Elective', value: t('courses.course_types.General Elective') }
            ],
            onFilter: (value, record) => record.coursetype === value,
            render: (text: string) => translateCourseType(text),
        },
        {
            title: t("customised_pos.credits"),
            dataIndex: 'credits',
            key: 'credits',
            width: '5%',
            sorter: (a, b) => a.credits - b.credits
        },

    ];
    const [semesters, setSemesters] = useState<Semester[]>(DynamicSemesters);
    const [isGeneratedSemesters, setIsGeneratedSemesters] = useState(false);
    const [isFullViewSemesters, setIsFullViewSemesters] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<Semester>(DynamicSemesters[0]);

    const totalCredits =
        selectedSemester?.courses.reduce((sum, c) => sum + c.credits, 0) ?? 0;

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [shouldFlash, setShouldFlash] = useState(false);
    const handleGenerateSemesters = () => {
        setIsLoadingGenerate(true);
        setTimeout(() => {
            setIsLoadingGenerate(false);
            setIsGeneratedSemesters(true);
            setShowConfirmation(false);
            setShouldFlash(true);
            setTimeout(() => setShouldFlash(false), 3000);
        }, 2000);
    };

    const handleFullViewToggle = () => {
        setIsFullViewSemesters(state => !state);
    };


    const handleSemesterSelect = (semester: Semester) => {
        setSelectedSemester(semester);
        const totalCredits = semester.courses.reduce((sum, c) => sum + c.credits, 0);
        setIsFullViewSemesters(false);
    };
    const isFirstSemester = selectedSemester === semesters[0];
    const { isTablet, mobileOnly, tabletOnly, desktopOnly, isDesktop } = useResponsive();
   
    return (

        <Layout style={{ background: '#e7f2f3' }}>

            <Modal
                title={t("customised_pos.modal_title_generate")}
                style={{ marginTop: "50px" }}
                open={showConfirmation}
                onCancel={() => setShowConfirmation(false)}
                footer={[
                    <Button key="back" onClick={() => setShowConfirmation(false)}>
                        {t("customised_pos.cancel")}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleGenerateSemesters}
                        disabled={isLoadingGenerate}
                    >
                        {isLoadingGenerate ? <Spin /> : t("customised_pos.confirm")}
                    </Button>,
                ]}
            >
                <div style={{ textAlign: 'center' }}>
                    {isLoadingGenerate ? (
                        <p>{t("customised_pos.creating_your_optimal_semester_plan")}</p>
                    ) : (
                            <p>{t("customised_pos.modal_text_generate_dynamic")}</p>
                    )}
                </div>
            </Modal>

            {(!isFullViewSemesters && isDesktop && isGeneratedSemesters) && (
                <Sider
                    width={280}
                    style={{ height: 'fitContent', background: '#e7f2f3', borderRight: 0 }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['current']}
                        className="semester-navigation-menu"
                        style={{
                            background: '#f5f7fa',
                            borderRight: 0,
                            //marginTop: shouldCollapseSider ? 48 : 0
                        }}
                    >
                        {/* Current Semester Item */}
                        {semesters?.[0] && (
                            <Menu.Item
                                key="current-semester"
                                icon={<ScheduleOutlined />}
                                onClick={() => handleSemesterSelect(semesters[0])}
                                className="current-semester-item"
                            >
                                {semesters[0].semester == "Fall" ? t("welcome.semester_fall") : semesters[0].semester == "Spring" ? t("welcome.semester_spring") : t("welcome.semester_summer")} {semesters[0].year}
                            </Menu.Item>
                        )}

                        {/* Generated Semesters Submenu */}
                        {isGeneratedSemesters && (
                            <SubMenu
                                key="generated-semesters"
                                icon={<AppstoreOutlined />}
                                title={t("customised_pos.generated_semesters")}
                                className={`generated-semesters-submenu ${shouldFlash ? 'flash-highlight' : ''}`}
                            >
                                {semesters?.slice(1).map((sem, index) => (
                                    <Menu.Item
                                        key={`generated-semester-${index}`}
                                        onClick={() => handleSemesterSelect(sem)}
                                        className="generated-semester-item"
                                    >
                                        {sem.semester == "Fall" ? t("welcome.semester_fall") : sem.semester == "Spring" ? t("welcome.semester_spring") : t("welcome.semester_summer")} {sem.year}
                                    </Menu.Item>
                                ))}
                            </SubMenu>
                        )}
                    </Menu>
                </Sider>
            )}
            {(mobileOnly || tabletOnly) && (
                <MobileSiderMenu
                    semesters={semesters}
                    handleSemesterSelect={handleSemesterSelect}
                    isGeneratedSemesters={isGeneratedSemesters}
                    shouldFlash={shouldFlash}
                    title={t("customised_pos.generated_semesters")}
                />
            )}



            <Layout style={{ background: '#f5f7fa', position: "relative" }}>

                <div style={{
                    display: 'flex',
                    justifyContent: mobileOnly ? 'flex-start' : 'flex-end',
                    width: "100%",

                    marginTop: mobileOnly ? "5px" : ""
                }}>
                    {isGeneratedSemesters && (
                        <Button
                            style={{
                                zIndex: 444,
                                width: mobileOnly ? '190px' : '30%',
                                position: "absolute",
                                fontSize: mobileOnly ? '0.6rem' : '1rem'
                            }}
                            className={shouldFlash ? 'flash-highlight' : ''}
                            onClick={handleFullViewToggle}
                        >
                            {isFullViewSemesters ? t("customised_pos.collapse_view") : t("customised_pos.show_full_timeline")}
                        </Button>
                    )}
                    {!isGeneratedSemesters && (
                        <Button
                            onClick={() => setShowConfirmation(true)}
                            style={{
                                background: '#038b94',
                                color: 'white',
                                zIndex: 444,
                                width: mobileOnly ? '190px' : '30%',
                                position: "absolute",
                                flexWrap: "wrap",
                                fontSize: mobileOnly ? '0.6rem' : '1rem',

                            }}
                        >
                            {t("customised_pos.generate_remaining_semesters")}
                        </Button>
                    )}
                </div>

                <Content style={{ padding: '24px', margin: 0, marginTop: mobileOnly ? "36px" : "" }}>
                    {(!isFullViewSemesters && isFirstSemester) &&
                        <Typography
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                marginBottom: "10px",
                                color: '#084C61',
                                letterSpacing: '0.5px',

                            }}
                        >
                            {t("customised_pos.courses_eligible_for_registration_below")}
                        </Typography>
                    }
                    {isFullViewSemesters ? (
                        <div style={{ margin: '0 auto' }}>
                            <Row gutter={[150, 48]}>
                                {semesters?.map((semester, index) => {
                                    const totalCredits = semester.courses.reduce((sum, c) => sum + c.credits, 0);
                                    return (
                                        <Col key={index} xs={24} md={12} lg={12}>
                                            <SemesterDetailView
                                                title={`Best Plan for ${selectedSemester.semester == "Fall" ? t("welcome.semester_fall") : selectedSemester.semester == "Spring" ? t("welcome.semester_spring") : t("welcome.semester_summer")} - ${semester.year}`}
                                                credits={totalCredits}
                                                courseList={semester.courses}
                                                Upcoming={index === 0 ? t("customised_pos.upcoming") : ""}
                                            />

                                        </Col>);
                                })}
                            </Row>
                        </div>
                    ) : selectedSemester ? (
                        (() => {
                            // 1. Derive once, use strict equality:

                                const translateCourseType = (courseType: string) => {
                                    return t(`course_types.${courseType}` as any) as string;
                                };
                            return (
                                <Row gutter={[16, 16]}>
                                    {isFirstSemester ? (
                                        <>
                                            <Col span={16} xs={24} md={24} lg={24} xl={16} >

                                                <Table<Course>
                                                    components={{
                                                        header: {
                                                            cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                                                                <th
                                                                    {...props}
                                                                    style={{
                                                                        backgroundColor: '#e3faf8',
                                                                        color: '#000',
                                                                    }}
                                                                />
                                                            ),
                                                        },
                                                    }}

                                                    columns={columns}
                                                    dataSource={processedData}
                                                    rowKey="courseid"
                                                    bordered
                                                    pagination={false}
                                                    scroll={{ x: 800 }}
                                                    locale={{ emptyText: t("customised_pos.no_courses_available") }}
                                                    onChange={(pagination, filters, sorter) => {
                                                        console.log('Current sort:', sorter);
                                                        console.log('Active filters:', filters);
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8} xs={24} md={24} lg={24} xl={8}>
                                                <SemesterDetailView
                                                    title={`${t("customised_pos.Best_title")} ${selectedSemester.semester == "Fall" ? t("welcome.semester_fall") : selectedSemester.semester == "Spring" ? t("welcome.semester_spring") : t("welcome.semester_summer")}  | ${selectedSemester.year}`}
                                                    credits={totalCredits}
                                                    courseList={selectedSemester.courses}
                                                    Upcoming={t("customised_pos.upcoming")}
                                                />
                                            </Col>
                                        </>
                                    ) : (
                                        <Col xs={24} md={24} lg={16} style={{ height: "100%", width: "100%" }}>
                                            <SemesterDetailView
                                                    title={`${selectedSemester.semester == "Fall" ? t("welcome.semester_fall") : selectedSemester.semester == "Spring" ? t("welcome.semester_spring") : t("welcome.semester_summer")} } – ${selectedSemester.year}`}
                                                credits={totalCredits}
                                                courseList={selectedSemester.courses}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            );
                        })()
                    ) : null}

                </Content>

            </Layout>
        </Layout >

    );
};



const SemesterDetailView = (courseData: CourseData) => (

    <>
        <Semester_AutoPOS courseData={courseData} />
    </>

);


export default DynamicPOS;