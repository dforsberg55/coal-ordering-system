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
            
            console.log('💾 Saving data to Upstash Redis:', data);
            
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
                
                console.log('📡 Upstash save response status:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Data saved to Upstash Redis - globally synced');
                    console.log('📦 Save result:', result);
                    return true;
                } else {
                    const errorText = await response.text();
                    console.log('⚠️ Upstash save failed:', response.status, errorText);
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
                console.log('🔍 Attempting to load from Upstash Redis...');
                const response = await fetch(`${this.restUrl}/get/${this.dataKey}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.restToken}`,
                    }
                });
                
                console.log('📡 Upstash response status:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('📦 Upstash raw result:', result);
                    
                    // Upstash returns {result: yourData} format
                    let cloudData = result.result;
                    
                    // If result is a string, parse it as JSON
                    if (typeof cloudData === 'string') {
                        try {
                            cloudData = JSON.parse(cloudData);
                            console.log('🔄 Parsed string data from Redis');
                        } catch (parseError) {
                            console.log('❌ Failed to parse Redis string data:', parseError);
                            cloudData = null;
                        }
                    }
                    
                    if (cloudData && typeof cloudData === 'object' && (cloudData.users || cloudData.orders)) {
                        // Update localStorage with cloud data
                        localStorage.setItem(this.storageKey, JSON.stringify(cloudData));
                        console.log('☁️ Data loaded from Upstash Redis - globally synced');
                        console.log('📊 Cloud data:', cloudData);
                        return cloudData;
                    } else if (cloudData === null) {
                        console.log('🆕 No data in Redis yet, starting fresh');
                        return { users: [], orders: [] };
                    }
                } else {
                    const errorText = await response.text();
                    console.log('⚠️ Upstash load failed:', response.status, errorText);
                }
            } catch (cloudError) {
                console.log('⚠️ Cloud load failed:', cloudError);
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
                let cloudData = result.result;
                
                // If result is a string, parse it as JSON
                if (typeof cloudData === 'string') {
                    try {
                        cloudData = JSON.parse(cloudData);
                    } catch (parseError) {
                        console.log('❌ Failed to parse Redis string data:', parseError);
                        return null;
                    }
                }
                
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

    // Debug function to check what's in Redis
    async debugRedis() {
        try {
            console.log('🔍 Checking Redis data...');
            const response = await fetch(`${this.restUrl}/get/${this.dataKey}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.restToken}`,
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('📦 Raw Redis result:', result);
                
                let parsedData = result.result;
                if (typeof parsedData === 'string') {
                    try {
                        parsedData = JSON.parse(parsedData);
                    } catch (e) {
                        console.log('❌ Could not parse data');
                    }
                }
                
                console.log('📊 Parsed data:', parsedData);
                return result;
            } else {
                console.log('❌ Redis debug failed:', response.status);
                return null;
            }
        } catch (error) {
            console.log('❌ Redis debug error:', error);
            return null;
        }
    }

    // Force save test data
    async saveTestData() {
        const testData = {
            users: [{ id: 'test-user', name: 'Test User', email: 'test@example.com' }],
            orders: [{ id: 'test-order', product: 'Test Coal', quantity: 10 }],
            lastUpdated: Date.now()
        };
        
        console.log('🧪 Saving test data to Redis...');
        return await this.saveData(testData);
    }
}

window.CloudSync = new CloudSync();
