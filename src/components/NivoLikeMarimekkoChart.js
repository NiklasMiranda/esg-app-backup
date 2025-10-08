import React from 'react';

const NivoLikeMarimekkoChart = ({ data }) => {
  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 80, bottom: 100, left: 80 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (!data || data.length === 0) {
    return <p>No data for chart</p>;
  }

  const totalMaxPoints = data.reduce((sum, item) => sum + item.maxPoints, 0);

  let xOffset = 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Chart Bars */}
        {data.map((item, index) => {
          const widthPercentage = (item.maxPoints / totalMaxPoints) * 100;
          const barWidth = (innerWidth * widthPercentage) / 100;
          const earnedHeight = (item.earnedPoints / item.maxPoints) * innerHeight;
          const unearnedHeight = innerHeight - earnedHeight;

          const currentX = xOffset;
          xOffset += barWidth;

          return (
            <g key={index} transform={`translate(${currentX}, 0)`}>
              <rect
                y={0}
                width={barWidth}
                height={unearnedHeight}
                fill="#e0e0e0"
              />
              <rect
                y={unearnedHeight}
                width={barWidth}
                height={earnedHeight}
                fill="#6495ED"
              />
              <text
                x={barWidth / 2}
                y={innerHeight / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
              >
                {item.earnedPoints}/{item.maxPoints}
              </text>
              <text
                x={barWidth / 2}
                y={innerHeight + 20}
                textAnchor="middle"
                fontSize="12"
              >
                {item.subcategory}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#000" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#000" />

        {/* Legends */}
        <g transform={`translate(${innerWidth / 2}, ${innerHeight + 60})`}>
          <rect x={-60} y={0} width={20} height={20} fill="#6495ED" />
          <text x={-30} y={15}>Earned Points</text>
          <rect x={60} y={0} width={20} height={20} fill="#e0e0e0" />
          <text x={90} y={15}>Unearned Points</text>
        </g>
      </g>
    </svg>
  );
};

export default NivoLikeMarimekkoChart;
