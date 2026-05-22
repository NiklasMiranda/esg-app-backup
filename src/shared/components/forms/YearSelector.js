import React from 'react';
import { FaPlus } from "react-icons/fa";

function YearSelector({
  availableYears = [],
  currentYear,
  onSelectYear,
  onAddNewYear,
  showAddYearInput,       
  newYearValue,           
  handleYearInputChange,  
  handleYearInputConfirm, 
  handleYearInputCancel,  
  addYearError,           
}) {
  const activeContentStyles = 'esg-bg-white esg-text-black esg-font-extrabold';
  const inactiveContentStyles = 'hover:esg-bg-white esg-text-gray-700';
  const activeBorderColor = 'esg-border-[#0b3954]';
  const inactiveBorderColor = 'esg-border-gray-300';
  const baseButtonFlex = 'esg-flex-grow esg-basis-0 esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center esg-gap-1';

  return (
    <div className={`esg-flex esg-items-center esg-border-b-[1px] ${inactiveBorderColor} esg-relative esg-mb-0`}>
      <div className="esg-flex esg-flex-grow">
        {availableYears.map((year, index) => {
          const isActive = year === currentYear;
          const isLastAvailableYear = index === availableYears.length - 1;
          const hasRightBorder = !isLastAvailableYear || showAddYearInput;
          return (
            <button
              key={year}
              onClick={() => onSelectYear(year)}
              className={`
                ${baseButtonFlex}
                ${isActive
                  ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                  : inactiveContentStyles
                }
                ${hasRightBorder ? `esg-border-r-[1px] ${inactiveBorderColor}` : ''}
              `}
            >
              {year}
            </button>
          );
        })}
        {showAddYearInput ? (
          <div className={`
            ${baseButtonFlex}
            esg-flex-nowrap esg-justify-start esg-relative 
            esg-border-r-[1px] ${inactiveBorderColor} 
            ${addYearError ? 'esg-border-red-500' : ''}
          `}>
            <input
              type="number"
              value={newYearValue}
              onChange={handleYearInputChange}
              placeholder="Indtast år"
              className="esg-w-24 esg-p-1 esg-border esg-border-gray-300 esg-rounded-md esg-text-center"
            />
            <button onClick={handleYearInputConfirm} className="esg-text-green-600 hover:esg-text-green-800 esg-ml-2">✓</button>
            <button onClick={handleYearInputCancel} className="esg-text-red-600 hover:esg-text-red-800">✕</button>
            {addYearError && <p className="esg-text-red-500 esg-text-xs esg-absolute esg-left-0 esg-right-0 esg-bottom-[-1.5rem] esg-text-center">{addYearError}</p>}
          </div>
        ) : (
          <button
            onClick={onAddNewYear}
            className={`
              ${baseButtonFlex}
              esg-text-gray-700 hover:esg-bg-gray-100
            `}
          >
            <FaPlus />
          </button>
        )}
      </div>
    </div>
  );
}

export default YearSelector;
