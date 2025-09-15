import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4', '#8A2BE2', '#00CED1', '#FFD700', '#ADFF2F'];

const getESGLevel = (score) => {
  if (score < 35) return 'Ikke bestået';
  else if (score < 50) return 'Bronze';
  else if (score < 65) return 'Sølv';
  else if (score < 80) return 'Guld';
  else return 'Platin';
};

const groupTitles = {
  E1: 'Klimaforandringer',
  E2: 'Forurening',
  E3: 'Vand- og havressourcer',
  E4: 'Biodiversitet og økosystemer',
  E5: 'Ressourceanvendelse og cirkulær økonomi',
  S1: 'Egen arbejdsstyrke',
  S2: 'Arbejdere i værdikæden',
  S3: 'Påvirkede samfund',
  S4: 'Forbrugere',
  G1: 'Forretningsetik',
};

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.2; // Position labels further out
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <Text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </Text>
  );
};

const ESGPieChart = ({ finalScores, totalScore, indicatorPoints }) => {
  const data = Object.entries(indicatorPoints).map(([label, points]) => ({
    name: `${label}: ${groupTitles[label] || ''}`,
    value: points,
    label: label, // Store original label for color mapping
  }));

  // Calculate total possible points for color scaling (assuming 100 max per category)
  const totalPossiblePoints = 100; 

  const renderCenterText = ({ cx, cy }) => {
    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" className="esg-text-2xl esg-font-bold">
          {totalScore.toFixed(1)}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central" className="esg-text-lg">
          {getESGLevel(totalScore)}
        </text>
      </g>
    );
  };

  return (
    <div className="esg-w-full esg-h-96">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
            {renderCenterText({ cx: 125, cy: 125 })} {/* Adjust cx, cy based on your chart size */}
          </Text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ESGPieChart;