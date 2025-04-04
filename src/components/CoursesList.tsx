import React, { useState } from 'react';
import { Row, Col, Tag, Typography, Collapse, Divider } from 'antd';
import { BookOutlined, CalendarOutlined, CheckCircleOutlined, ExclamationCircleOutlined, FormOutlined, MinusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import CourseCard from './CourseCard';
import styled from 'styled-components';

const { Panel } = Collapse;
const { Text } = Typography;


const CourseLists: React.FC = () => {
    const [loading] = useState<boolean>(true);

    return (
        <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
            {/* Completed Courses */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <HoverableDiv>
                <Collapse style={{ backgroundColor: "#e3faf8" }} expandIconPosition="end">
                    <Panel style={{ paddingTop: "7px", paddingBottom: "7px" } }
                        key="completed"
                        header={
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Row align="middle" gutter={8}>
                                        <Col>
                                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                        </Col>
                                        <Col>
                                            <Text strong>Completed Courses</Text>
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
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Core Requirement"
                            />
                            <CourseCard
                                courseName="CS 102: Data Structures"
                                grade="A"
                                semester="Spring 2022"
                                credits={4}
                                textBottom="Core Requirement"
                            />
                            <CourseCard
                                courseName="CS 201: Algorithms"
                                grade="B+"
                                semester="Fall 2022"
                                credits={4}
                                textBottom="Major Requirement"
                            />
                            <CourseCard
                                courseName="MATH 101: Calculus"
                                grade="A-"
                                semester="Spring 2021"
                                credits={4}
                                textBottom="General Requirement"
                            />
                            {/* Additional cards will trigger scroll */}
                            <CourseCard
                                courseName="PHYS 101: Physics"
                                grade="B"
                                semester="Fall 2020"
                                credits={4}
                                textBottom="General Requirement"
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
                                            <Text strong>Currently Registered</Text>
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
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Mon, Wed 2:00 PM"
                                iconBottom={<CalendarOutlined />}

                            />
                            <CourseCard
                                courseName="CS 101: Introduction to Programming"
                                gradeColor="#038b94"
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Mon, Wed 2:00 PM"
                                iconBottom={<CalendarOutlined />}

                            />
                            <CourseCard
                                courseName="CS 101: Introduction to Programming"
                                gradeColor="#038b94"
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Mon, Wed 2:00 PM"
                                iconBottom={<CalendarOutlined />}

                            />
                            <CourseCard
                                courseName="CS 101: Introduction to Programming"
                                gradeColor="#038b94"
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Mon, Wed 2:00 PM"
                                iconBottom={<CalendarOutlined />}

                            />
                            <CourseCard
                                courseName="CS 101: Introduction to Programming"
                                gradeColor="#038b94"
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Mon, Wed 2:00 PM"
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
                                            <Text strong>Remaining-Failed Courses</Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Tag color="geekblue">5</Tag>
                                </Col>
                            </Row>
                        }
                    >
                        <Divider orientation="left" style={{ borderColor: '#038b94' }}>Remaining</Divider>
                        <div style={{
                            maxHeight: '250px',  // Adjust this value based on your card height (4 cards * card height)
                            overflowY: 'auto',
                            paddingRight: '8px', // Prevents scrollbar from overlapping content
                            marginBottom: "20px"
                        }}>
                            <CourseCard
                                courseName="CS 101: Introduction to Programming"
                                gradeColor="transparent"
                                semester="Fall 2021"

                                credits={3}
                              
                                iconBottom={<CalendarOutlined />}
                                canRegister={true}


                            />
                            <CourseCard
                                courseName="CS 101: Introduction to Programming"
                                gradeColor="transparent"
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Mon, Wed 2:00 PM"
                                iconBottom={<CalendarOutlined />}
                                canRegister={false}


                            />

                        </div>
                        <Divider orientation="left" style={{ borderColor: '#038b94' }}>Failed/Withdrawn</Divider>
                        <div style={{
                            maxHeight: '250',  // Adjust this value based on your card height (4 cards * card height)
                            overflowY: 'auto',
                            paddingRight: '8px'  // Prevents scrollbar from overlapping content
                        }}>
                            <CourseCard
                                courseName="CS 101: Programming"
                                
                                semester="Fall 2021"
                                credits={3}
                                textBottom="Retake Needed"
                                textColor="red"
                                iconBottom={< WarningOutlined style={{ color: "red" }} /> }
                                borderC="red"
                                grade="F"
                                gradeColor="red"
                            />
                            <CourseCard
                                courseName="CS 101: Programming"

                                semester="Fall 2021"
                                credits={3}
                                textBottom="Withdrawn"
                                textColor="grey"
                                iconBottom={ <MinusCircleOutlined  style={{ color: "grey" }} />}
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