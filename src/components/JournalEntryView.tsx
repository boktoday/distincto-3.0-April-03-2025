import React from 'react';
import { JournalEntry } from '../types';
import { X, Edit, Calendar } from 'lucide-react';

interface JournalEntryViewProps {
  entry: JournalEntry;
  onClose: () => void;
  onEdit: () => void;
}

const JournalEntryView: React.FC<JournalEntryViewProps> = ({ entry, onClose, onEdit }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSection = (title: string, content: string) => {
    if (!content) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-md font-semibold text-raspberry mb-2">{title}</h3>
        <p className="text-gray-700 whitespace-pre-line">{content}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{entry.childName}</h2>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar size={14} className="mr-1" />
              {formatDate(entry.timestamp)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              aria-label="Edit entry"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-6">
          {renderSection("Medication Notes", entry.medicationNotes)}
          {renderSection("Education Notes", entry.educationNotes)}
          {renderSection("Social Engagement Notes", entry.socialEngagementNotes)}
          {renderSection("Sensory Profile Notes", entry.sensoryProfileNotes)}
          {renderSection("Food & Nutrition Notes", entry.foodNutritionNotes)}
          {renderSection("Behavioral Notes", entry.behavioralNotes)}
          {renderSection("Magic Moments", entry.magicMoments)}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-raspberry mr-3"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-raspberry hover:bg-raspberry-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-raspberry"
          >
            Edit Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryView;
