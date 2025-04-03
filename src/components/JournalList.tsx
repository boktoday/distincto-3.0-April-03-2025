import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dbService from '../services/db';
import encryptionService from '../services/encryption';
import { JournalEntry } from '../types';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import JournalEntryView from './JournalEntryView';

const JournalList: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showEntryView, setShowEntryView] = useState(false);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await dbService.initialize();
      const journalEntries = await dbService.getAllJournalEntries();
      
      // Decrypt sensitive data
      const decryptedEntries = await Promise.all(
        journalEntries.map(async (entry) => {
          try {
            const decryptedMedicationNotes = await encryptionService.decrypt(entry.medicationNotes);
            return {
              ...entry,
              medicationNotes: decryptedMedicationNotes
            };
          } catch (err) {
            console.error('Error decrypting entry:', err);
            return entry;
          }
        })
      );
      
      // Sort by timestamp, newest first
      const sortedEntries = decryptedEntries.sort((a, b) => b.timestamp - a.timestamp);
      setEntries(sortedEntries);
      setFilteredEntries(sortedEntries);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError('Failed to load journal entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = entries.filter(entry => 
      entry.childName.toLowerCase().includes(query) ||
      entry.magicMoments?.toLowerCase().includes(query) ||
      entry.behavioralNotes?.toLowerCase().includes(query) ||
      entry.medicationNotes?.toLowerCase().includes(query) ||
      entry.educationNotes?.toLowerCase().includes(query) ||
      entry.socialEngagementNotes?.toLowerCase().includes(query) ||
      entry.sensoryProfileNotes?.toLowerCase().includes(query) ||
      entry.foodNutritionNotes?.toLowerCase().includes(query)
    );
    setFilteredEntries(filtered);
  }, [searchQuery, entries]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        await dbService.deleteJournalEntry(id);
        await fetchEntries();
      } catch (err) {
        console.error('Error deleting journal entry:', err);
        setError('Failed to delete journal entry. Please try again.');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/journal/edit/${id}`);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowEntryView(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-raspberry"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-raspberry">Journal Entries</h2>
        <Link 
          to="/journal/new" 
          className="inline-flex items-center px-4 py-2 bg-raspberry text-white rounded-lg hover:bg-raspberry-dark transition-colors duration-200 gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Entry</span>
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search journal entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-transparent"
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {entries.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No journal entries yet.</p>
          <Link 
            to="/journal/new" 
            className="inline-flex items-center px-4 py-2 bg-raspberry text-white rounded-lg hover:bg-raspberry-dark transition-colors duration-200 gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Entry</span>
          </Link>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No entries match your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{entry.childName}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewEntry(entry)}
                    className="text-gray-500 hover:text-raspberry transition-colors"
                    aria-label="View entry"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleEdit(entry.id)}
                    className="text-gray-500 hover:text-raspberry transition-colors"
                    aria-label="Edit entry"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-3">{formatDate(entry.timestamp)}</p>
              
              <div className="space-y-2">
                {entry.magicMoments && (
                  <div>
                    <h4 className="text-sm font-medium text-raspberry">Magic Moments</h4>
                    <p className="text-gray-700 line-clamp-2">{entry.magicMoments}</p>
                  </div>
                )}
                
                {entry.behavioralNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-raspberry">Behavioral Notes</h4>
                    <p className="text-gray-700 line-clamp-2">{entry.behavioralNotes}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleViewEntry(entry)}
                className="mt-4 text-raspberry hover:text-raspberry-dark font-medium text-sm inline-flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Full Entry
              </button>
            </div>
          ))}
        </div>
      )}

      {showEntryView && selectedEntry && (
        <JournalEntryView 
          entry={selectedEntry} 
          onClose={() => setShowEntryView(false)}
          onEdit={() => {
            setShowEntryView(false);
            handleEdit(selectedEntry.id);
          }}
        />
      )}
    </div>
  );
};

export default JournalList;
