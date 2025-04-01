import React, { useEffect } from 'react';
import { Pie } from '@antv/g2plot';
import { remainingCourses } from './samplecoursesdata';

interface DonutChartProps {
    completed: number;
    total: number;
    title?: string;
    height?: number;
    kkey?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
    completed,
    total,
    title = 'Progress',
    height = 300,
    kkey ="something"
}) => {
    const containerId = `donut-chart-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        const data = kkey==="percentage" ? [
            { type: 'Passed', value: completed },
            { type: 'Failed', value: total - completed },
        ] :
            [
                { type: 'Completed', value: completed },
                { type: 'Remaining', value: total - completed },
            ];
        const percentagePassed = (completed / total - completed);
        const donutPlot = new Pie(containerId, {
         
            data,
            legend: {
                position: 'bottom',
                layout: 'horizontal',
                itemSpacing: 16,
                itemName: {
                    style: {
                        fill: '#038b94',
                        fontSize: 14,
                    },
                },
                marker: {
                    style: {
                        r: 6,
                    },
                },
            },
            padding: [0, 0, 55, 0],
            angleField: 'value',
            colorField: 'type',
            color: ['#038b94', '#e3faf8'], // Green for completed, gray for remaining
            radius: 1,
            innerRadius: 0.8,
            statistic: {
                title: {
                    content: kkey === "percentage" ? "Percentage" : title,
                    style: { fontSize: '14px', paddingBottom:"10px" }
                },
                content: {
                    content: kkey === "percentage"
                        ? `${((completed / total) * 100).toFixed(1)}%`  // Fixed percentage calculation
                        : `${completed}/${total}`,
                    style: { fontSize: '20px' }
                }
            },
            interactions: [{ type: 'element-active' }],
        });

        donutPlot.render();

        return () => {
            donutPlot.destroy();
        };
    }, [completed, total, containerId, title,kkey]);

    return <div id={containerId} style={{ height: `${height}px`, width: '100%' }} />;
};
export default DonutChart;
// Usage example in a dashboard
