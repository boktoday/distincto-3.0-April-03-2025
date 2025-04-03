import { openDB } from 'idb';

const FILE_SYSTEM_DB_NAME = 'FileSystemDB';
const FILE_SYSTEM_DB_VERSION = 1;
const IMAGE_STORE_NAME = 'images';

class FileSystemService {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(FILE_SYSTEM_DB_NAME, FILE_SYSTEM_DB_VERSION);

      request.onerror = (event) => {
        console.error('Error opening file system database:', event);
        reject('Could not open file system database');
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('File system database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for images
        if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
          db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'path' });
        }
      };
    });
  }

  async saveImage(childName: string, fileName: string, file: File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        try {
          await this.initialize();
        } catch (err) {
          reject('File system database not initialized');
          return;
        }
      }

      try {
        // Create a path for the image
        const path = `${childName}/${fileName}`;
        
        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Save to IndexedDB
        const transaction = this.db!.transaction([IMAGE_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(IMAGE_STORE_NAME);
        
        const request = store.put({
          path,
          data: arrayBuffer,
          type: file.type,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => {
          resolve(path);
        };
        
        request.onerror = (event) => {
          console.error('Error saving image:', event);
          reject('Failed to save image');
        };
      } catch (err) {
        console.error('Error processing image:', err);
        reject('Failed to process image');
      }
    });
  }

  async getImage(path: string): Promise<Blob | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        try {
          await this.initialize();
        } catch (err) {
          reject('File system database not initialized');
          return;
        }
      }

      const transaction = this.db!.transaction([IMAGE_STORE_NAME], 'readonly');
      const store = transaction.objectStore(IMAGE_STORE_NAME);
      const request = store.get(path);
      
      request.onsuccess = () => {
        if (request.result) {
          const { data, type } = request.result;
          const blob = new Blob([data], { type });
          resolve(blob);
        } else {
          console.log(`Image not found: ${path}`);
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting image:', event);
        reject('Failed to get image');
      };
    });
  }

  async deleteImage(path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        try {
          await this.initialize();
        } catch (err) {
          reject('File system database not initialized');
          return;
        }
      }

      const transaction = this.db!.transaction([IMAGE_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(IMAGE_STORE_NAME);
      const request = store.delete(path);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error deleting image:', event);
        reject('Failed to delete image');
      };
    });
  }
}

const fileSystemService = new FileSystemService();
export default fileSystemService;
