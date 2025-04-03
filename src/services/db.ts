import { Report, JournalEntry, FoodItem } from '../types';

class DatabaseService {
  public db: IDBDatabase | null = null;
  private dbName = 'distincto_journal';
  private version = 1;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error opening database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('journalEntries')) {
          db.createObjectStore('journalEntries', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('foodItems')) {
          db.createObjectStore('foodItems', { keyPath: 'id' });
        }
      };
    });
  }

  public async initialize(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private async getStore(name: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction(name, mode);
    return transaction.objectStore(name);
  }

  async saveJournalEntry(entry: JournalEntry): Promise<string> {
    try {
      const store = await this.getStore('journalEntries', 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.put(entry);
        
        request.onsuccess = () => {
          resolve(entry.id);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to save journal entry'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async saveFoodItem(item: FoodItem): Promise<string> {
    try {
      const store = await this.getStore('foodItems', 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.put(item);
        
        request.onsuccess = () => {
          resolve(item.id);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to save food item'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getJournalEntry(id: string): Promise<JournalEntry | null> {
    try {
      const store = await this.getStore('journalEntries');
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to get journal entry'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getAllJournalEntries(): Promise<JournalEntry[]> {
    try {
      const store = await this.getStore('journalEntries');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to get journal entries'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getReports(): Promise<Report[]> {
    try {
      const store = await this.getStore('reports');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to get reports'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async saveReport(report: Report): Promise<string> {
    try {
      const store = await this.getStore('reports', 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.put(report);
        
        request.onsuccess = () => {
          resolve(report.id);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to save report'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getJournalEntries(childName?: string): Promise<JournalEntry[]> {
    try {
      const entries = await this.getAllJournalEntries();
      
      if (childName) {
        return entries.filter(entry => entry.childName === childName);
      }
      
      return entries;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getFoodItems(childName?: string): Promise<FoodItem[]> {
    try {
      const store = await this.getStore('foodItems');
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          let items = request.result;
          
          if (childName) {
            items = items.filter(item => item.childName === childName);
          }
          
          resolve(items);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to get food items'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async deleteFoodItem(id: string): Promise<void> {
    try {
      const store = await this.getStore('foodItems', 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error('Failed to delete food item'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    try {
      const store = await this.getStore('journalEntries', 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error('Failed to delete journal entry'));
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getUnsyncedJournalEntries(): Promise<JournalEntry[]> {
    try {
      const entries = await this.getAllJournalEntries();
      return entries.filter(entry => !entry.synced);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getUnsyncedFoodItems(): Promise<FoodItem[]> {
    try {
      const items = await this.getFoodItems();
      return items.filter(item => !item.synced);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getPendingSyncEntries(): Promise<(JournalEntry | FoodItem)[]> {
    try {
      const [journalEntries, foodItems] = await Promise.all([
        this.getUnsyncedJournalEntries(),
        this.getUnsyncedFoodItems()
      ]);
      
      return [...journalEntries, ...foodItems];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

const dbService = new DatabaseService();
export default dbService;
