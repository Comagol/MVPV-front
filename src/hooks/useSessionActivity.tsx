import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useSessionActivity = () => {
  const { extendSession, checkSessionTimeout } = useAuth();

  // Track user activity events
  const handleActivity = useCallback(() => {
    extendSession();
  }, [extendSession]);

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Check session timeout every minute
    const timeoutCheck = setInterval(() => {
      if (checkSessionTimeout()) {
        // Session expired, user will be logged out automatically
        console.log('Session expired due to inactivity');
      }
    }, 60000);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(timeoutCheck);
    };
  }, [handleActivity, checkSessionTimeout]);

  return {
    extendSession,
    checkSessionTimeout
  };
};