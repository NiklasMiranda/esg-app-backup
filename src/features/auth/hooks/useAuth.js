import { useCallback, useEffect, useState } from 'react';

import { logoutUser } from 'api';

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('authToken'),
  );

  const [userCompanyId, setUserCompanyId] = useState(null);

  const [showLandingPage, setShowLandingPage] = useState(true);

  useEffect(() => {
    if (isLoggedIn && !userCompanyId) {
      setUserCompanyId(1);
      setShowLandingPage(false); // If already logged in, skip landing page
    }
  }, [isLoggedIn, userCompanyId]);

  const handleLoginSuccess = useCallback((token, companyId) => {
    setIsLoggedIn(true);
    setUserCompanyId(companyId);
    setShowLandingPage(false);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();

      setIsLoggedIn(false);
      setUserCompanyId(null);
      setShowLandingPage(true); // Go back to landing page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigateToLogin = () => {
    setShowLandingPage(false); // Transition from landing page to login form
  };

  const handleNavigateToHome = () => {
    setShowLandingPage(true); // Go to the landing page
    setIsLoggedIn(false); // Ensure not logged in state
    setUserCompanyId(null); // Clear user company ID
  };

  return {
    isLoggedIn,
    userCompanyId,
    showLandingPage,

    handleLoginSuccess,
    handleLogout,

    handleNavigateToLogin,
    handleNavigateToHome,
  };
}
