import React, { useState, useEffect } from 'react';
import { FoodItem } from '../../types';
import dbService from '../../services/db';
import fileSystemService from '../../services/fileSystem';
import syncService from '../../services/sync';
import { Search, Plus } from 'lucide-react';
import FoodItemList from './FoodItemList';
import AddFoodForm from './AddFoodForm';
import FoodJourneyTip from './FoodJourneyTip';

const FoodJourney: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [children, setChildren] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize the database when component mounts
    const initDb = async () => {
      try {
        await dbService.initialize();
        await fileSystemService.initialize();
        await loadFoodItems();
        await loadChildren();
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Failed to initialize database. Please refresh the page.');
      }
    };
    
    initDb();

    // Clean up object URLs when component unmounts
    return () => {
      Object.values(imageCache).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  useEffect(() => {
    if (dbService.db) {
      loadFoodItems();
    }
  }, [selectedChild, refreshTrigger]);

  const loadFoodItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get all food items or items for a specific child
      const items = await dbService.getFoodItems(selectedChild || undefined);
      setFoodItems(items);
      
      // Load images for items with imageFile
      const newImageCache: Record<string, string> = {};
      for (const item of items) {
        if (item.imageFile) {
          try {
            const imageBlob = await fileSystemService.getImage(item.imageFile);
            if (imageBlob) {
              newImageCache[item.id] = URL.createObjectURL(imageBlob);
            }
          } catch (err) {
            console.error(`Error loading image for ${item.name}:`, err);
          }
        }
      }
      
      // Revoke old object URLs before setting new ones
      Object.values(imageCache).forEach(url => {
        URL.revokeObjectURL(url);
      });
      
      setImageCache(newImageCache);
    } catch (err) {
      console.error('Error loading food items:', err);
      setError('Failed to load food items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadChildren = async () => {
    try {
      // Get all journal entries to extract child names
      const journalEntries = await dbService.getJournalEntries();
      
      // Extract unique child names
      const uniqueChildren = Array.from(new Set(journalEntries.map(entry => entry.childName)));
      setChildren(uniqueChildren);
      
      // Set the first child as selected if none is selected
      if (uniqueChildren.length > 0 && !selectedChild) {
        setSelectedChild(uniqueChildren[0]);
      }
    } catch (err) {
      console.error('Error loading children:', err);
    }
  };

  const handleAddFoodItem = async (newFoodItem: FoodItem, imageFile?: File) => {
    try {
      let imageFilePath: string | undefined;
      
      // Save the image if one was selected
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        imageFilePath = await fileSystemService.saveImage(newFoodItem.childName, fileName, imageFile);
      }
      
      const foodItem: FoodItem = {
        ...newFoodItem,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        synced: false
      };
      
      if (imageFilePath) {
        foodItem.imageFile = imageFilePath;
      }
      
      await dbService.saveFoodItem(foodItem);
      
      // Register for background sync
      await syncService.registerForSync();
      
      // Close the form
      setShowAddForm(false);
      
      // Trigger a refresh of the food items list
      setRefreshTrigger(prev => prev + 1);
      
      // Clear any previous errors
      setError('');
    } catch (err) {
      console.error('Error adding food item:', err);
      setError('Failed to add food item. Please try again.');
    }
  };

  const handleDeleteFoodItem = async (itemId: string) => {
    try {
      // Find the item to get its image file path if it exists
      const itemToDelete = foodItems.find(item => item.id === itemId);
      
      if (itemToDelete) {
        // Delete the image file if it exists
        if (itemToDelete.imageFile) {
          try {
            await fileSystemService.deleteImage(itemToDelete.imageFile);
          } catch (err) {
            console.error('Error deleting image file:', err);
            // Continue with deletion even if image deletion fails
          }
          
          // Revoke the object URL to prevent memory leaks
          if (imageCache[itemId]) {
            URL.revokeObjectURL(imageCache[itemId]);
            const newImageCache = { ...imageCache };
            delete newImageCache[itemId];
            setImageCache(newImageCache);
          }
        }
        
        // Delete the food item from the database
        await dbService.deleteFoodItem(itemId);
        
        // Register for background sync
        await syncService.registerForSync();
        
        // Update the UI by removing the deleted item
        setFoodItems(prevItems => prevItems.filter(item => item.id !== itemId));
        
        // Clear any previous errors
        setError('');
      }
    } catch (err) {
      console.error('Error deleting food item:', err);
      setError('Failed to delete food item. Please try again.');
    }
  };

  const handleUpdateFoodCategory = async (itemId: string, category: 'new' | 'safe' | 'sometimes' | 'notYet') => {
    try {
      const itemToUpdate = foodItems.find(item => item.id === itemId);
      
      if (itemToUpdate && itemToUpdate.category !== category) {
        // Update the category
        const updatedItem: FoodItem = {
          ...itemToUpdate,
          category,
          synced: false
        };
        
        await dbService.saveFoodItem(updatedItem);
        
        // Register for background sync
        await syncService.registerForSync();
        
        // Update the UI immediately
        setFoodItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? updatedItem : item
          )
        );
      }
    } catch (err) {
      console.error('Error updating food item category:', err);
      setError('Failed to update food item category. Please try again.');
    }
  };

  const filteredItems = foodItems.filter(item => {
    // Filter by search term
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by selected child (already filtered in the database query)
    return true;
  });

  // Group items by category
  const categorizedItems = {
    new: filteredItems.filter(item => item.category === 'new'),
    safe: filteredItems.filter(item => item.category === 'safe'),
    sometimes: filteredItems.filter(item => item.category === 'sometimes'),
    notYet: filteredItems.filter(item => item.category === 'notYet')
  };

  return (
    <div className="space-y-8 mt-12 px-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <label htmlFor="childFilter" className="text-sm font-medium text-gray-700">
            Child:
          </label>
          <select
            id="childFilter"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All children</option>
            {children.map((child) => (
              <option key={child} value={child}>
                {child}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative flex-grow max-w-md mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-raspberry hover:bg-raspberry-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-raspberry"
        >
          <Plus size={16} className="mr-2" />
          Add Food
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {showAddForm && (
        <AddFoodForm 
          onSubmit={handleAddFoodItem} 
          onCancel={() => setShowAddForm(false)} 
          children={children}
          defaultChildName={selectedChild}
        />
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-raspberry"></div>
          <p className="mt-4 text-gray-600">Loading food items...</p>
        </div>
      ) : (
        <div className="mt-8">
          <FoodItemList 
            categorizedItems={categorizedItems} 
            imageCache={imageCache} 
            onUpdateCategory={handleUpdateFoodCategory}
            onDeleteItem={handleDeleteFoodItem}
          />
        </div>
      )}
      
      <div className="mt-8">
        <FoodJourneyTip />
      </div>
    </div>
  );
};

export default FoodJourney;
