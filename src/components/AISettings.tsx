import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Server, Key } from 'lucide-react';
import aiService from '../services/aiService';

interface AISettingsProps {
  onClose: () => void;
}

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

const AISettings: React.FC<AISettingsProps> = ({ onClose }) => {
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [openRouterModel, setOpenRouterModel] = useState('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('');
  const [ollamaModel, setOllamaModel] = useState('');
  const [useOllama, setUseOllama] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    // Load current settings
    const settings = aiService.getSettings();
    setOpenRouterApiKey(settings.openRouterApiKey || '');
    setOpenRouterModel(settings.openRouterModel || '');
    setOllamaEndpoint(settings.ollamaEndpoint || 'http://localhost:11434');
    setOllamaModel(settings.ollamaModel || 'llama3');
    setUseOllama(settings.useOllama || false);
    
    // If Ollama is enabled, fetch available models
    if (settings.useOllama) {
      fetchOllamaModels(settings.ollamaEndpoint);
    }
  }, []);

  // When useOllama or ollamaEndpoint changes, fetch models if Ollama is enabled
  useEffect(() => {
    if (useOllama) {
      fetchOllamaModels(ollamaEndpoint);
    }
  }, [useOllama, ollamaEndpoint]);

  const fetchOllamaModels = async (endpoint: string) => {
    if (!endpoint) return;
    
    setLoadingModels(true);
    try {
      // Extract the base URL without the /v1 path if it exists
      const baseUrl = endpoint.replace(/\/v1\/?$/, '');
      console.log('Fetching Ollama models from:', `${baseUrl}/api/tags`);
      
      const response = await fetch(`${baseUrl}/api/tags`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching Ollama models:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch Ollama models: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Ollama models response:', data);
      
      if (data.models && Array.isArray(data.models)) {
        setOllamaModels(data.models);
      } else {
        console.error('Invalid response format from Ollama API:', data);
        setOllamaModels([]);
      }
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      setOllamaModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ensure the endpoint doesn't have trailing slashes
      const cleanedOllamaEndpoint = ollamaEndpoint.replace(/\/+$/, '');
      
      await aiService.updateSettings({
        openRouterApiKey,
        openRouterModel,
        ollamaEndpoint: cleanedOllamaEndpoint,
        ollamaModel,
        useOllama
      });
      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error('Error saving AI settings:', error);
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Ensure the endpoint doesn't have trailing slashes
      const cleanedOllamaEndpoint = ollamaEndpoint.replace(/\/+$/, '');
      
      const result = await aiService.testConnection({
        openRouterApiKey,
        openRouterModel,
        ollamaEndpoint: cleanedOllamaEndpoint,
        ollamaModel,
        useOllama
      });
      
      setTestResult({
        success: true,
        message: `Successfully connected to ${useOllama ? 'Ollama' : 'OpenRouter'} API.`
      });
      
      // If testing Ollama connection was successful, fetch models
      if (useOllama) {
        fetchOllamaModels(cleanedOllamaEndpoint);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult({
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings size={20} className="mr-2" />
            AI Model Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Key size={16} className="mr-2" />
                OpenRouter API Settings
              </h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="openRouterApiKey" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="password"
                    id="openRouterApiKey"
                    value={openRouterApiKey}
                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">OpenRouter</a>
                  </p>
                </div>
                
                <div>
                  <label htmlFor="openRouterModel" className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <input
                    type="text"
                    id="openRouterModel"
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    placeholder="google/gemma-3-27b-it:free"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: provider/model-name:tag (e.g., google/gemma-3-27b-it:free)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Server size={16} className="mr-2" />
                Ollama Local Model Settings
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="useOllama"
                    type="checkbox"
                    checked={useOllama}
                    onChange={(e) => setUseOllama(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useOllama" className="ml-2 block text-sm text-gray-900">
                    Use Ollama for local AI models
                  </label>
                </div>
                
                <div>
                  <label htmlFor="ollamaEndpoint" className="block text-sm font-medium text-gray-700">
                    Ollama Endpoint
                  </label>
                  <input
                    type="text"
                    id="ollamaEndpoint"
                    value={ollamaEndpoint}
                    onChange={(e) => setOllamaEndpoint(e.target.value)}
                    placeholder="http://localhost:11434"
                    disabled={!useOllama}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!useOllama ? 'bg-gray-100 text-gray-500' : ''}`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Default: http://localhost:11434 (without /v1 path)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="ollamaModel" className="block text-sm font-medium text-gray-700">
                    Ollama Model
                  </label>
                  <select
                    id="ollamaModel"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    disabled={!useOllama}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!useOllama ? 'bg-gray-100 text-gray-500' : ''}`}
                  >
                    {loadingModels ? (
                      <option value="">Loading models...</option>
                    ) : ollamaModels.length > 0 ? (
                      ollamaModels.map((model) => (
                        <option key={model.name} value={model.name}>
                          {model.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="llama3">llama3</option>
                        <option value="llama3:8b">llama3:8b</option>
                        <option value="llama3:70b">llama3:70b</option>
                        <option value="mistral">mistral</option>
                        <option value="gemma:7b">gemma:7b</option>
                        <option value="gemma:2b">gemma:2b</option>
                      </>
                    )}
                  </select>
                  {useOllama && ollamaModels.length === 0 && !loadingModels && (
                    <p className="mt-1 text-xs text-amber-600">
                      No models found. Please check your Ollama installation or click "Test Connection" to refresh.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {testResult && (
            <div className={`p-3 rounded-md ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {testResult.message}
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={testConnection}
              disabled={isTesting || isSaving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isTesting ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Test Connection
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
