/**
 * Storage utility functions for handling local storage operations
 */

/**
 * Set an item in local storage with an optional expiration time
 * @param key - The key to store the value under
 * @param value - The value to store
 * @param expirationMinutes - Optional expiration time in minutes
 */
export const setStorageItem = <T>(key: string, value: T, expirationMinutes?: number): void => {
  try {
    const item = {
      value,
      expiration: expirationMinutes ? new Date().getTime() + expirationMinutes * 60 * 1000 : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

/**
 * Get an item from local storage
 * @param key - The key to retrieve the value for
 * @returns The stored value, or null if not found or expired
 */
export const getStorageItem = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    
    // Check if the item has expired
    if (item.expiration && new Date().getTime() > item.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value as T;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
};

/**
 * Remove an item from local storage
 * @param key - The key to remove
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
};

/**
 * Clear all items from local storage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if an item exists in local storage and is not expired
 * @param key - The key to check
 * @returns Boolean indicating if the item exists and is not expired
 */
export const hasStorageItem = (key: string): boolean => {
  return getStorageItem(key) !== null;
};

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'carebridge_auth_token',
  USER_DATA: 'carebridge_user_data',
  THEME: 'carebridge_theme',
  LANGUAGE: 'carebridge_language',
  NOTIFICATION_SETTINGS: 'carebridge_notification_settings',
  REMEMBER_ME: 'carebridge_remember_me'
};