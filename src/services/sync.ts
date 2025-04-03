import dbService from './db';
import { JournalEntry, FoodItem, SyncStatus } from '../types';

export class SyncService {
  private syncStatus: SyncStatus = {
    lastSync: 0,
    pendingSync: 0,
    isOnline: navigator.onLine
  };

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Initialize sync status
    this.loadSyncStatus();
  }

  private async loadSyncStatus(): Promise<void> {
    // In a real app, this would load from IndexedDB
    const storedStatus = localStorage.getItem('syncStatus');
    if (storedStatus) {
      this.syncStatus = JSON.parse(storedStatus);
    }
  }

  private async saveSyncStatus(): Promise<void> {
    // In a real app, this would save to IndexedDB
    localStorage.setItem('syncStatus', JSON.stringify(this.syncStatus));
  }

  private handleOnline(): void {
    this.syncStatus.isOnline = true;
    this.saveSyncStatus();
    
    // Trigger sync when we come back online
    this.syncData();
  }

  private handleOffline(): void {
    this.syncStatus.isOnline = false;
    this.saveSyncStatus();
  }

  async syncData(): Promise<boolean> {
    if (!this.syncStatus.isOnline) {
      console.log('Cannot sync: offline');
      return false;
    }

    try {
      // Get all unsynced data
      const journalEntries = await dbService.getUnsyncedJournalEntries();
      const foodItems = await dbService.getUnsyncedFoodItems();
      
      if (journalEntries.length === 0 && foodItems.length === 0) {
        console.log('No data to sync');
        return true;
      }
      
      // In a real app, this would send data to a server
      console.log(`Syncing ${journalEntries.length} journal entries and ${foodItems.length} food items`);
      
      // Simulate successful sync
      for (const entry of journalEntries) {
        entry.synced = true;
        await dbService.saveJournalEntry(entry);
      }
      
      for (const item of foodItems) {
        item.synced = true;
        await dbService.saveFoodItem(item);
      }
      
      // Update sync status
      this.syncStatus.lastSync = Date.now();
      this.syncStatus.pendingSync = 0;
      await this.saveSyncStatus();
      
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      return false;
    }
  }

  async registerForSync(): Promise<boolean> {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-data');
        return true;
      } catch (error) {
        console.error('Error registering for background sync:', error);
        return false;
      }
    }
    return false;
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
}

// Create and export a singleton instance
const syncService = new SyncService();
export default syncService;
