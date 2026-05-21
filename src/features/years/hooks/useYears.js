import { useCallback, useEffect, useState } from 'react';

import {
  createEmptyCompanyBasismodulData,
  fetchAvailableYears,
} from '../../../api';

export default function useYears({ isLoggedIn, userCompanyId }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [availableYears, setAvailableYears] = useState([]);

  const [showAddYearInput, setShowAddYearInput] = useState(false);

  const [newYearValue, setNewYearValue] = useState('');

  const [addYearError, setAddYearError] = useState('');

  const onAddNewYear = useCallback(() => {
    setShowAddYearInput(true);
    setNewYearValue(''); // Clear previous input
    setAddYearError(''); // Clear previous error
  }, []);

  const handleYearInputChange = useCallback((e) => {
    setNewYearValue(e.target.value);
    setAddYearError(''); // Clear error on input change
  }, []);

  const handleYearInputCancel = useCallback(() => {
    setShowAddYearInput(false);
    setNewYearValue('');
    setAddYearError('');
  }, []);

  const handleYearInputConfirm = useCallback(async () => {
    const year = parseInt(newYearValue, 10);
    const currentActualYear = new Date().getFullYear(); // Get current actual year

    if (isNaN(year) || year < 1000 || year > 9999) {
      // Basic year validation
      setAddYearError('Indtast venligst et gyldigt årstal (f.eks. 2023).');
      return;
    }

    const minYear = currentActualYear - 5;
    const maxYear = currentActualYear + 5;

    if (year < minYear || year > maxYear) {
      setAddYearError(`Årstal skal være mellem ${minYear} og ${maxYear}.`);
      return;
    }

    if (availableYears.includes(year)) {
      setAddYearError('Årstal findes allerede.');
      return;
    }

    const updatedYears = [...availableYears, year].sort((a, b) => a - b);
    setAvailableYears(updatedYears);
    setCurrentYear(year); // Set the newly added year as current
    setShowAddYearInput(false); // Hide input
    setNewYearValue('');
    setAddYearError('');

    // Persist the new year in the backend by creating an empty entry
    try {
      await createEmptyCompanyBasismodulData(userCompanyId, year);
      console.log(`Successfully created empty data for new year ${year}.`);
    } catch (error) {
      console.error(`Error persisting new year ${year} in backend:`, error);
      // Optionally, handle error: maybe revert UI state or show a message
    }
  }, [newYearValue, availableYears, userCompanyId]); // Add userCompanyId to dependencies

  useEffect(() => {
    const getAvailableYears = async () => {
      console.log(
        'DEBUG: getAvailableYears effect triggered. isLoggedIn:',
        isLoggedIn,
        'userCompanyId:',
        userCompanyId,
      );
      if (isLoggedIn && userCompanyId) {
        try {
          console.log(
            'DEBUG: Calling fetchAvailableYears for companyId:',
            userCompanyId,
          );
          const years = await fetchAvailableYears(userCompanyId);
          console.log('DEBUG: fetchAvailableYears returned years:', years);
          if (years.length > 0) {
            const sortedYears = years.sort((a, b) => a - b);
            setAvailableYears(sortedYears);
            const actualCurrentYear = new Date().getFullYear(); // Assuming 2026 based on user context
            if (sortedYears.includes(actualCurrentYear)) {
              setCurrentYear(actualCurrentYear);
            } else if (sortedYears.length > 0) {
              setCurrentYear(sortedYears[sortedYears.length - 1]); // Fallback to latest year if current year not available
            }
          } else {
            const actualCurrentYear = new Date().getFullYear();
            setAvailableYears([actualCurrentYear]);
            setCurrentYear(actualCurrentYear);
            console.log(
              'DEBUG: No years from API, setting to current actual year:',
              actualCurrentYear,
            );
          }
        } catch (error) {
          console.error('DEBUG: Error fetching available years:', error);
          const actualCurrentYear = new Date().getFullYear();
          setAvailableYears([actualCurrentYear]);
          setCurrentYear(actualCurrentYear);
          console.log(
            'DEBUG: Error fallback: setting to current actual year:',
            actualCurrentYear,
          );
        }
      }
    };
    getAvailableYears();
  }, [isLoggedIn, userCompanyId]); // Dependencies: runs when login status or company ID changes

  return {
    currentYear,
    setCurrentYear,

    availableYears,

    showAddYearInput,
    newYearValue,
    addYearError,

    onAddNewYear,
    handleYearInputChange,
    handleYearInputConfirm,
    handleYearInputCancel,
  };
}
