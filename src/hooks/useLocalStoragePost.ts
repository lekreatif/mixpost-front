import { useState, useEffect, useCallback } from 'react'
import localforage from 'localforage'

export function useLocalStoragePost<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const value = await localforage.getItem<T>(key)
        if (value !== null) {
          setStoredValue(value)
        }
      } catch (error) {
        console.error(`Error loading ${key} from IndexedDB:`, error)
      }
    }
    loadStoredValue()
  }, [key])

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        await localforage.setItem(key, valueToStore)
      } catch (error) {
        console.error(`Error saving ${key} to IndexedDB:`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}
