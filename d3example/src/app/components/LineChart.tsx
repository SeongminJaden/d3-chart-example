'use client'

// components/LineChart.tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
    data: number[];
    useSpline: boolean;
    color: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, useSpline, color }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = window.innerWidth / 2 - margin.left - margin.right;
        const height = window.innerHeight / 2 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
        const y = d3.scaleLinear().domain(d3.extent(data) as [number, number]).nice().range([height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        const line = d3.line<number>()
            .x((d, i) => x(i))
            .y(d => y(d));

        const spline = d3.line<number>()
            .x((d, i) => x(i))
            .y(d => y(d))
            .curve(d3.curveBasis);

        svg.append('path')
            .datum(data)
            .attr('class', useSpline ? 'spline' : 'line')
            .attr('d', useSpline ? spline : line)
            .attr('stroke', color)
            .attr('stroke-width', 1.5)
            .attr('fill', 'none');

        // Tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', '#f9f9f9')
            .style('border', '1px solid #d3d3d3')
            .style('padding', '5px')
            .style('display', 'none');

        const bisect = d3.bisector((d: number, i: number) => i).left;

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mousemove', function (event) {
                const [mx, my] = d3.pointer(event);
                const x0 = x.invert(mx);
                const i = bisect(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const d = x0 - i > 0 ? d1 : d0;
                const time = Math.round(x0);
                const value = data[time];

                tooltip
                    .html(`Time: ${time}s<br>Data: ${value.toFixed(2)}m`)
                    .style('left', `${event.pageX + 15}px`)
                    .style('top', `${event.pageY - 28}px`)
                    .style('display', 'block');
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');
            });

        return () => {
            tooltip.remove();
        };
    }, [data, useSpline, color]);

    return (
        <svg ref={ref}></svg>
    );
};

export default LineChart;
