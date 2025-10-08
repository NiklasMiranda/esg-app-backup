import React, { useState } from 'react';

const NivoLikeMarimekkoChart = ({ data }) => {
  const width = 800;
  const height = 500;
  const margin = { top: 10, right: 10, bottom: 100, left: 10 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [hoveredX, setHoveredX] = useState(0);

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
            <g
              key={index}
              transform={`translate(${currentX}, 0)`}
              onMouseEnter={() => { setHoveredSubcategory(item.subcategory); setHoveredX(currentX + barWidth / 2); }}
              onMouseLeave={() => { setHoveredSubcategory(null); setHoveredX(0); }}
            >
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
              {unearnedHeight > 0 && (
                <text
                  x={barWidth / 2}
                  y={unearnedHeight / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#000"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {item.maxPoints}
                </text>
              )}
              {earnedHeight > 0 && (
                <text
                  x={barWidth / 2}
                  y={unearnedHeight + earnedHeight / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#fff"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {item.earnedPoints}
                </text>
              )}
            </g>
          );
        })}

        {/* Axes */}
        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#000" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#000" />

        {/* Legends */}
        <g transform={`translate(${innerWidth / 3}, ${innerHeight + 60})`}>
          <rect x={-60} y={0} width={20} height={20} fill="#6495ED" />
          <text x={-30} y={15}>Optjente points</text>
          <rect x={180} y={0} width={20} height={20} fill="#e0e0e0" />
          <text x={210} y={15}>Maksimale points</text>
        </g>

        {/* Tooltip */}
        {hoveredSubcategory && (
          <text
            x={hoveredX}
            y={innerHeight + 20}
            textAnchor="middle"
            fill="black"
            fontSize="16"
            fontWeight="bold"
            pointerEvents="none"
          >
            {hoveredSubcategory}
          </text>
        )}
      </g>
    </svg>
  );
};

export default NivoLikeMarimekkoChart;
