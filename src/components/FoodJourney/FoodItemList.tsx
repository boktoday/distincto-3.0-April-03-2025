import React, { useState } from 'react';
import { FoodItem } from '../../types';
import FoodCategory from './FoodCategory';

interface FoodItemListProps {
  categorizedItems: {
    new: FoodItem[];
    safe: FoodItem[];
    sometimes: FoodItem[];
    notYet: FoodItem[];
  };
  imageCache: Record<string, string>;
  onUpdateCategory: (itemId: string, category: 'new' | 'safe' | 'sometimes' | 'notYet') => void;
  onDeleteItem: (itemId: string) => void;
}

const FoodItemList: React.FC<FoodItemListProps> = ({ 
  categorizedItems, 
  imageCache, 
  onUpdateCategory,
  onDeleteItem
}) => {
  const [draggedItem, setDraggedItem] = useState<FoodItem | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: FoodItem) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);
    
    // Add a visual indicator for the dragged item
    if (e.currentTarget instanceof HTMLElement) {
      setTimeout(() => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.classList.add('opacity-50');
        }
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
    setDraggedItem(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (e: React.DragEvent, category: 'new' | 'safe' | 'sometimes' | 'notYet') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, category: 'new' | 'safe' | 'sometimes' | 'notYet') => {
    e.preventDefault();
    setDragOverCategory(null);
    
    if (draggedItem && draggedItem.category !== category) {
      onUpdateCategory(draggedItem.id, category);
    }
    
    setDraggedItem(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <FoodCategory
        title="New Food"
        count={categorizedItems.new.length}
        items={categorizedItems.new}
        color="green"
        category="new"
        imageCache={imageCache}
        isDragOver={dragOverCategory === 'new'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, 'new')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'new')}
        onDeleteItem={onDeleteItem}
      />
      
      <FoodCategory
        title="Safe Food"
        count={categorizedItems.safe.length}
        items={categorizedItems.safe}
        color="blue"
        category="safe"
        imageCache={imageCache}
        isDragOver={dragOverCategory === 'safe'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, 'safe')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'safe')}
        onDeleteItem={onDeleteItem}
      />
      
      <FoodCategory
        title="Sometimes Food"
        count={categorizedItems.sometimes.length}
        items={categorizedItems.sometimes}
        color="yellow"
        category="sometimes"
        imageCache={imageCache}
        isDragOver={dragOverCategory === 'sometimes'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, 'sometimes')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'sometimes')}
        onDeleteItem={onDeleteItem}
      />
      
      <FoodCategory
        title="Not Yet Food"
        count={categorizedItems.notYet.length}
        items={categorizedItems.notYet}
        color="red"
        category="notYet"
        imageCache={imageCache}
        isDragOver={dragOverCategory === 'notYet'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, 'notYet')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'notYet')}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};

export default FoodItemList;
