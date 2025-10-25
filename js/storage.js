// Storage Management for SecureMessage AI
// Handles localStorage operations with error handling and fallbacks

const Storage = {
    // Check if localStorage is available
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage not available:', error);
            return false;
        }
    },

    // Get item from localStorage
    get(key, defaultValue = null) {
        try {
            if (!this.isAvailable()) {
                return defaultValue;
            }
            
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            
            // Try to parse as JSON, fallback to string
            try {
                return JSON.parse(item);
            } catch (parseError) {
                return item;
            }
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    // Set item in localStorage
    set(key, value) {
        try {
            if (!this.isAvailable()) {
                console.warn('localStorage not available, cannot set:', key);
                return false;
            }
            
            const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded, attempting cleanup');
                this.cleanup();
                
                // Try again after cleanup
                try {
                    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(key, serializedValue);
                    return true;
                } catch (retryError) {
                    console.error('Storage set retry failed:', retryError);
                    return false;
                }
            }
            
            return false;
        }
    },

    // Remove item from localStorage
    remove(key) {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    // Clear all localStorage
    clear() {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    // Get all keys
    keys() {
        try {
            if (!this.isAvailable()) {
                return [];
            }
            
            return Object.keys(localStorage);
        } catch (error) {
            console.error('Storage keys error:', error);
            return [];
        }
    },

    // Get storage size
    getSize() {
        try {
            if (!this.isAvailable()) {
                return 0;
            }
            
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return total;
        } catch (error) {
            console.error('Storage size error:', error);
            return 0;
        }
    },

    // Cleanup old or large items
    cleanup() {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            const keys = this.keys();
            const itemsWithTimestamp = [];
            
            // Collect items with timestamps
            keys.forEach(key => {
                try {
                    const value = this.get(key);
                    if (value && typeof value === 'object' && value.timestamp) {
                        itemsWithTimestamp.push({
                            key: key,
                            timestamp: value.timestamp,
                            size: JSON.stringify(value).length
                        });
                    }
                } catch (error) {
                    // Skip problematic items
                }
            });
            
            // Sort by timestamp (oldest first)
            itemsWithTimestamp.sort((a, b) => a.timestamp - b.timestamp);
            
            // Remove oldest 25% of items
            const itemsToRemove = Math.floor(itemsWithTimestamp.length * 0.25);
            for (let i = 0; i < itemsToRemove; i++) {
                this.remove(itemsWithTimestamp[i].key);
            }
            
            console.log(`Cleaned up ${itemsToRemove} old storage items`);
            return true;
        } catch (error) {
            console.error('Storage cleanup error:', error);
            return false;
        }
    },

    // Check if key exists
    has(key) {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            return localStorage.getItem(key) !== null;
        } catch (error) {
            console.error('Storage has error:', error);
            return false;
        }
    },

    // Get multiple items
    getMultiple(keys, defaultValue = null) {
        const result = {};
        keys.forEach(key => {
            result[key] = this.get(key, defaultValue);
        });
        return result;
    },

    // Set multiple items
    setMultiple(items) {
        let success = true;
        Object.entries(items).forEach(([key, value]) => {
            if (!this.set(key, value)) {
                success = false;
            }
        });
        return success;
    },

    // Remove multiple items
    removeMultiple(keys) {
        let success = true;
        keys.forEach(key => {
            if (!this.remove(key)) {
                success = false;
            }
        });
        return success;
    },

    // Set item with expiration
    setWithExpiration(key, value, expirationMinutes = 60) {
        const item = {
            value: value,
            timestamp: Date.now(),
            expiration: Date.now() + (expirationMinutes * 60 * 1000)
        };
        return this.set(key, item);
    },

    // Get item with expiration check
    getWithExpiration(key, defaultValue = null) {
        try {
            const item = this.get(key);
            
            if (!item || typeof item !== 'object' || !item.expiration) {
                return defaultValue;
            }
            
            // Check if expired
            if (Date.now() > item.expiration) {
                this.remove(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (error) {
            console.error('Storage get with expiration error:', error);
            return defaultValue;
        }
    },

    // Export data
    export() {
        try {
            if (!this.isAvailable()) {
                return null;
            }
            
            const data = {};
            this.keys().forEach(key => {
                data[key] = this.get(key);
            });
            
            return {
                timestamp: Date.now(),
                data: data
            };
        } catch (error) {
            console.error('Storage export error:', error);
            return null;
        }
    },

    // Import data
    import(exportedData, overwrite = false) {
        try {
            if (!exportedData || !exportedData.data) {
                return false;
            }
            
            Object.entries(exportedData.data).forEach(([key, value]) => {
                if (overwrite || !this.has(key)) {
                    this.set(key, value);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Storage import error:', error);
            return false;
        }
    }
};

// Session storage wrapper
const SessionStorage = {
    isAvailable() {
        try {
            const test = '__session_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('sessionStorage not available:', error);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            if (!this.isAvailable()) {
                return defaultValue;
            }
            
            const item = sessionStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            
            try {
                return JSON.parse(item);
            } catch (parseError) {
                return item;
            }
        } catch (error) {
            console.error('SessionStorage get error:', error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('SessionStorage set error:', error);
            return false;
        }
    },

    remove(key) {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('SessionStorage remove error:', error);
            return false;
        }
    },

    clear() {
        try {
            if (!this.isAvailable()) {
                return false;
            }
            
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('SessionStorage clear error:', error);
            return false;
        }
    }
};

// Export for global use
window.Storage = Storage;
window.SessionStorage = SessionStorage;
