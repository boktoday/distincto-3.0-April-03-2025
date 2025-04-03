import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dbService from '../services/db';
import encryptionService from '../services/encryption';
import syncService from '../services/sync';
import { JournalEntry } from '../types';
import VoiceRecorder from './VoiceRecorder';

interface JournalFormProps {
  onSave?: () => void;
  onCancel?: () => void;
  existingEntry?: JournalEntry;
}

const JournalForm: React.FC<JournalFormProps> = ({ onSave = () => {}, onCancel = () => {}, existingEntry }) => {
  const [childName, setChildName] = useState('');
  const [medicationNotes, setMedicationNotes] = useState('');
  const [educationNotes, setEducationNotes] = useState('');
  const [socialEngagementNotes, setSocialEngagementNotes] = useState('');
  const [sensoryProfileNotes, setSensoryProfileNotes] = useState('');
  const [foodNutritionNotes, setFoodNutritionNotes] = useState('');
  const [behavioralNotes, setBehavioralNotes] = useState('');
  const [magicMoments, setMagicMoments] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      if (id) {
        try {
          await dbService.initialize();
          const journalEntry = await dbService.getJournalEntry(id);
          
          if (journalEntry) {
            // Decrypt sensitive data
            const decryptedMedicationNotes = await encryptionService.decrypt(journalEntry.medicationNotes);
            
            setEntry({
              ...journalEntry,
              medicationNotes: decryptedMedicationNotes
            });
            
            setChildName(journalEntry.childName);
            setMedicationNotes(decryptedMedicationNotes);
            setEducationNotes(journalEntry.educationNotes);
            setSocialEngagementNotes(journalEntry.socialEngagementNotes);
            setSensoryProfileNotes(journalEntry.sensoryProfileNotes);
            setFoodNutritionNotes(journalEntry.foodNutritionNotes);
            setBehavioralNotes(journalEntry.behavioralNotes);
            setMagicMoments(journalEntry.magicMoments);
          } else {
            setError('Journal entry not found');
            navigate('/journal');
          }
        } catch (err) {
          console.error('Error fetching journal entry:', err);
          setError('Failed to load journal entry. Please try again.');
        }
      } else if (existingEntry) {
        setEntry(existingEntry);
        setChildName(existingEntry.childName);
        setMedicationNotes(existingEntry.medicationNotes);
        setEducationNotes(existingEntry.educationNotes);
        setSocialEngagementNotes(existingEntry.socialEngagementNotes);
        setSensoryProfileNotes(existingEntry.sensoryProfileNotes);
        setFoodNutritionNotes(existingEntry.foodNutritionNotes);
        setBehavioralNotes(existingEntry.behavioralNotes);
        setMagicMoments(existingEntry.magicMoments);
      }
    };
    
    fetchEntry();
  }, [id, existingEntry, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!childName.trim()) {
      setError('Child name is required');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      await dbService.initialize();
      
      // Encrypt sensitive data
      const encryptedMedicationNotes = await encryptionService.encrypt(medicationNotes);
      
      const journalEntry: JournalEntry = {
        id: entry?.id || crypto.randomUUID(),
        childName: childName.trim(),
        timestamp: entry?.timestamp || Date.now(),
        medicationNotes: encryptedMedicationNotes,
        educationNotes: educationNotes.trim(),
        socialEngagementNotes: socialEngagementNotes.trim(),
        sensoryProfileNotes: sensoryProfileNotes.trim(),
        foodNutritionNotes: foodNutritionNotes.trim(),
        behavioralNotes: behavioralNotes.trim(),
        magicMoments: magicMoments.trim(),
        synced: false
      };
      
      await dbService.saveJournalEntry(journalEntry);
      
      // Register for background sync
      await syncService.registerForSync();
      
      // Call onSave to update the parent component
      onSave();
      
      // Navigate back to journal list
      navigate('/journal');
      
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle transcription completion for each field
  const handleTranscription = (field: string, text: string) => {
    switch (field) {
      case 'medication':
        setMedicationNotes(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      case 'education':
        setEducationNotes(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      case 'social':
        setSocialEngagementNotes(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      case 'sensory':
        setSensoryProfileNotes(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      case 'food':
        setFoodNutritionNotes(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      case 'behavioral':
        setBehavioralNotes(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      case 'magic':
        setMagicMoments(prev => prev ? `${prev}\n\n${text}` : text);
        break;
      default:
        console.warn(`Unknown field: ${field}`);
    }
  };

  const handleCancel = () => {
    navigate('/journal');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-raspberry mb-6 text-center">
        {id ? 'Edit Journal Entry' : 'New Journal Entry'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
          Child Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="childName"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          required
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="medicationNotes" className="block text-sm font-medium text-gray-700">
            Medication Notes
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('medication', text)} 
            fieldName="medication"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="medicationNotes"
          value={medicationNotes}
          onChange={(e) => setMedicationNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Observations, concerns, dosages, times"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="educationNotes" className="block text-sm font-medium text-gray-700">
            Education Notes
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('education', text)} 
            fieldName="education"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="educationNotes"
          value={educationNotes}
          onChange={(e) => setEducationNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Activities, progress, learning milestones"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="socialEngagementNotes" className="block text-sm font-medium text-gray-700">
            Social Engagement Notes
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('social', text)} 
            fieldName="social"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="socialEngagementNotes"
          value={socialEngagementNotes}
          onChange={(e) => setSocialEngagementNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Interactions, communication patterns, relationship development"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="sensoryProfileNotes" className="block text-sm font-medium text-gray-700">
            Sensory Profile Notes
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('sensory', text)} 
            fieldName="sensory"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="sensoryProfileNotes"
          value={sensoryProfileNotes}
          onChange={(e) => setSensoryProfileNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Preferences, triggers, successful accommodations"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="foodNutritionNotes" className="block text-sm font-medium text-gray-700">
            Food & Nutrition Notes
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('food', text)} 
            fieldName="food"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="foodNutritionNotes"
          value={foodNutritionNotes}
          onChange={(e) => setFoodNutritionNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Intake, preferences, allergies, reactions"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="behavioralNotes" className="block text-sm font-medium text-gray-700">
            Behavioral Notes
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('behavioral', text)} 
            fieldName="behavioral"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="behavioralNotes"
          value={behavioralNotes}
          onChange={(e) => setBehavioralNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Observations, interventions, responses, triggers"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="magicMoments" className="block text-sm font-medium text-gray-700">
            Magic Moments
          </label>
          <VoiceRecorder 
            onTranscriptionComplete={(text) => handleTranscription('magic', text)} 
            fieldName="magic"
            disabled={isSaving}
          />
        </div>
        <textarea
          id="magicMoments"
          value={magicMoments}
          onChange={(e) => setMagicMoments(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-button-primary focus:border-button-primary"
          placeholder="Positive experiences, breakthroughs, celebrations"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="btn-secondary mr-3"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? 'Saving...' : id ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
};

export default JournalForm;
