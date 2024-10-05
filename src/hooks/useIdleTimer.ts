import { useEffect, useCallback, useRef } from "react";
import { useLogout } from "./useLogout";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
export const useIdleTimer = () => {
  const { mutate: logout } = useLogout();
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "mousemove",
      "user_activity",
    ];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initial setup

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    };
  }, [resetTimer]);

  return resetTimer;
};
