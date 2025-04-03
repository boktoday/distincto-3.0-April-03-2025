export interface JournalEntry {
  id: string;
  childName: string;
  timestamp: number;
  medicationNotes: string;
  educationNotes: string;
  socialEngagementNotes: string;
  sensoryProfileNotes: string;
  foodNutritionNotes: string;
  behavioralNotes: string;
  magicMoments: string;
  synced: boolean;
}

export interface FoodItem {
  id: string;
  childName: string;
  name: string;
  category: 'new' | 'safe' | 'sometimes' | 'notYet';
  imageUrl?: string;
  imageFile?: string; // File handle reference
  notes: string;
  timestamp: number;
  synced: boolean;
}

export interface Report {
  id: string;
  childName: string;
  type: 'pattern' | 'trend' | 'summary' | 'recommendations';
  content: string;
  timestamp: number;
  generatedFrom: string[]; // Array of journal entry IDs
}

export interface SyncStatus {
  lastSync: number;
  pendingSync: number;
  isOnline: boolean;
}
