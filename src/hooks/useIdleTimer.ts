import { useEffect, useCallback } from "react";
import { useLogout } from "./useLogout";
import { resetInactivityTimer } from "@/services/api";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes en millisecondes

export const useIdleTimer = () => {
  const { mutate: logout } = useLogout();

  const resetTimer = useCallback(() => {
    resetInactivityTimer();
  }, []);

  useEffect(() => {
    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "mousemove",
      "user_activity", // Événement personnalisé pour les requêtes API
    ];

    const handleActivity = () => {
      resetTimer();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const inactivityTimeout = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(inactivityTimeout);
    };
  }, [logout, resetTimer]);

  return resetTimer;
};
