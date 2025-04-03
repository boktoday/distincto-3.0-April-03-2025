import fileSystemService from './fileSystem';

// AssemblyAI API configuration
const ASSEMBLY_AI_API_URL = 'https://api.assemblyai.com/v2';
const ASSEMBLY_AI_API_KEY = '998318f6fdc14378baa69bde9baa953f';

export class TranscriptionService {
  private async uploadAudioFile(audioBlob: Blob): Promise<string> {
    try {
      console.log('Starting audio upload to AssemblyAI');
      
      // First, we need to get an upload URL from AssemblyAI
      const uploadResponse = await fetch(`${ASSEMBLY_AI_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY
        },
        body: audioBlob
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('AssemblyAI upload URL error:', errorData);
        throw new Error(`Failed to get upload URL: ${errorData.error || uploadResponse.statusText}`);
      }

      const uploadData = await uploadResponse.json();
      const uploadUrl = uploadData.upload_url;
      
      console.log('Successfully obtained upload URL:', uploadUrl);
      return uploadUrl;
    } catch (error) {
      console.error('Error uploading audio to AssemblyAI:', error);
      throw new Error('Failed to upload audio for transcription. Please try again.');
    }
  }

  private async requestTranscription(audioUrl: string): Promise<string> {
    try {
      console.log('Requesting transcription for audio URL:', audioUrl);
      
      const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript`, {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          language_code: 'en_us'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AssemblyAI transcription request error:', errorData);
        throw new Error(`Failed to request transcription: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Transcription requested successfully, ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error requesting transcription:', error);
      throw new Error('Failed to request transcription. Please try again.');
    }
  }

  private async pollTranscriptionStatus(transcriptId: string): Promise<string> {
    try {
      let transcriptionComplete = false;
      let transcriptText = '';
      let attempts = 0;
      const maxAttempts = 30; // Limit polling to prevent infinite loops
      
      console.log('Starting to poll for transcription status, ID:', transcriptId);
      
      while (!transcriptionComplete && attempts < maxAttempts) {
        attempts++;
        
        // Wait for 2 seconds between polling
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check transcription status
        const response = await fetch(`${ASSEMBLY_AI_API_URL}/transcript/${transcriptId}`, {
          method: 'GET',
          headers: {
            'Authorization': ASSEMBLY_AI_API_KEY
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('AssemblyAI status check error:', errorData);
          throw new Error(`Failed to check transcription status: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        console.log(`Polling attempt ${attempts}, status: ${data.status}`);
        
        if (data.status === 'completed') {
          transcriptionComplete = true;
          transcriptText = data.text || '';
          console.log('Transcription completed:', transcriptText);
        } else if (data.status === 'error') {
          console.error('Transcription error from API:', data.error);
          throw new Error(`Transcription error: ${data.error}`);
        }
        // Continue polling if status is 'queued' or 'processing'
      }
      
      if (!transcriptionComplete) {
        throw new Error('Transcription timed out after maximum polling attempts');
      }
      
      return transcriptText;
    } catch (error) {
      console.error('Error polling transcription status:', error);
      throw new Error('Failed to retrieve transcription. Please try again.');
    }
  }

  // Save audio recording to file system
  private async saveRecording(audioBlob: Blob, fieldName: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `recording_${fieldName}_${timestamp}.webm`;
      
      // Ensure file system is initialized
      if (!await fileSystemService.isInitialized()) {
        await fileSystemService.initialize();
      }
      
      // Save the recording using the saveImage method
      const childName = 'recordings'; // Use a dedicated folder for recordings
      await fileSystemService.saveImage(childName, fileName, audioBlob);
      
      console.log('Recording saved to file system:', fileName);
      return fileName;
    } catch (error) {
      console.error('Error saving recording:', error);
      throw new Error('Failed to save recording. Please try again.');
    }
  }

  // Main method to transcribe audio
  async transcribeAudio(audioBlob: Blob, fieldName: string): Promise<{ text: string, fileName: string }> {
    try {
      console.log('Starting transcription process for field:', fieldName, 'Audio blob size:', audioBlob.size, 'bytes');
      
      // Save the recording locally
      const fileName = await this.saveRecording(audioBlob, fieldName);
      
      // Upload audio file to AssemblyAI
      const audioUrl = await this.uploadAudioFile(audioBlob);
      
      // Request transcription
      const transcriptId = await this.requestTranscription(audioUrl);
      
      // Poll for transcription result
      const transcriptText = await this.pollTranscriptionStatus(transcriptId);
      
      return {
        text: transcriptText || 'No transcription available',
        fileName
      };
    } catch (error) {
      console.error('Error in transcription process:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const transcriptionService = new TranscriptionService();
export default transcriptionService;
