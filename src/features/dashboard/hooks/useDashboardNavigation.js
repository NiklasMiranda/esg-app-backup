import { useCallback, useState } from 'react';

export default function useDashboardNavigation() {
  const [isNavOpen, setIsNavOpen] = useState(true); // State to control sidebar visibility

  const [activeView, setActiveView] = useState('dashboard'); // New state for main content view

  const [activeSection, setActiveSection] = useState('del1');

  // Callback to toggle sidebar visibility
  const toggleNav = useCallback(() => setIsNavOpen((prev) => !prev), []);

  const handleMainNavigation = useCallback((view) => {
    setActiveView(view);
    // If navigating to ESG Calculator, set activeSection to 'del1' as default
    if (view === 'esgCalculator') {
      setActiveSection('del1');
    }
    // Optionally close the sidebar after navigation on smaller screens
    // setIsNavOpen(false);
  }, []);

  return {
    isNavOpen,
    activeView,
    activeSection,

    setActiveSection,

    toggleNav,
    handleMainNavigation,
  };
}
