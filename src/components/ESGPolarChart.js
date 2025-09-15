import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Text, PolarRadiusAxis } from 'recharts';

const ESGPolarChart = ({ indicatorPoints, totalScore }) => {
    const data = Object.entries(indicatorPoints).map(([label, value]) => ({
        subject: label,
        value: value,
        fullMark: 100,
    }));

    const RadialLines = ({ cx, cy, innerRadius, outerRadius, numLines }) => {
        const lines = [];
        const angleStep = 360 / numLines;

        for (let i = 0; i < numLines; i++) {
            const angle = angleStep * i;
            const x1 = cx + innerRadius * Math.cos(angle * Math.PI / 180);
            const y1 = cy + innerRadius * Math.sin(angle * Math.PI / 180);
            const x2 = cx + outerRadius * Math.cos(angle * Math.PI / 180);
            const y2 = cy + outerRadius * Math.sin(angle * Math.PI / 180);

            lines.push(
                <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ccc"
                    strokeWidth="1"
                />
            );
        }

        return <g>{lines}</g>;
    };

    return (
        <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius={150} data={data}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="subject" tickFormatter={(value) => `${value}: ${indicatorPoints[value]}`} />
                <PolarRadiusAxis angle={90} domain={[100, 0]} axisLine={false} tick={false} />
                <Radar name="ESG Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <RadialLines cx={250} cy={250} innerRadius={0} outerRadius={150} numLines={10} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default ESGPolarChart;