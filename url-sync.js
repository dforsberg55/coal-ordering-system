// Real cloud sync for cross-device data sharing
class CloudSync {
    constructor() {
        this.storageKey = 'coalDemoData';
        this.cloudEndpoint = 'https://api.jsonbin.io/v3/b/67220b5ead19ca34f8c8b8c9';
        this.apiKey = '$2a$10$vQ8Z8Z8Z8Z8Z8Z8Z8Z8Z8u'; // Demo key - replace with your own
    }

    async saveData(data) {
        try {
            // Always save to localStorage first (offline backup)
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            // Try to save to cloud
            try {
                const response = await fetch(this.cloudEndpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': this.apiKey,
                        'X-Bin-Versioning': 'false'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    console.log('Data saved to cloud and locally');
                    return true;
                } else {
                    console.log('Cloud save failed, data saved locally only');
                    return true; // Still return true since local save worked
                }
            } catch (cloudError) {
                console.log('Cloud save failed, data saved locally only:', cloudError);
                return true; // Still return true since local save worked
            }
        } catch (error) {
            console.log('Save failed:', error);
            return false;
        }
    }

    async loadData() {
        try {
            // Try to load from cloud first
            try {
                const response = await fetch(this.cloudEndpoint + '/latest', {
                    headers: {
                        'X-Master-Key': this.apiKey
                    }
                });
                
                if (response.ok) {
                    const cloudData = await response.json();
                    if (cloudData && cloudData.record) {
                        // Update localStorage with cloud data
                        localStorage.setItem(this.storageKey, JSON.stringify(cloudData.record));
                        console.log('Data loaded from cloud');
                        return cloudData.record;
                    }
                }
            } catch (cloudError) {
                console.log('Cloud load failed, using local data:', cloudError);
            }
            
            // Fallback to localStorage
            const localData = localStorage.getItem(this.storageKey);
            if (localData) {
                console.log('Data loaded from local storage');
                return JSON.parse(localData);
            }
            
            return { users: [], orders: [] };
        } catch (error) {
            console.log('Load failed:', error);
            return { users: [], orders: [] };
        }
    }

    // Force sync from cloud (useful for manual refresh)
    async syncFromCloud() {
        try {
            const response = await fetch(this.cloudEndpoint + '/latest', {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (response.ok) {
                const cloudData = await response.json();
                if (cloudData && cloudData.record) {
                    localStorage.setItem(this.storageKey, JSON.stringify(cloudData.record));
                    return cloudData.record;
                }
            }
            return null;
        } catch (error) {
            console.log('Sync from cloud failed:', error);
            return null;
        }
    }
}

window.CloudSync = new CloudSync();
