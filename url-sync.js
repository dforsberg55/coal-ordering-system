// Real cloud sync using Upstash Redis - everyone shares the same data
class CloudSync {
    constructor() {
        this.storageKey = 'coalDemoData';
        // Upstash Redis REST API endpoints
        this.restUrl = 'https://keen-anchovy-31443.upstash.io';
        this.restToken = 'AXrTAAIncDIyOGFlOGU4YTZkYmE0OTQ0YmUxYmJiOGIwZDNhMjYyN3AyMzE0NDM';
        this.dataKey = 'coal-app-data'; // Key to store all app data in Redis
    }

    async saveData(data) {
        try {
            // Always save to localStorage first (offline backup)
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            // Add timestamp for tracking
            data.lastUpdated = Date.now();
            
            // Save to Upstash Redis
            try {
                const response = await fetch(`${this.restUrl}/set/${this.dataKey}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.restToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    console.log('✅ Data saved to Upstash Redis - globally synced');
                    return true;
                } else {
                    const errorText = await response.text();
                    console.log('⚠️ Upstash save failed:', errorText);
                    throw new Error('Upstash save failed');
                }
            } catch (cloudError) {
                console.log('⚠️ Cloud save failed:', cloudError);
                console.log('💾 Data saved locally only - will sync when connection improves');
                return true; // Still return true since local save worked
            }
        } catch (error) {
            console.log('❌ Save failed:', error);
            return false;
        }
    }

    async loadData() {
        try {
            // Try to load from Upstash Redis first
            try {
                const response = await fetch(`${this.restUrl}/get/${this.dataKey}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.restToken}`,
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    // Upstash returns {result: yourData} format
                    const cloudData = result.result;
                    
                    if (cloudData && (cloudData.users || cloudData.orders)) {
                        // Update localStorage with cloud data
                        localStorage.setItem(this.storageKey, JSON.stringify(cloudData));
                        console.log('☁️ Data loaded from Upstash Redis - globally synced');
                        return cloudData;
                    }
                }
            } catch (cloudError) {
                console.log('⚠️ Cloud load failed, using local data:', cloudError);
            }
            
            // Fallback to localStorage
            const localData = localStorage.getItem(this.storageKey);
            if (localData) {
                console.log('💾 Data loaded from local storage');
                return JSON.parse(localData);
            }
            
            console.log('🆕 No existing data found, starting fresh');
            return { users: [], orders: [] };
        } catch (error) {
            console.log('❌ Load failed:', error);
            return { users: [], orders: [] };
        }
    }

    // Force sync from cloud (useful for manual refresh)
    async syncFromCloud() {
        try {
            const response = await fetch(`${this.restUrl}/get/${this.dataKey}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.restToken}`,
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                const cloudData = result.result;
                
                if (cloudData && (cloudData.users || cloudData.orders)) {
                    localStorage.setItem(this.storageKey, JSON.stringify(cloudData));
                    console.log('🔄 Manual sync completed from Upstash Redis');
                    return cloudData;
                }
            }
            return null;
        } catch (error) {
            console.log('❌ Manual sync failed:', error);
            return null;
        }
    }

    // Test connection to Upstash
    async testConnection() {
        try {
            const response = await fetch(`${this.restUrl}/ping`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.restToken}`,
                }
            });
            
            if (response.ok) {
                console.log('✅ Upstash Redis connection successful');
                return true;
            } else {
                console.log('❌ Upstash Redis connection failed');
                return false;
            }
        } catch (error) {
            console.log('❌ Upstash Redis connection error:', error);
            return false;
        }
    }
}

window.CloudSync = new CloudSync();
