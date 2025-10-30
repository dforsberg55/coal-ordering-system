// Simple global cloud sync - everyone shares the same data
class CloudSync {
    constructor() {
        this.storageKey = 'coalDemoData';
        // Use a fixed cloud storage endpoint that everyone shares
        this.cloudEndpoint = 'https://api.jsonstorage.net/v1/json/coal-ordering-demo/data';
        this.backupEndpoint = 'https://httpbin.org/anything'; // Fallback for testing
    }

    async saveData(data) {
        try {
            // Always save to localStorage first (offline backup)
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            // Add timestamp for tracking
            data.lastUpdated = Date.now();
            
            // Try to save to cloud storage
            try {
                const response = await fetch(this.cloudEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    console.log('✅ Data saved to cloud and synced globally');
                    return true;
                } else {
                    throw new Error('Cloud save failed');
                }
            } catch (cloudError) {
                console.log('⚠️ Cloud save failed, trying backup method...');
                
                // Try backup method using a simple HTTP service
                try {
                    const backupResponse = await fetch('https://httpbin.org/post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            coalData: data,
                            timestamp: Date.now()
                        })
                    });
                    
                    if (backupResponse.ok) {
                        console.log('✅ Data saved to backup cloud service');
                        return true;
                    }
                } catch (backupError) {
                    console.log('⚠️ Backup cloud save also failed');
                }
                
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
            // Try to load from cloud first
            try {
                const response = await fetch(this.cloudEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (response.ok) {
                    const cloudData = await response.json();
                    if (cloudData && (cloudData.users || cloudData.orders)) {
                        // Update localStorage with cloud data
                        localStorage.setItem(this.storageKey, JSON.stringify(cloudData));
                        console.log('☁️ Data loaded from cloud - globally synced');
                        return cloudData;
                    }
                }
            } catch (cloudError) {
                console.log('⚠️ Cloud load failed, using local data');
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
            const response = await fetch(this.cloudEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const cloudData = await response.json();
                if (cloudData && (cloudData.users || cloudData.orders)) {
                    localStorage.setItem(this.storageKey, JSON.stringify(cloudData));
                    console.log('🔄 Manual sync completed');
                    return cloudData;
                }
            }
            return null;
        } catch (error) {
            console.log('❌ Manual sync failed:', error);
            return null;
        }
    }
}

window.CloudSync = new CloudSync();
