import { JournalEntry, FoodItem, Report } from './types';

// Mock child names
export const mockChildNames = ['Emma', 'Noah', 'Olivia', 'Liam'];

// Mock journal entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    childName: 'Emma',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    medicationNotes: 'Took allergy medication in the morning. No side effects observed.',
    educationNotes: 'Started recognizing letters A through E. Very excited about learning to write her name.',
    socialEngagementNotes: 'Played well with other children at the park. Shared toys without prompting.',
    sensoryProfileNotes: 'Still sensitive to loud noises. Covered ears during the thunderstorm.',
    foodNutritionNotes: 'Tried broccoli for the first time! Mixed reaction but ate a few pieces when mixed with cheese.',
    behavioralNotes: 'Had a meltdown when it was time to leave the park. Calmed down after 5 minutes of quiet time.',
    magicMoments: 'Said "I love you" unprompted for the first time today!',
    synced: true
  },
  {
    id: '2',
    childName: 'Emma',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    medicationNotes: 'No medication today.',
    educationNotes: 'Practiced writing the letter E. Getting better at holding the pencil correctly.',
    socialEngagementNotes: 'Had a playdate with Sarah. They played pretend kitchen for almost an hour.',
    sensoryProfileNotes: 'Enjoyed the sensory bin with rice and small toys. Spent 30 minutes exploring textures.',
    foodNutritionNotes: 'Good appetite today. Ate all her vegetables at dinner without complaint.',
    behavioralNotes: 'Followed bedtime routine perfectly. No resistance to brushing teeth tonight.',
    magicMoments: 'Built a tower with blocks that was taller than her previous record!',
    synced: true
  },
  {
    id: '3',
    childName: 'Noah',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    medicationNotes: 'Took prescribed medication for ear infection. Seems to be helping.',
    educationNotes: 'Counting to 20 consistently now. Starting to understand basic addition with fingers.',
    socialEngagementNotes: 'Shy at the beginning of daycare but warmed up after an hour.',
    sensoryProfileNotes: 'Refused to wear the new sweater - said it was "too scratchy".',
    foodNutritionNotes: 'Picky with food today. Only wanted pasta and refused vegetables.',
    behavioralNotes: 'Had difficulty transitioning between activities. Using a timer seems to help.',
    magicMoments: 'Helped his little sister when she fell down without being asked.',
    synced: false
  },
  {
    id: '4',
    childName: 'Olivia',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    medicationNotes: 'No medication needed.',
    educationNotes: 'Reading simple three-letter words. Very interested in books about animals.',
    socialEngagementNotes: 'Made a new friend at swimming class. They played together the whole time.',
    sensoryProfileNotes: 'Loves deep pressure. Asked for tight hugs several times today.',
    foodNutritionNotes: 'Tried salmon for the first time and liked it! Asked for seconds.',
    behavioralNotes: 'Used words to express frustration instead of crying. Big improvement!',
    magicMoments: 'Drew a family portrait with amazing detail for her age.',
    synced: true
  },
  {
    id: '5',
    childName: 'Liam',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    medicationNotes: 'Started new vitamin supplement as recommended by pediatrician.',
    educationNotes: 'Very interested in dinosaurs. Learning all their names and when they lived.',
    socialEngagementNotes: 'Played alongside other children but not yet interacting directly.',
    sensoryProfileNotes: 'Seeking vestibular input - spinning in circles and jumping from furniture.',
    foodNutritionNotes: 'Good day for trying new foods. Tasted bell peppers and cucumber.',
    behavioralNotes: 'Tantrum when iPad time was over. Need to work on transitions.',
    magicMoments: 'Said his first full sentence: "I want more milk please."',
    synced: true
  }
];

