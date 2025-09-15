import React from 'react';

const CircularProgress = ({ percentage }) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Interpolate color from blue to green
  const interpolateColor = (percent) => {
    const blue = [59, 130, 246]; // Tailwind blue-500: #3B82F6
    const green = [34, 197, 94]; // Tailwind green-500: #22C55E

    const r = Math.round(blue[0] + (green[0] - blue[0]) * (percent / 100));
    const g = Math.round(blue[1] + (green[1] - blue[1]) * (percent / 100));
    const b = Math.round(blue[2] + (green[2] - blue[2]) * (percent / 100));

    return `rgb(${r},${g},${b})`;
  };

  const progressColor = interpolateColor(percentage);

  return (
    <svg className="esg-w-6 esg-h-6 esg-transform esg-rotate-[-90deg]">
      <circle
        className="esg-text-gray-300"
        strokeWidth="2"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="12"
        cy="12"
      />
      <circle
        className="esg-transition-all esg-duration-500 esg-ease-in-out"
        strokeWidth="2"
        stroke={progressColor}
        fill="transparent"
        r={radius}
        cx="12"
        cy="12"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

export default CircularProgress;