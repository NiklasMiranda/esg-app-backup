import React from 'react';

const CircularProgress = ({ percentage, size = 24 }) => {
  const strokeWidth = 6;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const interpolateColor = (percent) => {
    const startColor = [11, 57, 84]; // #0b3954
    const endColor = [205, 226, 180]; // #cde2b4
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (percent / 100));
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (percent / 100));
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (percent / 100));
    return `rgb(${r},${g},${b})`;
  };

  const progressColor = interpolateColor(percentage);

  return (
    <svg style={{ width: size, height: size, minWidth: size, minHeight: size }} className="esg-transform esg-rotate-[-90deg]">
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