// Mock food items
export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    childName: 'Emma',
    name: 'Broccoli',
    category: 'new',
    notes: 'First tried on May 15. Mixed with cheese to make it more appealing.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    synced: true
  },
  {
    id: '2',
    childName: 'Emma',
    name: 'Apples',
    category: 'safe',
    notes: 'Favorite fruit. Prefers sliced with skin removed.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
    synced: true
  },
  {
    id: '3',
    childName: 'Emma',
    name: 'Yogurt',
    category: 'safe',
    notes: 'Likes plain Greek yogurt with honey. Good protein source.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 60,
    synced: true
  },
  {
    id: '4',
    childName: 'Emma',
    name: 'Bell Peppers',
    category: 'sometimes',
    notes: 'Will eat red ones but not green. Prefers them raw with hummus.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15,
    synced: true
  },
  {
    id: '5',
    childName: 'Emma',
    name: 'Mushrooms',
    category: 'notYet',
    notes: 'Refuses to try. Strong aversion to the texture.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    synced: false
  },
  {
    id: '6',
    childName: 'Noah',
    name: 'Pasta',
    category: 'safe',
    notes: 'Favorite food. Would eat it every day if allowed.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 90,
    synced: true
  },
  {
    id: '7',
    childName: 'Noah',
    name: 'Carrots',
    category: 'sometimes',
    notes: 'Will eat when cooked soft. Refuses raw carrots.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 45,
    synced: true
  },
  {
    id: '8',
    childName: 'Noah',
    name: 'Spinach',
    category: 'new',
    notes: 'Just introduced. Mixed into smoothies so far.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    synced: false
  },
  {
    id: '9',
    childName: 'Olivia',
    name: 'Salmon',
    category: 'new',
    notes: 'Tried for the first time this week. Liked it!',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    synced: true
  },
  {
    id: '10',
    childName: 'Olivia',
    name: 'Bananas',
    category: 'safe',
    notes: 'Eats one almost every day. Good for on-the-go snacks.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 120,
    synced: true
  },
  {
    id: '11',
    childName: 'Olivia',
    name: 'Eggs',
    category: 'sometimes',
    notes: 'Will eat scrambled but not other preparations.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
    synced: true
  },
  {
    id: '12',
    childName: 'Liam',
    name: 'Cucumber',
    category: 'new',
    notes: 'Just tried slices with ranch dip. Seemed interested.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    synced: true
  },
  {
    id: '13',
    childName: 'Liam',
    name: 'Chicken',
    category: 'safe',
    notes: 'Prefers it grilled or baked. Good protein source.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 60,
    synced: true
  },
  {
    id: '14',
    childName: 'Liam',
    name: 'Peanut Butter',
    category: 'notYet',
    notes: 'Waiting to introduce due to family history of allergies.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
    synced: true
  }
];

