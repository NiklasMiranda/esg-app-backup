import React, { useRef } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

const ESGPolarChart = ({ indicatorPoints, totalScore }) => {
  const chartRef = useRef(null);

  return (
    <div ref={chartRef}>
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart cx="50%" cy="50%" outerRadius={150} data={data}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis
            dataKey="subject"
            tickFormatter={(value) => `${value}: ${indicatorPoints[value]}`}
          />
          <Radar
            name="ESG Score"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ESGPolarChart;