/**
 * Local storage utility with error handling
 */
export const storage = {
  /**
   * Get an item from local storage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * Set an item in local storage
   */
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  /**
   * Remove an item from local storage
   */
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all items from local storage
   */
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Session storage utility with error handling
 */
export const sessionStorage = {
  /**
   * Get an item from session storage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * Set an item in session storage
   */
  set<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
    }
  },

  /**
   * Remove an item from session storage
   */
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },

  /**
   * Clear all items from session storage
   */
  clear(): void {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },
};
