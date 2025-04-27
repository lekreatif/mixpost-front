import { useState, useEffect, useCallback } from "react";
import localforage from "localforage";
import { useUser } from "./useMe";

export function useLocalStoragePost<T>(key: string, initialValue: T) {
  const { data: userData, isLoading } = useUser();
  const user = userData ? userData.data.data : null;
  const userId = user?.id || "anonymous";
  const fullKey = `user_${userId}_${key}`;

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const value = await localforage.getItem<T>(fullKey);
        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error(`Error loading ${fullKey} from IndexedDB:`, error);
      }
    };
    loadStoredValue();
  }, [fullKey]);

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await localforage.setItem(fullKey, valueToStore);
      } catch (error) {
        console.error(`Error saving ${fullKey} to IndexedDB:`, error);
      }
    },
    [fullKey, storedValue]
  );

  if (!isLoading && !user) throw new Error("User not authenticated");

  return [storedValue, setValue] as const;
}
