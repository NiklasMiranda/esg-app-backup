import React from 'react';

const CircularProgress = ({ percentage, size = 24 }) => {
  const strokeWidth = 6;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const interpolateColor = (percent) => {
    const blue = [59, 130, 246];
    const green = [34, 197, 94];
    const r = Math.round(blue[0] + (green[0] - blue[0]) * (percent / 100));
    const g = Math.round(blue[1] + (green[1] - blue[1]) * (percent / 100));
    const b = Math.round(blue[2] + (green[2] - blue[2]) * (percent / 100));
    return `rgb(${r},${g},${b})`;
  };

  const progressColor = interpolateColor(percentage);

  return (
    <svg style={{ width: size, height: size }} className="esg-transform esg-rotate-[-90deg]">
      <circle
        className="esg-text-gray-300"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="esg-transition-all esg-duration-500 esg-ease-in-out"
        strokeWidth={strokeWidth}
        stroke={progressColor}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

export default CircularProgress;
