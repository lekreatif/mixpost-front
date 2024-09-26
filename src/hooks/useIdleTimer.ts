import { useEffect, useRef, useCallback } from "react";
import { useLogout } from "./useLogout";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes en millisecondes

export const useIdleTimer = () => {
  const { mutate: logout } = useLogout();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "mousemove",
      "user_activity", // Événement personnalisé pour les requêtes API
    ];

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return resetTimer;
};