// Mock reports
export const mockReports: Report[] = [
  {
    id: '1',
    childName: 'Emma',
    type: 'summary',
    content: `# Monthly Summary for Emma

## Overall Development
Emma has shown significant progress this month in several developmental areas. Her language skills continue to expand rapidly, and she's showing increased interest in pre-literacy activities like letter recognition.

## Key Observations

### Medication Management
Emma has been taking her allergy medication regularly with no observed side effects. The medication seems to be effectively managing her seasonal allergies.

### Educational Progress
Emma is now recognizing letters A through E consistently and shows excitement about learning to write her name. She can hold a pencil with proper grip for short periods.

### Social Engagement
Emma's social skills are developing well. She's sharing toys without prompting and engaging in cooperative play with peers. She had several successful playdates this month.

### Sensory Profile
Emma continues to show sensitivity to loud noises but is developing coping strategies. She enjoys tactile sensory activities, particularly the rice sensory bin.

### Food and Nutrition
This was a month of food exploration! Emma tried several new foods including broccoli and bell peppers. She still prefers familiar foods but is becoming more open to new tastes.

### Behavioral Patterns
Emma is showing improved emotional regulation. While she still has occasional meltdowns during transitions, the duration has decreased, and she's more receptive to calming strategies.

## Magic Moments
- Said "I love you" unprompted for the first time
- Built her tallest block tower yet
- Wrote the letter E recognizably

## Next Steps
- Continue letter recognition and writing practice
- Schedule more playdates to encourage social development
- Gradually introduce more new foods
- Practice transition warnings to reduce meltdowns`,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
    generatedFrom: ['1', '2']
  },
  {
    id: '2',
    childName: 'Noah',
    type: 'pattern',
    content: `# Behavioral Pattern Analysis for Noah

## Sleep Patterns
Noah consistently sleeps better on days with outdoor physical activity. Bedtime resistance is minimal on days with at least 1 hour of outdoor play.

## Eating Patterns
- Most receptive to new foods at lunch time
- More likely to eat vegetables when they're served first, before other foods
- Tends to eat better after physical activity
- Shows food refusal more often when tired

## Emotional Regulation Patterns
- Meltdowns most commonly occur during transitions between activities
- Early warning signs include increased physical movement and raised voice
- Most effective intervention: 5-minute warning before transitions + visual timer
- Sensory breaks (especially proprioceptive input) help prevent escalation

## Social Interaction Patterns
- Initially shy in new environments, typically warms up after 30-60 minutes
- Plays more cooperatively in small groups (2-3 children) than larger groups
- More successful social interactions in structured vs. unstructured activities
- Shows leadership qualities when activities involve his areas of interest

## Recommendations Based on Patterns
1. Maintain consistent daily schedule with visual supports
2. Implement 5-minute warnings before all transitions
3. Ensure at least 1 hour of outdoor physical activity daily
4. Schedule sensory breaks throughout the day
5. Introduce new foods at lunchtime when most receptive
6. Plan playdates with 1-2 familiar peers in structured settings`,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    generatedFrom: ['3']
  },
  {
    id: '3',
    childName: 'Olivia',
    type: 'recommendations',
    content: `# Personalized Recommendations for Olivia

## Language & Communication
1. **Expand vocabulary through themed activities**
   - Create word collections around topics of interest (animals, colors, etc.)
   - Play word games during daily routines like mealtime
   - Read books slightly above current level to introduce new words

2. **Support emerging reading skills**
   - Practice letter sounds daily through games
   - Label household items to create a print-rich environment
   - Set aside 15 minutes daily for shared reading

## Physical Development
1. **Enhance fine motor skills**
   - Provide opportunities for drawing, cutting, and manipulating small objects
   - Incorporate activities like stringing beads, using tweezers, and playdough
   - Encourage proper pencil grip through fun writing activities

2. **Support gross motor development**
   - Schedule daily outdoor time for running, jumping, climbing
   - Practice balance activities like walking on lines or low balance beams
   - Introduce simple ball games to develop coordination

## Social-Emotional Development
1. **Foster emotional vocabulary**
   - Name emotions throughout the day
   - Read books about feelings and discuss characters' emotions
   - Create a feelings chart with strategies for managing difficult emotions

2. **Build social skills through structured play**
   - Arrange playdates with clear activities planned
   - Practice turn-taking games
   - Role-play common social scenarios

## Nutrition & Eating
1. **Continue food exploration**
   - Build on success with salmon by introducing other fish varieties
   - Involve Olivia in meal preparation to increase interest
   - Maintain regular eating schedule with structured meals and snacks

## Implementation Timeline
- Week 1: Focus on language recommendations
- Week 2: Implement physical development activities
- Week 3: Emphasize social-emotional strategies
- Week 4: Review all areas and adjust based on response`,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    generatedFrom: ['4']
  },
  {
    id: '4',
    childName: 'Liam',
    type: 'trend',
    content: `# Development Trends Analysis for Liam

## Language Development Trends
📈 **Steady Progress**
- Vocabulary has increased from approximately 20 words to 50+ words in three months
- First full sentence emerged this week: "I want more milk please"
- Beginning to use pronouns correctly (I, me, you)
- Showing interest in books for longer periods (now 5-10 minutes vs. 1-2 minutes previously)

## Motor Skills Trends
📈 **Accelerated Progress**
- Gross motor skills developing rapidly
- Now able to jump with both feet off the ground (new skill)
- Can kick a ball with directed aim (improved skill)
- Climbing abilities significantly advanced
- Fine motor skills showing moderate improvement with better pincer grasp

## Social Development Trends
➡️ **Gradual Progress**
- Moving from parallel play to beginning cooperative play
- Still prefers familiar adults but warming up to peers more quickly
- Beginning to show empathy when others are upset
- Turn-taking emerging but inconsistent

## Cognitive Development Trends
📈 **Strong Progress**
- Showing exceptional interest in specific topics (dinosaurs)
- Memory retention improving significantly
- Beginning to understand basic cause and effect
- Problem-solving skills emerging when motivated

## Eating Patterns Trends
📉 **Area of Challenge**
- Variety of accepted foods has decreased slightly
- More resistance to vegetables than previous quarter
- Strong preferences emerging for carbohydrate-rich foods
- Willingness to try new foods fluctuates significantly

## Sleep Patterns Trends
➡️ **Stable**
- Consistently sleeping 10-11 hours at night
- Nap duration stable at 1.5 hours
- Bedtime routine effectiveness consistent
- Morning wake time predictable

## Recommendations Based on Trends
1. Capitalize on dinosaur interest to expand vocabulary and concepts
2. Provide more structured opportunities for peer interaction
3. Implement food chaining techniques to expand food acceptance
4. Continue supporting gross motor development with outdoor play
5. Introduce more complex problem-solving activities`,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
    generatedFrom: ['5']
  }
];

// Function to load mock data into IndexedDB
export const loadMockData = async () => {
  const dbService = (await import('./services/db')).default;
  await dbService.initialize();
  
  // Check if data already exists
  const existingEntries = await dbService.getAllJournalEntries();
  
  if (existingEntries.length === 0) {
    console.log('Loading mock data...');
    
    // Load journal entries
    for (const entry of mockJournalEntries) {
      try {
        // Encrypt sensitive data
        const encryptionService = (await import('./services/encryption')).default;
        await encryptionService.initialize();
        
        const encryptedEntry = {
          ...entry,
          medicationNotes: await encryptionService.encrypt(entry.medicationNotes)
        };
        
        await dbService.saveJournalEntry(encryptedEntry);
      } catch (error) {
        console.error('Error saving mock journal entry:', error);
      }
    }
    
    // Load food items
    for (const item of mockFoodItems) {
      try {
        await dbService.saveFoodItem(item);
      } catch (error) {
        console.error('Error saving mock food item:', error);
      }
    }
    
    // Load reports
    for (const report of mockReports) {
      try {
        await dbService.saveReport(report);
      } catch (error) {
        console.error('Error saving mock report:', error);
      }
    }
    
    console.log('Mock data loaded successfully!');
  } else {
    console.log('Database already contains data. Skipping mock data load.');
  }
};
