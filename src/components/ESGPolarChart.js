import React, { useRef, useEffect } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

const ESGPolarChart = ({ indicatorPoints, totalScore }) => {
  const chartRef = useRef(null);

  const data = Object.entries(indicatorPoints).map(([label, value]) => ({
    subject: label,
    value: value,
    fullMark: 100,
  }));

  // Funktion til at POSTe billedet til WordPress
  const handleCapture = async (imageDataUrl) => {
    if (!window.esgConfig) return;

    try {
      const response = await fetch(`${window.esgConfig.apiUrl}${window.esgConfig.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.esgConfig.nonce,
        },
        body: JSON.stringify({ polarChartImage: imageDataUrl }),
      });

      const result = await response.json();
      console.log('ESG-graf gemt:', result);
    } catch (err) {
      console.error('Kunne ikke gemme ESG-graf:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        }).then((canvas) => {
          const imageDataUrl = canvas.toDataURL('image/png');
          handleCapture(imageDataUrl); // Gem billedet automatisk
        });
      }
    }, 1500); // Forsinkelse for animationer

    return () => clearTimeout(timer);
  }, [data]); // Kører igen hvis data ændres

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