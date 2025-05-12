// This script seeds content data for the topics in the database
// Run with: node seed-content.js

require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Function to seed content for a topic
async function seedContentForTopic(topic, contentData) {
  try {
    const results = [];
    
    for (const data of contentData) {
      const content = new Content({
        topic: topic._id,
        ...data
      });
      
      const savedContent = await content.save();
      results.push(savedContent);
    }
    
    return results;
  } catch (error) {
    console.error(`Error seeding content for topic ${topic.title}:`, error);
    throw error;
  }
}

// Main seeding function
async function seedContent() {
  try {
    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');
    
    // Get all topics
    const topics = await Topic.find({});
    console.log(`Found ${topics.length} topics`);
    
    // Create content for each topic
    let totalContentCreated = 0;
    
    for (const topic of topics) {
      // Generate content based on topic
      let contentData = generateContentForTopic(topic);
      
      // Seed content for this topic
      const createdContent = await seedContentForTopic(topic, contentData);
      totalContentCreated += createdContent.length;
      
      console.log(`Created ${createdContent.length} content items for topic: ${topic.title}`);
    }
    
    console.log(`Successfully seeded ${totalContentCreated} content items`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error in content seeding process:', error);
    mongoose.connection.close();
  }
}

// Generate content based on topic
function generateContentForTopic(topic) {
  // Base content for all topics
  const contentData = [
    // Lesson
    {
      title: `Introduction to ${topic.title}`,
      type: 'lesson',
      content: generateLessonContent(topic),
      order: 1,
      estimatedTime: 10,
      points: 20,
      isActive: true
    },
    // Quiz
    {
      title: `Quiz: ${topic.title}`,
      type: 'quiz',
      content: 'Test your knowledge about this topic.',
      order: 2,
      estimatedTime: 5,
      points: 30,
      quiz: {
        questions: generateQuizQuestions(topic)
      },
      isActive: true
    }
  ];
  
  // Add a game for some topics based on difficulty
  if (topic.difficulty === 'intermediate' || topic.difficulty === 'advanced') {
    contentData.push({
      title: `Interactive: ${topic.title}`,
      type: 'game',
      content: 'Interactive game to reinforce learning.',
      order: 3,
      estimatedTime: 8,
      points: 40,
      gameConfig: generateGameConfig(topic),
      isActive: true
    });
  }
  
  return contentData;
}

// Generate lesson content based on topic
function generateLessonContent(topic) {
  // Different lesson content based on topic category
  const contentByCategory = {
    'fundamental-rights': `
# ${topic.title}

## Overview
The Fundamental Rights in India are enshrined in Part III of the Constitution. These rights apply to all citizens of India, irrespective of race, place of birth, religion, caste, or gender.

## Key Points
1. **Article 14-18**: Right to Equality
   - Equality before law
   - Prohibition of discrimination
   - Equality of opportunity in public employment
   - Abolition of untouchability

2. **Article 19-22**: Right to Freedom
   - Freedom of speech and expression
   - Freedom of assembly
   - Freedom of association
   - Freedom of movement
   - Freedom of residence
   - Freedom of profession

3. **Article 23-24**: Right against Exploitation
   - Prohibition of human trafficking and forced labor
   - Prohibition of child labor

4. **Article 25-28**: Right to Freedom of Religion
   - Freedom of conscience and free profession, practice, and propagation of religion
   - Freedom to manage religious affairs
   - Freedom from paying taxes for promotion of any religion
   - Freedom from religious instruction in certain educational institutions

5. **Article 29-30**: Cultural and Educational Rights
   - Protection of interests of minorities
   - Right of minorities to establish and administer educational institutions

6. **Article 32-35**: Right to Constitutional Remedies
   - Right to move the Supreme Court for enforcement of Fundamental Rights

## Importance
Fundamental Rights are essential for the development of individuals and to maintain the dignity of individuals. They are enforceable by courts, subject to certain restrictions.
    `,
    'directive-principles': `
# ${topic.title}

## Overview
The Directive Principles of State Policy (DPSP) are contained in Part IV (Articles 36-51) of the Indian Constitution. Unlike Fundamental Rights, these are not enforceable by courts, but they are fundamental in the governance of the country.

## Key Principles
1. **Economic Principles**
   - Equal distribution of material resources
   - Prevention of concentration of wealth
   - Equal pay for equal work
   - Right to work
   - Living wage for workers

2. **Social Principles**
   - Raising the level of nutrition
   - Improving public health
   - Prohibition of intoxicating drinks
   - Free and compulsory education for children
   - Protection of environment and wildlife

3. **Gandhian Principles**
   - Organization of village panchayats
   - Promotion of cottage industries
   - Prohibition of cow slaughter
   - Promotion of economic and educational interests of Scheduled Castes and Tribes

4. **International Principles**
   - Promotion of international peace and security
   - Respect for international law and treaty obligations
   - Settlement of international disputes by arbitration

## Implementation
Though not enforceable by courts, various laws have been enacted to implement these principles such as the Right to Education Act, MGNREGA, etc.
    `,
    'judiciary': `
# ${topic.title}

## Overview
The Indian Judiciary is one of the three branches of the Indian government. The Supreme Court of India is the apex judicial body, followed by High Courts and subordinate courts.

## Structure
1. **Supreme Court**
   - Established by Part V, Chapter IV of the Constitution
   - Consists of the Chief Justice and 33 other judges
   - Highest appellate authority

2. **High Courts**
   - One in each state (some covering more than one state)
   - Supervises all courts in the state

3. **District Courts**
   - Principal civil courts of original jurisdiction
   - Sessions courts for criminal matters

## Powers and Functions
1. **Original Jurisdiction**
   - Disputes between Government of India and states
   - Disputes between states
   - Enforcement of fundamental rights

2. **Appellate Jurisdiction**
   - Appeals from High Courts in civil, criminal, and constitutional cases

3. **Advisory Jurisdiction**
   - Advice to the President on questions of law or fact

4. **Review Jurisdiction**
   - Power to review its own judgments

5. **Court of Record**
   - Judgments, proceedings, and acts are recorded for perpetual memory and testimony
    `,
    'amendments': `
# ${topic.title}

## Overview
The Constitution of India can be amended through Article 368, which provides for two types of amendments based on the subject matter.

## Amendment Process
1. **Simple Majority**
   - Some provisions can be amended by a simple majority in Parliament
   - Example: Creation of new states, alteration of boundaries

2. **Special Majority**
   - Most provisions require a special majority (2/3rd of members present and voting)
   - Example: Fundamental Rights, Directive Principles

3. **Special Majority + State Ratification**
   - Some provisions also require ratification by at least half of the states
   - Example: Election of President, distribution of powers between Centre and States

## Key Amendments
1. **1st Amendment (1951)**
   - Added Ninth Schedule to protect land reform laws from judicial review
   - Amended Article 19 to impose reasonable restrictions on freedom of speech

2. **42nd Amendment (1976)**
   - Added Fundamental Duties
   - Changed the Preamble to include "SOCIALIST", "SECULAR", and "INTEGRITY"
   - Extended the term of Lok Sabha and State Assemblies from 5 to 6 years

3. **44th Amendment (1978)**
   - Restored the term of Lok Sabha and State Assemblies to 5 years
   - Removed Right to Property from Fundamental Rights

4. **73rd and 74th Amendments (1992)**
   - Gave constitutional status to Panchayati Raj Institutions and Municipalities
    `,
    'other': `
# ${topic.title}

## Overview
${topic.description}

## Key Features
1. **Historical Context**
   - The Indian Constitution was adopted on 26th November 1949
   - It came into effect on 26th January 1950
   - Dr. B.R. Ambedkar was the Chairman of the Drafting Committee

2. **Structure**
   - Originally contained 395 Articles, 8 Schedules, and 22 Parts
   - Currently has 448 Articles, 12 Schedules, and 25 Parts after various amendments
   - One of the longest written constitutions in the world

3. **Sources**
   - Borrowed features from various constitutions like US, UK, Ireland, Canada, etc.
   - Parliamentary system from UK
   - Fundamental Rights from US
   - Directive Principles from Ireland
   - Federal structure with strong center from Canada

4. **Special Provisions**
   - Emergency provisions
   - Special status for certain states and regions
   - Provisions for reservations for backward classes

5. **Implementation**
   - Various amendments have been made to adapt to changing needs
   - Interpretation by Supreme Court has evolved over time
   - Basic structure doctrine limits the amending power of Parliament
    `
  };

  const defaultContent = contentByCategory['other'];
  return contentByCategory[topic.category] || defaultContent;
}

// Generate quiz questions based on topic
function generateQuizQuestions(topic) {
  // Basic set of questions for each topic category
  const questionsByCategory = {
    'fundamental-rights': [
      {
        question: 'Which article of the Indian Constitution abolishes untouchability?',
        options: [
          { text: 'Article 14', isCorrect: false },
          { text: 'Article 15', isCorrect: false },
          { text: 'Article 17', isCorrect: true },
          { text: 'Article 19', isCorrect: false }
        ],
        explanation: 'Article 17 of the Indian Constitution abolishes untouchability and forbids its practice in any form.'
      },
      {
        question: 'The Right to Constitutional Remedies is provided under which article?',
        options: [
          { text: 'Article 30', isCorrect: false },
          { text: 'Article 31', isCorrect: false },
          { text: 'Article 32', isCorrect: true },
          { text: 'Article 33', isCorrect: false }
        ],
        explanation: 'Article 32 provides the Right to Constitutional Remedies, which allows citizens to move the Supreme Court for enforcement of their Fundamental Rights.'
      },
      {
        question: 'Right to Freedom of Religion covers which Articles of the Indian Constitution?',
        options: [
          { text: 'Articles 19-22', isCorrect: false },
          { text: 'Articles 23-24', isCorrect: false },
          { text: 'Articles 25-28', isCorrect: true },
          { text: 'Articles 29-30', isCorrect: false }
        ],
        explanation: 'Articles 25-28 cover the Right to Freedom of Religion, which ensures freedom of conscience and free profession, practice, and propagation of religion.'
      }
    ],
    'directive-principles': [
      {
        question: 'Directive Principles of State Policy are:',
        options: [
          { text: 'Legally enforceable by courts', isCorrect: false },
          { text: 'Fundamental in the governance of the country', isCorrect: true },
          { text: 'Less important than Fundamental Rights', isCorrect: false },
          { text: 'Only applicable to state governments', isCorrect: false }
        ],
        explanation: 'Directive Principles are not enforceable by courts but are fundamental in the governance of the country.'
      },
      {
        question: 'Which Part of the Indian Constitution contains the Directive Principles of State Policy?',
        options: [
          { text: 'Part II', isCorrect: false },
          { text: 'Part III', isCorrect: false },
          { text: 'Part IV', isCorrect: true },
          { text: 'Part V', isCorrect: false }
        ],
        explanation: 'Part IV (Articles 36-51) of the Indian Constitution contains the Directive Principles of State Policy.'
      },
      {
        question: 'Which of the following is NOT a Directive Principle of State Policy?',
        options: [
          { text: 'Promotion of cottage industries', isCorrect: false },
          { text: 'Right to equality before law', isCorrect: true },
          { text: 'Uniform civil code for citizens', isCorrect: false },
          { text: 'Protection of monuments of historical importance', isCorrect: false }
        ],
        explanation: 'Right to equality before law is a Fundamental Right under Article 14, not a Directive Principle.'
      }
    ],
    'default': [
      {
        question: `What is the primary focus of ${topic.title}?`,
        options: [
          { text: 'Constitutional provisions', isCorrect: true },
          { text: 'International relations', isCorrect: false },
          { text: 'Economic policies', isCorrect: false },
          { text: 'Military strategy', isCorrect: false }
        ],
        explanation: `${topic.title} primarily focuses on constitutional provisions and their interpretation.`
      },
      {
        question: `When did ${topic.title} become part of the Indian Constitution?`,
        options: [
          { text: 'During the original drafting in 1950', isCorrect: true },
          { text: 'Through an amendment in 1976', isCorrect: false },
          { text: 'Through an amendment in 1992', isCorrect: false },
          { text: 'It is not part of the Constitution', isCorrect: false }
        ],
        explanation: `${topic.title} was part of the original Constitution that came into effect on January 26, 1950.`
      },
      {
        question: `Which of the following is true about ${topic.title}?`,
        options: [
          { text: 'It deals with fundamental rights', isCorrect: false },
          { text: 'It addresses administrative matters', isCorrect: false },
          { text: 'It provides structural framework', isCorrect: true },
          { text: 'It only applies to certain states', isCorrect: false }
        ],
        explanation: `${topic.title} primarily deals with the structural framework of the Constitution.`
      }
    ]
  };
  
  // Return questions based on category or default questions
  return questionsByCategory[topic.category] || questionsByCategory['default'];
}

// Generate game configuration based on topic
function generateGameConfig(topic) {
  // Different game types based on topic difficulty
  let gameType;
  
  if (topic.difficulty === 'beginner') {
    gameType = 'quiz';
  } else if (topic.difficulty === 'intermediate') {
    gameType = Math.random() > 0.5 ? 'matching' : 'timeline';
  } else {
    gameType = Math.random() > 0.5 ? 'scenario' : 'spiral';
  }
  
  // Game config based on type
  const gameConfigs = {
    'quiz': {
      type: 'quiz',
      config: {
        timeLimit: 60,
        passingScore: 70,
        questions: [
          {
            question: "Which of the following is NOT a Fundamental Right guaranteed by the Indian Constitution?",
            options: [
              { text: "Right to Equality (Article 14-18)", isCorrect: false },
              { text: "Right to Freedom (Article 19-22)", isCorrect: false },
              { text: "Right to Property (formerly Article 31)", isCorrect: true },
              { text: "Right against Exploitation (Article 23-24)", isCorrect: false }
            ],
            explanation: "The Right to Property was originally a Fundamental Right under Article 31, but it was removed by the 44th Amendment in 1978. It is now a legal right under Article 300A."
          },
          {
            question: "The Indian Constitution is considered to be:",
            options: [
              { text: "Completely rigid", isCorrect: false },
              { text: "Completely flexible", isCorrect: false },
              { text: "A combination of rigidity and flexibility", isCorrect: true },
              { text: "Unwritten like the British Constitution", isCorrect: false }
            ],
            explanation: "The Indian Constitution contains both rigid provisions (requiring special majority) and flexible provisions (requiring simple majority), making it a balanced combination of rigidity and flexibility."
          },
          {
            question: "Which constitutional amendment introduced the Goods and Services Tax (GST) in India?",
            options: [
              { text: "99th Amendment", isCorrect: false },
              { text: "100th Amendment", isCorrect: false },
              { text: "101st Amendment", isCorrect: true },
              { text: "102nd Amendment", isCorrect: false }
            ],
            explanation: "The 101st Constitutional Amendment Act, 2016 introduced the Goods and Services Tax (GST) in India with effect from July 1, 2017."
          },
          {
            question: "The concept of 'Basic Structure' of the Constitution was propounded in which case?",
            options: [
              { text: "Golaknath v. State of Punjab", isCorrect: false },
              { text: "Kesavananda Bharati v. State of Kerala", isCorrect: true },
              { text: "Minerva Mills v. Union of India", isCorrect: false },
              { text: "Maneka Gandhi v. Union of India", isCorrect: false }
            ],
            explanation: "The Basic Structure doctrine was established in the landmark case of Kesavananda Bharati v. State of Kerala (1973), which held that Parliament cannot amend the basic structure of the Constitution."
          },
          {
            question: "Which Schedule of the Indian Constitution deals with the division of powers between the Union and States?",
            options: [
              { text: "Sixth Schedule", isCorrect: false },
              { text: "Seventh Schedule", isCorrect: true },
              { text: "Eighth Schedule", isCorrect: false },
              { text: "Ninth Schedule", isCorrect: false }
            ],
            explanation: "The Seventh Schedule contains three lists: Union List, State List, and Concurrent List, which distribute legislative powers between the Union and State governments."
          }
        ]
      }
    },
    'matching': {
      type: 'matching',
      config: {
        pairs: [
          { term: 'Article 14', definition: 'Equality before law' },
          { term: 'Article 19', definition: 'Right to freedom' },
          { term: 'Article 21', definition: 'Right to life and personal liberty' },
          { term: 'Article 32', definition: 'Right to constitutional remedies' },
          { term: 'Article 44', definition: 'Uniform civil code' },
          { term: 'Article 368', definition: 'Procedure for amendment of the Constitution' },
          { term: 'Article 370', definition: 'Special status to Jammu and Kashmir (now abrogated)' },
          { term: 'Seventh Schedule', definition: 'Division of powers between Union and States' }
        ],
        timeLimit: 120
      }
    },
    'timeline': {
      type: 'timeline',
      config: {
        events: [
          { year: 1946, event: 'Formation of Constituent Assembly' },
          { year: 1949, event: 'Constitution was adopted' },
          { year: 1950, event: 'Constitution came into effect' },
          { year: 1951, event: 'First Amendment to Constitution' },
          { year: 1952, event: 'First General Elections in India' },
          { year: 1976, event: '42nd Amendment (Mini Constitution)' },
          { year: 1978, event: '44th Amendment (Right to Property removed)' },
          { year: 1992, event: '73rd and 74th Amendments (Panchayati Raj)' },
          { year: 2016, event: '101st Amendment (GST Implementation)' }
        ],
        timeLimit: 180
      }
    },
    'scenario': {
      type: 'scenario',
      config: {
        scenarios: [
          {
            title: "State Speech Restriction",
            situation: "A state government passes a law restricting hate speech in certain contexts, including speech that promotes violence against minorities.",
            question: "Is this constitutional?",
            hint: "Consider Article 19 and its reasonable restrictions under 19(2)",
            options: [
              { 
                text: "Yes, states have complete authority over speech", 
                isCorrect: false,
                feedback: "Incorrect. States do not have unlimited authority over speech. The Constitution guarantees freedom of speech as a fundamental right under Article 19(1)(a)."
              },
              { 
                text: "Yes, if it falls under reasonable restrictions in Article 19(2)", 
                isCorrect: true,
                feedback: "Correct! Article 19(2) allows reasonable restrictions on free speech in the interests of sovereignty and integrity of India, security of the State, friendly relations with foreign States, public order, decency or morality, contempt of court, defamation, or incitement to an offence."
              },
              { 
                text: "No, free speech cannot be restricted under any circumstances", 
                isCorrect: false,
                feedback: "Incorrect. While free speech is protected under Article 19(1)(a), it is not absolute. Article 19(2) specifically provides for reasonable restrictions."
              },
              { 
                text: "No, only the central government can restrict speech", 
                isCorrect: false,
                feedback: "Incorrect. Both central and state governments can enact laws imposing reasonable restrictions on free speech as per Article 19(2), provided they meet the constitutional standards."
              }
            ]
          },
          {
            title: "Religious Discrimination in Private Employment",
            situation: "A private company denies employment to someone based solely on their religion.",
            question: "Does this violate Fundamental Rights under the Constitution?",
            hint: "Consider against whom Fundamental Rights are enforceable",
            options: [
              { 
                text: "Yes, it violates Article 15 on non-discrimination", 
                isCorrect: false,
                feedback: "Incorrect. Article 15 prohibits discrimination by the State, not private entities. It is not directly enforceable against private companies."
              },
              { 
                text: "Yes, it violates Article 16 on equal opportunity in public employment", 
                isCorrect: false,
                feedback: "Incorrect. Article 16 guarantees equal opportunity in public employment, but does not apply to private sector employment."
              },
              { 
                text: "No, Fundamental Rights are enforceable only against the State", 
                isCorrect: true,
                feedback: "Correct! Generally, Fundamental Rights under the Constitution are enforceable only against the State (as defined in Article 12) and not against private individuals or organizations, with limited exceptions like Articles 15(2), 17, 23, and 24."
              },
              { 
                text: "No, religious discrimination is permitted by the Constitution", 
                isCorrect: false,
                feedback: "Incorrect. The Constitution does not permit religious discrimination. While Fundamental Rights may not be directly enforceable against private entities, such discrimination may still be prohibited under other laws like the Equal Remuneration Act."
              }
            ]
          },
          {
            title: "Reservation Policy",
            situation: "The government introduces a 10% reservation for economically weaker sections (EWS) in education and government jobs, in addition to existing reservations for SC, ST, and OBC categories.",
            question: "What constitutional amendment made this possible?",
            hint: "Think about recent amendments to the Constitution",
            options: [
              { 
                text: "101st Amendment", 
                isCorrect: false,
                feedback: "Incorrect. The 101st Amendment introduced the Goods and Services Tax (GST) system."
              },
              { 
                text: "102nd Amendment", 
                isCorrect: false,
                feedback: "Incorrect. The 102nd Amendment gave constitutional status to the National Commission for Backward Classes."
              },
              { 
                text: "103rd Amendment", 
                isCorrect: true,
                feedback: "Correct! The 103rd Constitutional Amendment Act, 2019 provided for 10% reservation in education and government jobs for Economically Weaker Sections (EWS) among the general category."
              },
              { 
                text: "104th Amendment", 
                isCorrect: false,
                feedback: "Incorrect. There is no 104th Amendment yet."
              }
            ]
          },
          {
            title: "State Emergency",
            situation: "The President's Rule is imposed in a state where the elected government has lost majority and no alternative government can be formed.",
            question: "Under which Article is this emergency provision described?",
            hint: "Look at emergency provisions in the Constitution",
            options: [
              { 
                text: "Article 352", 
                isCorrect: false,
                feedback: "Incorrect. Article 352 deals with the proclamation of National Emergency due to war, external aggression, or armed rebellion."
              },
              { 
                text: "Article 356", 
                isCorrect: true,
                feedback: "Correct! Article 356 deals with State Emergency (President's Rule) where the constitutional machinery in a state has failed."
              },
              { 
                text: "Article 360", 
                isCorrect: false,
                feedback: "Incorrect. Article 360 deals with Financial Emergency."
              },
              { 
                text: "Article 370", 
                isCorrect: false,
                feedback: "Incorrect. Article 370 dealt with the special status of Jammu and Kashmir (now abrogated)."
              }
            ]
          },
          {
            title: "Constitutional Amendment",
            situation: "Parliament passes a bill to amend a part of the Constitution that affects the federal structure of India.",
            question: "Can the Supreme Court review this amendment?",
            hint: "Consider the Basic Structure doctrine",
            options: [
              { 
                text: "No, constitutional amendments are beyond judicial review", 
                isCorrect: false,
                feedback: "Incorrect. The Supreme Court established in Kesavananda Bharati case (1973) that constitutional amendments can be reviewed."
              },
              { 
                text: "No, only if it affects fundamental rights", 
                isCorrect: false,
                feedback: "Incorrect. The Supreme Court can review amendments that affect any aspect of the Basic Structure, not just fundamental rights."
              },
              { 
                text: "Yes, if it violates the Basic Structure doctrine", 
                isCorrect: true,
                feedback: "Correct! As per the Basic Structure doctrine established in Kesavananda Bharati case (1973), the Supreme Court can review and strike down constitutional amendments that damage or destroy the basic features of the Constitution, including federalism."
              },
              { 
                text: "Yes, but only with the President's permission", 
                isCorrect: false,
                feedback: "Incorrect. The Supreme Court does not need the President's permission to review the constitutionality of amendments."
              }
            ]
          }
        ],
        timeLimit: 300
      }
    },
    'spiral': {
      type: 'spiral',
      config: {
        centerTitle: topic.title,
        levels: [
          {
            title: "Level 0: Introduction",
            items: ["Preamble", "History", "Features"],
            color: "#3498db"
          },
          {
            title: "Level 1: Structure",
            items: ["Parts I-VIII", "Parts IX-XV", "Parts XVI-XXII"],
            color: "#2ecc71"
          },
          {
            title: "Level 2: Schedules",
            items: ["Schedules 1-4", "Schedules 5-8", "Schedules 9-12"],
            color: "#9b59b6"
          },
          {
            title: "Level 3: Amendments",
            items: ["1st-42nd", "43rd-86th", "87th-105th"],
            color: "#f39c12"
          },
          {
            title: "Level 4: Advanced",
            items: ["Basic Structure", "Judicial Review", "Landmark Cases"],
            color: "#e74c3c"
          }
        ],
        timeLimit: 420
      }
    }
  };
  
  return gameConfigs[gameType];
}

// Run the seeding function
seedContent(); 