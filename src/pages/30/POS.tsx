import React, { useEffect, useRef, useState } from 'react';
import { Graph, Edge, Node } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import styled from 'styled-components';
import { connect } from 'http2';
import { Col, Row, Space, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
const FlowchartContext = React.createContext({
    showCorequisites: false,
    showCourseStatus: false,
});
const bannerStyles = {
    banner: {
        backgroundColor: '#e3faf8', // Subtle grey matching Ant Design's palette
        padding: '16px 24px',
        borderRadius: '8px',
        width: '100%',
    },
    icon: {
        fontSize: '20px',
        color: '#038b94', // Medium grey for contrast
    },
    text: {
        fontSize: '16px',
        color: '#262626', // Dark grey for readability
    },
    responsiveText: {
        '@media (max-width: 768px)': {
            fontSize: '10px',
        }
    }
};
// Styled components
const FlowchartContainer = styled.div`
  width: 100%;
  height: 80vh;
  border: 2px solid #038b94;
  border-radius: 8px;
  background-color: white;
  position: relative;
`;

const CourseNodeContainer = styled.div<{ $highlighted?: boolean, $showCorequisites: boolean }>`
  background: white;
  border: 2px solid #038b94;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
   transform: ${props => (props.$highlighted && props.$showCorequisites) ? 'scale(1.1)' : 'none'};
  box-shadow: ${props => (props.$highlighted && props.$showCorequisites)
        ? '0 4px 12px rgba(3, 139, 148, 0.3)'
        : 'none'};
  &:hover {
    box-shadow: 0 4px 12px rgba(3, 139, 148, 0.2);
    transform: translateY(-2px);
  }
`;

const CourseCode = styled.div`
  font-weight: 600;
  color: #038b94;
  font-size: 14px;
`;
const LegendContainer = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  border-radius: 4px;
  margin-right: 10px;
  border: 1px solid #ddd;
`;

const SolidLine = styled.div`
  width: 60px;
  height: 2px;
  background: #036b74;
  margin-right: 10px;
`;

const DashedLine = styled.div`
  width: 60px;
  height: 2px;
  border-bottom: 2px dashed #03aabd;
  margin-right: 10px;
`;
// Updated course data without postrequisites
const courses = [
    {
        code: 'CENG200',
        name: 'Introduction to Engineering',
        prerequisites: [],
        corequisites: [],
        level: 200,
        status: 'passed'
    },
    {
        code: 'CENG250',
        name: 'Engineering Mathematics',
        prerequisites: [],
        corequisites: [],
        level: 200,
        status: 'passed'
    },
    {
        code: 'CENG300',
        name: 'Engineering Science',
        prerequisites: ['CENG250'],
        corequisites: ['CENG350'],
        level: 300,
        status: 'registered'
    },
    {
        code: 'CENG350',
        name: 'Materials Science',
        prerequisites: ['CENG250'],
        corequisites: ['CENG300'],
        level: 300,
        status: 'registered'
    },
    {
        code: 'CENG400',
        name: 'Advanced Systems Design',
        prerequisites: ['CENG300', 'CENG350'],
        corequisites: ['CENG410'],
        level: 400,
        status: 'failed'
    },
    {
        code: 'CENG410',
        name: 'Engineering Ethics',
        prerequisites: [],
        corequisites: ['CENG350', "CENG480"],
        level: 400,
        status: 'registered'
    },
    {
        code: 'CENG450',
        name: 'Renewable Energy Systems',
        prerequisites: ['CENG300'],
        corequisites: [],
        level: 400,
        status: 'passed'
    },
    {
        code: 'CENG480',
        name: 'Special Topics in Engineering',
        prerequisites: ['CENG400', "CENG200"],
        corequisites: ['CENG450', 'CENG410', 'CENG400',],
        level: 400,
        status: 'failed'
    },
    {
        code: 'CENG500',
        name: 'Capstone Project',
        prerequisites: ["CENG480", 'CENG450'],
        corequisites: [],
        level: 500,
        status: 'registered'
    },
].sort((a, b) => a.level - b.level);

const CourseNodeComponent = ({ node }: { node?: any }) => {
    const courseData = node?.getData();
    const showCourseStatus = courseData?.showCourseStatus ?? false;

    const statusStyles = showCourseStatus ? {
        background: courseData.course.status === "passed" ? "#06c2bf" :
            courseData.course.status === "registered" ? "#defeff" : "#f74f48",
        border: courseData.course.status === "passed" ? "1px solid #038187" :
            courseData.course.status === "registered" ? "1px solid #038187" : "1px solid #f70f05"
    } : {};

    const fontColor = showCourseStatus ?
        (courseData.course.status === "registered" ? "#0D47A1" : "#FFFFFF")
        : "#038b94"; // Default color

    return (
        <CourseNodeContainer style={statusStyles}
            $showCorequisites={courseData?.showCorequisites ?? true}
            $highlighted={courseData?.highlighted}
        >
            <CourseCode style={{ color: fontColor }}>{courseData?.course?.code}</CourseCode>
        </CourseNodeContainer>
    );
};
register({
    shape: 'course-node',
    width: 120,
    height: 60,
    component: CourseNodeComponent,
});

const Flowchart = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showPrerequisites, setShowPrerequisites] = useState(true);
    const [showCorequisites, setShowCorequisites] = useState(false);
    const [showCourseStatus, setShowCourseStatus] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeTooltip, setActiveTooltip] = useState<any>(null);
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.pageX + 10, y: e.pageY + 10 });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const graphRef = useRef<Graph | null>(null);
    useEffect(() => {
        if (!graphRef.current) return;

        graphRef.current.getNodes().forEach(node => {
            const data = node.getData();
            node.setData({
                ...data,
                showCorequisites: showCorequisites,
                showCourseStatus: showCourseStatus
            });
        });
    }, [showCorequisites, showCourseStatus]);
    // Add refs to track state changes in graph event handlers
    const showPrereqRef = useRef(showPrerequisites);
    const showCoreqRef = useRef(showCorequisites);
    const showCourseStatusRef = useRef(showCourseStatus);
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        content: any;
        x: number;
        y: number;
    }>({ visible: false, content: null, x: 0, y: 0 });

    useEffect(() => {
        showPrereqRef.current = showPrerequisites;
        showCoreqRef.current = showCorequisites;
        showCourseStatusRef.current = showCourseStatus;
    }, [showPrerequisites, showCorequisites, showCourseStatus]);

    useEffect(() => {
        if (!containerRef.current) return;

        const graph = new Graph({
            container: containerRef.current,
            grid: { visible: true, size: 15 },
            background: { color: '#f8f9fa' },
            interacting: { nodeMovable: false },
            panning: true,
            mousewheel: true,
            connecting: {
                router: {
                    name: 'manhattan',
                    args: {
                        excludeShapes: ['course-node'],
                        maximumLoops: 100,
                        startDirections: ['right'],
                        endDirections: ['left']
                    }
                }
            }
        });
        graphRef.current = graph;
        // Pre-process courses data
        const validatedCourses = courses.map(course => ({
            ...course,
            prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
            corequisites: Array.isArray(course.corequisites) ? course.corequisites : []

        }));


        const courseLevels = Array.from(new Set(validatedCourses.map(c => c.level))).sort((a, b) => a - b);//new Set(validatedCourses.map(c => c.level)) extract levels and removes duplicates then switch back the set to array using Array.from
        const levelSpacing = 250;
        const nodeSpacing = 150;

        validatedCourses.forEach((course) => {
            const levelIndex = courseLevels.indexOf(course.level);
            const levelNodes = validatedCourses.filter(c => c.level === course.level);
            const nodeIndex = levelNodes.findIndex(c => c.code === course.code);

            //const statusColors: Record<string, string> = {
            //    passed: '#4CAF50!important',
            //    failed: '#F44336!important',
            //    registered: '#2196F3!important'
            //};

            graph.addNode({
                id: course.code,
                shape: 'course-node',
                data: { course },
                x: 100 + (levelIndex * levelSpacing),
                y: 100 + (nodeIndex * nodeSpacing),
                width: 120,
                height: 60,

            } as Node.Metadata);
        });


        const existingEdges = new Set<string>();

        validatedCourses.forEach(course => {
            console.log(course);
            course.prerequisites.forEach(pre => {
                const edgeKey = `${pre}-${course.code}`;
                if (!existingEdges.has(edgeKey)) {
                    graph.addEdge({
                        source: pre,
                        target: course.code,
                        router: {
                            name: 'manhattan',
                            args: { offset: 30, padding: 15 }
                        },
                        attrs: {
                            line: {
                                stroke: '#036b74',
                                strokeWidth: 3,
                                targetMarker: 'classic'
                            }
                        },
                        data: { type: 'prerequisite' } // Add edge type
                    });
                    existingEdges.add(edgeKey);
                }
            });

            // Process corequisites with bidirectional check
            course.corequisites.forEach(co => {
                console.log(co);
                const reverseKey = `${course.code}-${co}`;
                const forwardKey = `${co}-${course.code}`;

                if (validatedCourses.some(c => c.code === co && c.corequisites.includes(course.code))) {
                    graph.addEdge({
                        source: course.code,
                        target: co,
                        router: {
                            name: 'manhattan',
                            args: {
                                offset: -30,
                                padding: 15,
                                startDirections: ['bottom'],
                                endDirections: ['top']
                            }
                        },
                        attrs: {
                            line: {
                                stroke: '#03aabd',
                                strokeDasharray: '5 3',
                                strokeWidth: 2,
                                sourceMarker: { name: 'circle', size: 7 },
                                targetMarker: { name: 'diamond', size: 7 }
                            }
                        },
                        data: { type: 'corequisite' } // Add edge type
                    });
                    graph.addEdge({
                        source: co,
                        target: course.code,
                        router: {
                            name: 'manhattan',
                            args: {
                                offset: -30,
                                padding: 15,
                                startDirections: ['bottom'],
                                endDirections: ['top']
                            }
                        },
                        attrs: {
                            line: {
                                stroke: '#03aabd',
                                strokeDasharray: '5 3',
                                strokeWidth: 2,
                                sourceMarker: { name: 'circle', size: 6 },
                                targetMarker: { name: 'diamond', size: 6 }
                            }
                        },
                        data: { type: 'corequisite' } // Add edge type
                    });

                    existingEdges.add(reverseKey);
                    existingEdges.add(forwardKey);
                }//endif
                else {
                    graph.addEdge({
                        source: course.code,
                        target: co,
                        router: {
                            name: 'manhattan',
                            args: {
                                offset: -30,
                                padding: 15,
                                startDirections: ['bottom'],
                                endDirections: ['top']
                            }
                        },
                        attrs: {
                            line: {
                                stroke: '#03aabd',
                                strokeDasharray: '5 3',
                                strokeWidth: 2,
                                sourceMarker: { name: 'circle', size: 6 },
                                targetMarker: { name: 'diamond', size: 6 }
                            }
                        },
                        data: { type: 'corequisite' }
                    });
                }
            });
        });

        // Performance optimization: Pre-cache edges
        const edgeCache = new Map<string, Edge[]>();
        graph.getNodes().forEach(node => {
            const connectedEdges = graph.getConnectedEdges(node);
            console.log("connected Links ", connectedEdges);
            edgeCache.set(node.id, connectedEdges);
        });
       
        // Optimized hover handler
        graph.on('node:mouseenter', ({ node: hoveredNode, e }) => {
            const course = hoveredNode.data?.course;
            setActiveTooltip(course);
            if (!course) return;

            // Get cached edges
            const connectedEdges = edgeCache.get(hoveredNode.id) || [];
            console.log(connectedEdges);
            // Update visibility and styling

            graph.getEdges().forEach(edge => {
                const type = edge.getData()?.type;
                if (showCoreqRef.current) {
                    const coreqEdges = connectedEdges.filter(edge =>
                        edge.getData()?.type === 'corequisite'
                    );

                    const coreqNodes = coreqEdges.map(edge => {
                        const source = edge.getSourceCell();
                        const target = edge.getTargetCell();
                        return source === hoveredNode ? target : source;
                    });
                    coreqNodes.forEach(node => {
                        if (node!.isNode()) {
                            const data = node.getData();
                            node.setData({ ...data, highlighted: true });
                        }
                    });
                }
                const shouldShow = connectedEdges.includes(edge) &&
                    (type === 'prerequisite' ? showPrereqRef.current :
                        type === 'corequisite' ? showCoreqRef.current : true);
                edge.setVisible(shouldShow);
                edge.attr('line/stroke', shouldShow ?
                    edge.attr('line/strokeDasharray') ? '#03aabd' : '#036b74'
                    : '#f0f0f0');
            });


            // Tooltip positioning with scroll adjustment
            const bbox = hoveredNode.getBBox();
            const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const scrollY = window.scrollY || document.documentElement.scrollTop;

            setTooltip({
                visible: true,
                content: course,
                x: e.clientX + 10,  // Add slight offset
                y: e.clientY + 10
            });
        });
        graph.on('node:mousemove', ({ e }) => {
            setTooltip(prev => ({
                ...prev,
                x: e.clientX + 10,
                y: e.clientY + 10
            }));
        });

        graph.on('node:mouseleave', () => {
            setActiveTooltip(null);
            graph.getEdges().forEach(edge => {

                const type = edge.getData()?.type;
                const shouldShow = type === 'prerequisite' ? showPrereqRef.current :
                    type === 'corequisite' ? showCoreqRef.current : true;
                graph.getNodes().forEach(node => {
                    const data = node.getData();
                    if (data.highlighted) {
                        node.setData({ ...data, highlighted: false });
                    }
                });
                edge.setVisible(shouldShow);
                edge.attr('line/stroke', shouldShow ?
                    edge.attr('line/strokeDasharray') ? '#03aabd' : '#036b74'
                    : '#f0f0f0');
            });
            setTooltip({ visible: false, content: null, x: 0, y: 0 });
        });

        graph.zoomToFit({ padding: 50, });

        return () => graph.dispose();
    }, []);
    useEffect(() => {
        if (!graphRef.current) return;

        graphRef.current.getEdges().forEach(edge => {
            const type = edge.getData()?.type;
            if (type === 'prerequisite') {
                edge.setVisible(showPrerequisites);
            } else if (type === 'corequisite') {
                edge.setVisible(showCorequisites);
            }
        });
    }, [showPrerequisites, showCorequisites]);
    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <div style={bannerStyles.banner}>
                        <Space align="center">
                            {/* Info icon */}
                            <InfoCircleOutlined style={bannerStyles.icon} />

                            {/* Dynamic content */}
                            <Typography.Text
                                style={{ ...bannerStyles.text, ...bannerStyles.responsiveText }}
                            >
                                Plan of Study of [Computer and Commmunication Engineering]
                             
                            </Typography.Text>
                        </Space>
                    </div>
                </Col>
            </Row>
        <FlowchartContext.Provider value={{ showCorequisites, showCourseStatus, }}>
            <LegendContainer>
                <div style={{ marginBottom: '12px', fontWeight: '600', color: '#038b94' }}>
                    Legends
                </div>

                {/* Node Status */}
                <div style={{ marginBottom: '16px' }}>
                    <LegendItem>
                        <ColorSwatch color="#06c2bf" />
                        <span>Passed Course</span>
                    </LegendItem>
                    <LegendItem>
                        <ColorSwatch color="#defeff" />
                        <span>Registered Course</span>
                    </LegendItem>
                    <LegendItem>
                        <ColorSwatch color="#f70f05" />
                        <span>Failed Course</span>
                    </LegendItem>
                </div>

                {/* Edge Types */}
                <div>
                    <LegendItem>
                        <SolidLine />
                        <span>Prerequisites</span>
                    </LegendItem>
                    <LegendItem>
                        <DashedLine />
                        <span>Corequisites (with markers)</span>
                    </LegendItem>
                    <div style={{ fontSize: '0.8em', color: '#666', marginTop: '8px' }}>
                        <div>● = Source course</div>
                        <div>◆ = Target course</div>
                    </div>
                </div>
            </LegendContainer>
            <div style={{ position: 'relative' }}>
                <Space style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    background: 'white',
                    padding: 8,
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={showCourseStatus}
                        onChange={setShowCourseStatus}
                        style={{ marginRight: 8 }}
                    />
                    <span style={{ marginRight: "10px" }}>Show Course Status </span>
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={showPrerequisites}
                        onChange={setShowPrerequisites}
                        style={{ marginRight: 8 }}
                    />
                    <span>Prerequisites</span>

                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={showCorequisites}
                        onChange={setShowCorequisites}
                        style={{ marginLeft: 16, marginRight: 8 }}
                    />
                    <span>Corequisites</span>


                </Space>
                <FlowchartContainer ref={containerRef} />
                {activeTooltip && (
                    <div className="tooltip-container"
                        style={{
                            position: 'fixed',
                            left: mousePosition.x,
                            top: mousePosition.y,
                            background: '#038b94',
                            color: 'white',
                            padding: 12,
                            borderRadius: 6,
                            boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
                            zIndex: 100,
                            minWidth: 150,
                            pointerEvents: 'none',
                            transition: 'transform 0.1s ease-out'
                        }}
                    >
                        <h4 style={{ margin: 0, color: 'white', fontSize: "0.8rem" }}>
                            {tooltip.content.name}
                        </h4>
                        <div style={{ marginTop: 8, fontSize: "0.8rem" }}>
                            <div>Prerequisites: {(tooltip.content.prerequisites || []).join(', ') || 'None'}</div>
                            <div>Corequisites: {(tooltip.content.corequisites || []).join(', ') || 'None'}</div>
                        </div>
                    </div>
                )}
            </div> 
        </FlowchartContext.Provider></>
    );
};
export default Flowchart;