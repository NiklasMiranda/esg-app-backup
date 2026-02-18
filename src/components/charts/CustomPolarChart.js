import React, { useState, forwardRef } from 'react';


const CustomPolarChart = forwardRef(({ data, totalScore, esgLevel, criterionColors }, ref) => {
  if (!data || data.length === 0) {
    return (
      <div ref={ref} className="esg-flex esg-items-center esg-justify-center esg-h-full esg-text-gray-500">
        No data available for polar chart.
      </div>
    );
  }

  const viewBoxSize = 800;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const outerRadius = Math.min(viewBoxSize, viewBoxSize) / 2 * 0.8;
  const innerChartRadius = outerRadius * 0.2;





  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const numRadialLines = data.length;
  const anglePerRadialLine = 360 / numRadialLines;
  const numCircularLines = 5;

  return (
    <div ref={ref}>
      <svg className="esg-w-full esg-h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <circle cx={centerX} cy={centerY} r={innerChartRadius} fill="#f4f4f4" />
        {[...Array(numCircularLines)].map((_, i) => {
          const r = innerChartRadius + (outerRadius - innerChartRadius) * ((i + 1) / numCircularLines);
          return (
            <circle key={`circle-grid-${i}`} cx={centerX} cy={centerY} r={r} fill="none" stroke="#ccc" strokeWidth="1" strokeDasharray="2 2" />
          );
        })}
        {[...Array(numRadialLines)].map((_, i) => {
          const angle = i * anglePerRadialLine;
          const start = polarToCartesian(centerX, centerY, innerChartRadius, angle);
          const end = polarToCartesian(centerX, centerY, outerRadius, angle);
          return (
            <line key={`radial-grid-${i}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#ccc" strokeWidth="1" />
          );
        })}
        {data.map((item, index) => {
          const criterion = item.criterion;
          const points = item["Point (Optjent)"];
          const color = criterionColors[criterion] || '#cccccc';
          const anglePerSegment = 360 / data.length;
          const startAngle = index * anglePerSegment;
          const endAngle = (index + 1) * anglePerSegment;
          const maxPossiblePoints = 100;
          const currentRadius = outerRadius - ((points / maxPossiblePoints) * (outerRadius - innerChartRadius));
          const segmentInnerRadius = Math.max(currentRadius, innerChartRadius);
          return (
            <g key={criterion}>
              <path
                d={`M ${polarToCartesian(centerX, centerY, outerRadius, startAngle).x} ${polarToCartesian(centerX, centerY, outerRadius, startAngle).y} A ${outerRadius} ${outerRadius} 0 0 1 ${polarToCartesian(centerX, centerY, outerRadius, endAngle).x} ${polarToCartesian(centerX, centerY, outerRadius, endAngle).y} L ${polarToCartesian(centerX, centerY, segmentInnerRadius, endAngle).x} ${polarToCartesian(centerX, centerY, segmentInnerRadius, endAngle).y} A ${segmentInnerRadius} ${segmentInnerRadius} 0 0 0 ${polarToCartesian(centerX, centerY, segmentInnerRadius, startAngle).x} ${polarToCartesian(centerX, centerY, segmentInnerRadius, startAngle).y} Z`}
                fill={color} stroke="#fff" strokeWidth="1"
              />
            </g>
          );
        })}
        {data.map((item, index) => {
          const criterion = item.criterion;
          const midAngle = (index * anglePerRadialLine) + (anglePerRadialLine / 2);
          const labelRadius = outerRadius + 20;
          const { x, y } = polarToCartesian(centerX, centerY, labelRadius, midAngle);
          return (
            <text key={`label-${criterion}`} x={x} y={y} textAnchor="middle" alignmentBaseline="middle" fontSize="20" fontWeight="bold" fill="#000">
              {criterion}
            </text>
          );
        })}
        <text x={centerX} y={centerY - 10} textAnchor="middle" fontSize="26" fontWeight="bold">{totalScore.toFixed(2)}</text>
        <text x={centerX} y={centerY + 20} textAnchor="middle" fontSize="20" fill="#000000">{esgLevel}</text>

      </svg>
    </div>
  );
});

export default CustomPolarChart;