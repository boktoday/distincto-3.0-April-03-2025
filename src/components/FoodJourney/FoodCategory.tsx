import React from 'react';
import { FoodItem } from '../../types';
import FoodItemCard from './FoodItemCard';

interface FoodCategoryProps {
  title: string;
  count: number;
  items: FoodItem[];
  color: 'green' | 'blue' | 'yellow' | 'red';
  category: 'new' | 'safe' | 'sometimes' | 'notYet';
  imageCache: Record<string, string>;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, item: FoodItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDeleteItem: (itemId: string) => void;
}

const FoodCategory: React.FC<FoodCategoryProps> = ({
  title,
  count,
  items,
  color,
  category,
  imageCache,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onDeleteItem
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      ring: 'ring-green-500',
      text: 'text-green-700',
      dot: 'bg-green-500'
    },
    blue: {
      bg: 'bg-blue-50',
      ring: 'ring-blue-500',
      text: 'text-blue-700',
      dot: 'bg-blue-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      ring: 'ring-yellow-500',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500'
    },
    red: {
      bg: 'bg-red-50',
      ring: 'ring-red-500',
      text: 'text-red-700',
      dot: 'bg-red-500'
    }
  };

  return (
    <div
      className={`${colorClasses[color].bg} rounded-lg p-6 ${isDragOver ? `ring-2 ${colorClasses[color].ring}` : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <h3 className={`font-semibold ${colorClasses[color].text} mb-4 flex items-center text-lg`}>
        <div className={`w-3 h-3 ${colorClasses[color].dot} rounded-full mr-2`}></div>
        {title} ({count})
      </h3>
      <div className="space-y-3">
        {items.map(item => (
          <FoodItemCard
            key={item.id}
            item={item}
            imageUrl={imageCache[item.id] || item.imageUrl}
            onDragStart={(e) => onDragStart(e, item)}
            onDragEnd={onDragEnd}
            onDelete={() => onDeleteItem(item.id)}
          />
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500 italic py-4 text-center">No items</p>
        )}
      </div>
    </div>
  );
};

export default FoodCategory;
