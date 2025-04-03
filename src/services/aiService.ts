
import { JournalEntry, FoodItem } from '../types';

interface GenerateReportParams {
  type: 'pattern' | 'trend' | 'summary' | 'recommendations';
  journalEntries: JournalEntry[];
  foodItems: FoodItem[];
}

interface AISettings {
  openRouterApiKey: string;
  openRouterModel: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  useOllama: boolean;
}

class AIService {
  private settings: AISettings = {
    openRouterApiKey: '',
    openRouterModel: 'google/gemma-3-27b-it:free',
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: 'llama3',
    useOllama: false
  };

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  getSettings(): AISettings {
    return { ...this.settings };
  }

  async updateSettings(settings: AISettings): Promise<void> {
    this.settings = settings;
    localStorage.setItem('aiSettings', JSON.stringify(settings));
  }

  async testConnection(settings: AISettings): Promise<boolean> {
    // Simulate a connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  }

  async generatePatternAnalysis(entries: JournalEntry[]): Promise<string> {
    // In a real implementation, this would call an AI API
    return `# Behavioral Pattern Analysis

This analysis identifies recurring patterns in behavior, triggers, and responses.

## Sleep Patterns
- Consistent bedtime routine leads to better sleep quality
- Difficulty falling asleep on days with screen time within 1 hour of bedtime
- Naps longer than 2 hours disrupt nighttime sleep

## Eating Patterns
- Most receptive to new foods at lunch time
- More likely to eat vegetables when they're served first, before other foods
- Shows food refusal more often when tired

## Emotional Regulation Patterns
- Meltdowns most commonly occur during transitions between activities
- Early warning signs include increased physical movement and raised voice
- Most effective intervention: 5-minute warning before transitions + visual timer

## Recommendations Based on Patterns
1. Maintain consistent daily schedule with visual supports
2. Implement 5-minute warnings before all transitions
3. Ensure at least 1 hour of outdoor physical activity daily
4. Schedule sensory breaks throughout the day`;
  }

  async generateTrendInsights(entries: JournalEntry[]): Promise<string> {
    // In a real implementation, this would call an AI API
    return `# Development Trends Analysis

This report analyzes progress and changes over time in key areas.

## Language Development Trends
📈 **Steady Progress**
- Vocabulary has increased from approximately 20 words to 50+ words in three months
- First full sentence emerged this week
- Beginning to use pronouns correctly (I, me, you)

## Motor Skills Trends
📈 **Accelerated Progress**
- Gross motor skills developing rapidly
- Now able to jump with both feet off the ground (new skill)
- Can kick a ball with directed aim (improved skill)

## Social Development Trends
➡️ **Gradual Progress**
- Moving from parallel play to beginning cooperative play
- Still prefers familiar adults but warming up to peers more quickly
- Beginning to show empathy when others are upset

## Recommendations Based on Trends
1. Capitalize on current interests to expand vocabulary and concepts
2. Provide more structured opportunities for peer interaction
3. Implement food chaining techniques to expand food acceptance`;
  }

  async generateSmartSummary(entries: JournalEntry[]): Promise<string> {
    // In a real implementation, this would call an AI API
    return `# Monthly Development Summary

## Overall Development
Significant progress this month in several developmental areas. Language skills continue to expand rapidly, and showing increased interest in pre-literacy activities.

## Key Observations

### Medication Management
Regular medication schedule maintained with no observed side effects.

### Educational Progress
Now recognizing letters A through E consistently and shows excitement about learning to write. Can hold a pencil with proper grip for short periods.

### Social Engagement
Social skills are developing well. Sharing toys without prompting and engaging in cooperative play with peers.

### Sensory Profile
Continues to show sensitivity to loud noises but is developing coping strategies. Enjoys tactile sensory activities.

### Food and Nutrition
This was a month of food exploration! Tried several new foods including broccoli and bell peppers. Still prefers familiar foods but is becoming more open to new tastes.

### Behavioral Patterns
Showing improved emotional regulation. While still has occasional meltdowns during transitions, the duration has decreased, and more receptive to calming strategies