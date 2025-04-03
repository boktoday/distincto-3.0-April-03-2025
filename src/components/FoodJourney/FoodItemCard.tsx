import React, { useState, useRef } from 'react';
import { FoodItem } from '../../types';
import { Move, Camera, MoreVertical, Trash2 } from 'lucide-react';

interface FoodItemCardProps {
  item: FoodItem;
  imageUrl?: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDelete: () => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  imageUrl,
  onDragStart,
  onDragEnd,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    setShowDeleteConfirm(false);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
    setIsMenuOpen(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-3 mb-2 cursor-move relative"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center">
        <div className="mr-2 text-gray-400">
          <Move size={16} />
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Camera size={16} />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-raspberry">{item.name}</h4>
          {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
        </div>
        
        {/* Item menu button */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <MoreVertical size={16} />
          </button>
          
          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 py-1">
              <button
                onClick={confirmDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </button>
            </div>
          )}
          
          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg z-10 p-3">
              <p className="text-sm mb-3">Are you sure you want to delete "{item.name}"?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelDelete}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
