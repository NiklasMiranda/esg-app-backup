import React, { useRef, useState, useEffect, useCallback } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage, alt = 'Before and After Comparison' }) => {
  const sliderRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50); // Initial position 50%
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      const { left, width } = sliderRef.current.getBoundingClientRect();
      let clientX = e.clientX;

      // Handle touch events
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      }

      const newPosition = ((clientX - left) / width) * 100;
      if (newPosition >= 0 && newPosition <= 100) {
        setSliderPosition(newPosition);
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent default drag behavior
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent scrolling while dragging
  };

  return (
    <div
      ref={sliderRef}
      className="esg-relative esg-w-full esg-max-w-7xl esg-mx-auto esg-h-[600px] esg-select-none esg-overflow-hidden esg-rounded-lg esg-shadow-xl"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img src={beforeImage} alt={`Before ${alt}`} className="esg-absolute esg-inset-0 esg-w-full esg-h-full esg-object-cover" />
      <img
        src={afterImage}
        alt={`After ${alt}`}
        className="esg-absolute esg-inset-0 esg-w-full esg-h-full esg-object-cover"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <div
        className="esg-absolute esg-top-0 esg-bottom-0 esg-w-1 esg-bg-black esg-cursor-ew-resize esg-shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="esg-absolute esg-top-1/2 esg-left-1/2 esg-transform -esg-translate-x-1/2 -esg-translate-y-1/2 esg-w-8 esg-h-8 esg-bg-black esg-rounded-full esg-flex esg-items-center esg-justify-center esg-shadow-md">
          <svg className="esg-w-5 esg-h-5 esg-text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;