import React, { useState } from 'react'; // Import useState

const CustomPolarChart = ({ data, totalScore, esgLevel, criterionColors }) => {
  const viewBoxSize = 800; // Fixed size for viewBox
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const outerRadius = Math.min(viewBoxSize, viewBoxSize) / 2 * 0.8; // 80% of half the smallest dimension
  const innerChartRadius = outerRadius * 0.2; // 20% of the outerRadius for the inner hole

  // State for tooltip
  const [tooltip, setTooltip] = useState(null); // { criterion: 'E1', score: 75, x: 100, y: 100 }

  // Calculate max possible points for scaling
  const maxPossiblePoints = 100; // Assuming max points for any criterion is 100

  // Function to convert polar to Cartesian coordinates
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Number of radial grid lines (equal to number of data points)
  const numRadialLines = data.length;
  const anglePerRadialLine = 360 / numRadialLines;

  // Number of circular grid lines
  const numCircularLines = 5; // e.g., 5 concentric circles

  return (
    <svg className="esg-w-full esg-h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      {/* Background circle - now it's the inner hole fill */}
      <circle cx={centerX} cy={centerY} r={innerChartRadius} fill="#f4f4f4" />

      {/* Circular Grid Lines */}
      {[...Array(numCircularLines)].map((_, i) => {
        // Scale circular grid lines between innerChartRadius and outerRadius
        const r = innerChartRadius + (outerRadius - innerChartRadius) * ((i + 1) / numCircularLines);
        return (
          <circle
            key={`circle-grid-${i}`}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="#ccc"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        );
      })}

      {/* Radial Grid Lines */}
      {[...Array(numRadialLines)].map((_, i) => {
        const angle = i * anglePerRadialLine;
        const start = polarToCartesian(centerX, centerY, innerChartRadius, angle); // Start from innerChartRadius
        const end = polarToCartesian(centerX, centerY, outerRadius, angle); // End at outer radius
        return (
          <line
            key={`radial-grid-${i}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#ccc"
            strokeWidth="1"
          />
        );
      })}

      {/* Chart segments */}
      {data.map((item, index) => {
        const criterion = item.criterion;
        const points = item["Point (Optjent)"];
        const color = criterionColors[criterion] || '#cccccc';

        // Each segment gets an equal slice of the circle
        const anglePerSegment = 360 / data.length;
        const startAngle = index * anglePerSegment;
        const endAngle = (index + 1) * anglePerSegment;

        // Inverted logic: 100 points means radius is innerChartRadius, 0 points means radius is outerRadius
        // So, the bar grows inwards from outerRadius towards innerChartRadius.
        // The effective range for points is from innerChartRadius to outerRadius.
        const currentRadius = outerRadius - ((points / maxPossiblePoints) * (outerRadius - innerChartRadius));
        // Ensure currentRadius doesn't go below innerChartRadius
        const segmentInnerRadius = Math.max(currentRadius, innerChartRadius);


        return (
          <g key={criterion}>
            <path
              d={`M ${polarToCartesian(centerX, centerY, outerRadius, startAngle).x} ${polarToCartesian(centerX, centerY, outerRadius, startAngle).y}
                  A ${outerRadius} ${outerRadius} 0 0 1 ${polarToCartesian(centerX, centerY, outerRadius, endAngle).x} ${polarToCartesian(centerX, centerY, outerRadius, endAngle).y}
                  L ${polarToCartesian(centerX, centerY, segmentInnerRadius, endAngle).x} ${polarToCartesian(centerX, centerY, segmentInnerRadius, endAngle).y}
                  A ${segmentInnerRadius} ${segmentInnerRadius} 0 0 0 ${polarToCartesian(centerX, centerY, segmentInnerRadius, startAngle).x} ${polarToCartesian(centerX, centerY, segmentInnerRadius, startAngle).y}
                  Z`}
              fill={color}
              stroke="#fff"
              strokeWidth="1"
              onMouseEnter={() => {
                const anglePerSegment = 360 / data.length;
                const midAngle = (index * anglePerSegment) + (anglePerSegment / 2);
                const tooltipRadius = outerRadius * 0.7; // Position tooltip at 70% of outerRadius
                const { x, y } = polarToCartesian(centerX, centerY, tooltipRadius, midAngle);

                setTooltip({
                  criterion: item.criterion,
                  score: item["Point (Optjent)"],
                  x: x,
                  y: y,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        );
      })}

      

      {/* Category Labels - Moved after chart segments */}
      {data.map((item, index) => {
        const criterion = item.criterion;
        const anglePerSegment = 360 / data.length;
        const midAngle = (index * anglePerSegment) + (anglePerSegment / 2); // Middle of the segment

        // Position labels slightly outside the outerRadius
        const labelRadius = outerRadius + 20; // 20 pixels outside outerRadius
        const { x, y } = polarToCartesian(centerX, centerY, labelRadius, midAngle);

        return (
          <text
            key={`label-${criterion}`}
            x={x}
            y={y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="20"
            fontWeight="bold"
            fill="#000"
          >
            {criterion}
          </text>
        );
      })}

      {/* Central text for total score and ESG level */}
      <text x={centerX} y={centerY - 10} textAnchor="middle" fontSize="26" fontWeight="bold">
        {totalScore.toFixed(2)}
      </text>
      <text x={centerX} y={centerY + 20} textAnchor="middle" fontSize="20" fill="#000000">
        {esgLevel}
      </text>

      {/* Tooltip */}
      {tooltip && (
        <g pointer-events="none">
          <rect
            x={tooltip.x - 60} // Half of width (120/2)
            y={tooltip.y - 20} // Half of height (40/2)
            width={120}
            height={40}
            fill="rgba(0, 0, 0, 0.7)"
            rx="5"
            ry="5"
          />
          <text
            x={tooltip.x}
            y={tooltip.y + 5} // Adjust for vertical centering of text
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#fff"
            fontSize="14"
          >
            {`${tooltip.criterion}: ${tooltip.score.toFixed(2)}`}
          </text>
        </g>
      )}
    </svg>
  );
};

export default CustomPolarChart;