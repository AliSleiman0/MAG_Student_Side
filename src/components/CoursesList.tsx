import React, { useState } from 'react';
import { Row, Col, Tag, Typography, Collapse, Divider } from 'antd';
import { BookOutlined, CalendarOutlined, CheckCircleOutlined, ExclamationCircleOutlined, FormOutlined, LockOutlined, MinusCircleOutlined, UnlockOutlined, WarningOutlined } from '@ant-design/icons';
import CourseCard from './CourseCard';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const { Panel } = Collapse;
const { Text } = Typography;


const CourseLists: React.FC = () => {
    const [loading] = useState<boolean>(true);
    const { t } = useTranslation();
    return (
        <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
            {/* Completed Courses */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <HoverableDiv>
                    <Collapse style={{ backgroundColor: "#e3faf8" }} expandIconPosition="end">
                        <Panel style={{ paddingTop: "7px", paddingBottom: "7px" }}
                            key="completed"
                            header={
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Row align="middle" gutter={8}>
                                            <Col>
                                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                            </Col>
                                            <Col>
                                                <Text strong>{t("courses.courses_lists.completed_courses")}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Tag color="geekblue">7</Tag>
                                    </Col>
                                </Row>
                            }
                        >
                            <div style={{
                                maxHeight: '686px',  // Adjust this value based on your card height (4 cards * card height)
                                overflowY: 'auto',
                                paddingRight: '8px'  // Prevents scrollbar from overlapping content
                            }}>
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    grade="A+"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={t("courses.course_types.major") }
                                />
                                <CourseCard
                                    courseName="CS 102: Data Structures"
                                    grade="A"
                                    semester={`${t("welcome.semester_summer")} 2021`}
                                    credits={4}
                                    textBottom={t("courses.course_types.core")}
                                />
                                <CourseCard
                                    courseName="CS 201: Algorithms"
                                    grade="B+"
                                    semester={`${t("welcome.semester_spring")} 2021`}
                                    credits={4}
                                    textBottom={t("courses.course_types.major_elective")}
                                />
                                <CourseCard
                                    courseName="MATH 101: Calculus"
                                    grade="A-"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={4}
                                    textBottom={t("courses.course_types.general_elective")}
                                />
                                {/* Additional cards will trigger scroll */}
                                <CourseCard
                                    courseName="PHYS 101: Physics"
                                    grade="B"
                                    semester="Fall 2020"
                                    credits={4}
                                    textBottom={t("courses.course_types.general_education")}
                                />
                            </div>
                        </Panel>
                    </Collapse>
                </HoverableDiv>
            </Col>

            {/* Registered Courses */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <HoverableDiv>
                    <Collapse style={{ backgroundColor: "#e3faf8" }} expandIconPosition="end">

                        <Panel style={{ paddingTop: "7px", paddingBottom: "7px" }}
                            key="registered"
                            header={
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Row align="middle" gutter={8}>
                                            <Col>
                                                <FormOutlined style={{ color: '#038b94' }} />
                                            </Col>
                                            <Col>
                                                <Text strong>{t("courses.courses_lists.currently_registered")}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Tag color="geekblue">2</Tag>
                                    </Col>
                                </Row>
                            }
                        >

                            <div style={{
                                maxHeight: '686px',  // Adjust this value based on your card height (4 cards * card height)
                                overflowY: 'auto',
                                paddingRight: '8px'  // Prevents scrollbar from overlapping content
                            }}>
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="#038b94"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={`${t("days.mon_wed")} 2:00${t("time_periods.am")}` }
                                    iconBottom={<CalendarOutlined />}

                                />
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="#038b94"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={`${t("days.mon_wed")} 2:00${t("time_periods.am")}`}
                                    iconBottom={<CalendarOutlined />}

                                />
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="#038b94"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={`${t("days.mon_wed")} 2:00${t("time_periods.am")}`}
                                    iconBottom={<CalendarOutlined />}

                                />
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="#038b94"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={`${t("days.mon_wed")} 2:00${t("time_periods.am")}`}
                                    iconBottom={<CalendarOutlined />}

                                />
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="#038b94"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={`${t("days.mon_wed")} 2:00${t("time_periods.am")}`}
                                    iconBottom={<CalendarOutlined />}

                                />
                            </div>
                        </Panel>
                    </Collapse></HoverableDiv>
            </Col>

            {/* Remaining Courses */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <HoverableDiv>
                    <Collapse style={{ backgroundColor: "#e3faf8" }} expandIconPosition="end">
                        <Panel style={{ paddingTop: "7px", paddingBottom: "7px" }}
                            key="remaining"
                            header={
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Row align="middle" gutter={8}>
                                            <Col>
                                                <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                                            </Col>
                                            <Col>
                                                <Text strong>{t("courses.courses_lists.remianing_failed_courses")}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Tag color="geekblue">5</Tag>
                                    </Col>
                                </Row>
                            }
                        >
                            <Divider orientation="left" style={{ borderColor: '#038b94' }}>{t("courses.credits.remaining") }</Divider>
                            <div style={{
                                maxHeight: '250px',  // Adjust this value based on your card height (4 cards * card height)
                                overflowY: 'auto',
                                paddingRight: '8px', // Prevents scrollbar from overlapping content
                                marginBottom: "20px"
                            }}>
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="transparent"
                                    semester={`${t("welcome.semester_fall")} 2021`}

                                    credits={3}
                                    textBottom={t("courses.register_status.can_register")}
                                    iconBottom={<LockOutlined />}
                                    canRegister={true}


                                />
                                <CourseCard
                                    courseName="CS 101: Introduction to Programming"
                                    gradeColor="transparent"
                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={t("courses.register_status.cannot_register")}
                                    iconBottom={<UnlockOutlined />}
                                    canRegister={false}


                                />

                            </div>
                            <Divider orientation="left" style={{ borderColor: '#038b94' }}>{t("courses.credits.failed_withdrawn")}</Divider>
                            <div style={{
                                maxHeight: '250',  // Adjust this value based on your card height (4 cards * card height)
                                overflowY: 'auto',
                                paddingRight: '8px'  // Prevents scrollbar from overlapping content
                            }}>
                                <CourseCard
                                    courseName="CS 101: Programming"

                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={t("courses.failed_withdrawn_status.status_f")}
                                    textColor="red"
                                    iconBottom={< WarningOutlined style={{ color: "red" }} />}
                                    borderC="red"
                                    grade="F"
                                    gradeColor="red"
                                />
                                <CourseCard
                                    courseName="CS 101: Programming"

                                    semester={`${t("welcome.semester_fall")} 2021`}
                                    credits={3}
                                    textBottom={t("courses.failed_withdrawn_status.status_w")}
                                    textColor="grey"
                                    iconBottom={<MinusCircleOutlined style={{ color: "grey" }} />}
                                    borderC="grey"
                                    grade="W"
                                    gradeColor="grey"

                                />



                            </div>
                        </Panel>

                    </Collapse>
                </HoverableDiv>
            </Col>
        </Row>
    );
};
const HoverableDiv = styled.div`
  transition: all 0.3s ease;
  border-radius:20%;
  transform: scale(1);
  box-shadow: none;
      width: 100%;
  &:hover {
   
   box-shadow: 0 5px 10px rgba(3, 139, 148, 0.3);
  }
`;
export default CourseLists;