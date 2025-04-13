import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Graph } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { CourseNode } from '../../components/CourseNode';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Col, Space, Typography } from 'antd';
const sampleCourses: {
    courseCode: string;
    title: string;
    credits: number;
    prerequisites: string[];
    courseType: string;
}[] = [
        {
            courseCode: "CENG400",
            title: "Micro Controllers & Micro Processors",
            credits: 4,
            prerequisites: ["CENG380", "CENG350"],
            courseType: "Major"
        },
        {
            courseCode: "MATH201",
            title: "Advanced Calculus",
            credits: 3,
            prerequisites: ["MATH101"],
            courseType: "Core"
        },
        {
            courseCode: "CENG450",
            title: "Embedded Systems Design",
            credits: 5,
            prerequisites: ["CENG400"],
            courseType: "Major"
        },
        {
            courseCode: "ARTS110",
            title: "Digital Photography",
            credits: 4,
            prerequisites: [],
            courseType: "Elective"
        },
        {
            courseCode: "GEN199",
            title: "Critical Thinking",
            credits: 4,
            prerequisites: ["CENG340", "EENG250"],
            courseType: "General"
        }
    ]; // Total credits: 4 + 3 + 5 + 4 + 4 = 20
// 1. Move styled components outside the component
const FlowchartContainer = styled.div`
  width: 85vw!important;  
  height:  80vh!important;
  border: 2px solid #038b94;
 
  border-radius: 8px;
  background-color: white;
  position: relative;
`;
const PageContainer = styled.div`
  width: 100%;
  min-height: auto;
  
 
  box-sizing: border-box;
`;
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
// 2. Register custom node shape ONCE (outside component)
register({
    shape: 'sem-node',
    width: 1500,
    height: 120,
    component: CourseNode,  // Fixed component reference
});

const AutoPOS: React.FC = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph | null>(null);

    // 3. Initialize graph in useEffect for proper lifecycle management
    useEffect(() => {
        if (!containerRef.current) return;

        // Create graph instance
        const graph = new Graph({
            container: containerRef.current,
            grid: { visible: true, size: 15 },
            background: { color: '#f8f9fa' },
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

        const nodePositions = [
            { x: 0, y: 0 },             // sem1 (top)
            { x: 350, y: 800 },        // sem2
            { x: 1000, y: 0 },          // sem3
            { x: 1350, y: 800 },       // sem4
            { x: 2000, y: 0 },          // sem5
            { x: 2350, y: 800 }        // sem6   // sem6 (right)
        ];
  
        // Add 6 nodes with alternating positions
        Array.from({ length: 6 }).forEach((_, index) => {
            const semesterNumber = index + 1;
            const position = nodePositions[index];

            graph.addNode({
                id: `sem${semesterNumber}`,
                shape: 'sem-node',
                x: position.x,
                y: position.y,
                data: {
                    title: `Semester ${semesterNumber}`,
                    credits: 20 - index * 2,  // Varying credits for demo
                    courses: 5 - Math.floor(index / 2),
                    courseList: sampleCourses,
                    Upcoming: semesterNumber === 1 ? "Upcoming" : undefined
                }
            });
        });
        //const scroller = new Scroller({
        //    enabled: true,
        //    padding: 50,
        //    pageVisible: true,
        //    pageBreak: false,
        //});
        //graph.use(scroller); 
        
        // Add this after adding nodes to ensure proper view
        //graph.zoomToFit({ padding: 50 });

        // 5. Cleanup on unmount
        return () => {
            graph.dispose();
        };
    }, []);

    return (
        <>
            <PageTitle>{t('Automated POS')}</PageTitle>
            <PageContainer>
                <FlowchartContainer ref={containerRef} />
            </PageContainer>
        </>
    );
};

export default AutoPOS;