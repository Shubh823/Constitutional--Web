// This script adds proper scenario data to scenario games
// Run with: node fix-scenario-games.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  fixScenarioGames();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function fixScenarioGames() {
  try {
    console.log('🔧 Fixing scenario games...');
    
    // Find all scenario games
    const scenarioGames = await Content.find({
      type: 'game',
      'gameConfig.type': 'scenario'
    });
    
    console.log(`Found ${scenarioGames.length} scenario games to fix`);
    
    // Fix each scenario game
    let updatedCount = 0;
    
    for (const game of scenarioGames) {
      // If the game has no scenarios or empty scenarios array, add sample scenarios
      if (!game.gameConfig.config || !game.gameConfig.config.scenarios || game.gameConfig.config.scenarios.length === 0) {
        console.log(`Adding scenarios to: ${game.title}`);
        
        // Generate scenarios based on game title/topic
        const scenarios = generateScenariosForGame(game.title);
        
        // Update game config
        game.gameConfig.config = {
          ...game.gameConfig.config,
          scenarios: scenarios
        };
        
        // Save updated game
        await game.save();
        console.log(`✅ Added scenarios to: ${game.title}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Game already has scenarios: ${game.title}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} scenario games`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error fixing scenario games:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Helper function to generate scenarios based on game title/topic
function generateScenariosForGame(title) {
  // Basic scenarios for any game
  const basicScenarios = [
    {
      title: "Understanding Constitutional Principles",
      situation: "You are a newly appointed judge presiding over a case where a state law appears to conflict with a fundamental right guaranteed by the Constitution. The state argues that the law serves an important public interest.",
      question: "How would you approach this constitutional conflict?",
      options: [
        {
          text: "Always prioritize the explicit language of the fundamental right over any state interests.",
          isCorrect: false,
          feedback: "While fundamental rights are crucial, constitutional interpretation often requires balancing competing interests rather than absolute prioritization."
        },
        {
          text: "Apply the 'reasonable restrictions' doctrine to determine if the state's interests justify limiting the fundamental right.",
          isCorrect: true,
          feedback: "Correct! The Constitution allows for reasonable restrictions on fundamental rights. Courts must determine if the restriction is proportionate and serves a legitimate state interest."
        },
        {
          text: "Defer completely to the state legislature's judgment about the public interest.",
          isCorrect: false,
          feedback: "This approach would undermine the court's role in protecting fundamental rights from legislative overreach."
        },
        {
          text: "Declare the law unconstitutional without further analysis if it affects any aspect of a fundamental right.",
          isCorrect: false,
          feedback: "This absolutist approach doesn't reflect the nuanced balancing required in constitutional interpretation."
        }
      ],
      hint: "Consider the doctrine of proportionality and reasonable restrictions in constitutional jurisprudence."
    },
    {
      title: "Balancing Rights and Duties",
      situation: "A citizens' group is protesting peacefully against a government policy, but their assembly is causing significant traffic disruption in a major city center. Local authorities are considering whether to disperse the protest.",
      question: "What constitutional principles should guide this decision?",
      options: [
        {
          text: "The right to protest is absolute and cannot be restricted under any circumstances.",
          isCorrect: false,
          feedback: "While the right to peaceful assembly is fundamental, it is subject to reasonable restrictions in the interest of public order."
        },
        {
          text: "Public convenience always overrides the right to protest.",
          isCorrect: false,
          feedback: "This would give too little weight to the fundamental right of peaceful assembly and expression."
        },
        {
          text: "Balance the right to protest with reasonable restrictions related to time, place, and manner while preserving the essence of the right.",
          isCorrect: true,
          feedback: "Correct! Constitutional rights are subject to reasonable restrictions, and authorities must balance competing interests while ensuring the core of the right remains protected."
        },
        {
          text: "The protest should be immediately dispersed as it's causing inconvenience.",
          isCorrect: false,
          feedback: "Mere inconvenience is not sufficient grounds to restrict a fundamental right; there must be a proportionate response to genuine public order concerns."
        }
      ],
      hint: "Think about how the Constitution balances individual rights with social responsibilities."
    },
    {
      title: "Federal Distribution of Powers",
      situation: "During a national health emergency, both the central government and a state government have issued conflicting directives regarding movement restrictions and essential services.",
      question: "According to constitutional principles, how should this conflict be resolved?",
      options: [
        {
          text: "The central government's directive automatically overrides state directives in all circumstances.",
          isCorrect: false,
          feedback: "While the central government has certain overriding powers, the Constitution establishes a federal structure with divided powers."
        },
        {
          text: "State governments have complete autonomy in handling emergencies within their territories.",
          isCorrect: false,
          feedback: "This ignores the constitutional provisions that allow the central government to intervene during national emergencies."
        },
        {
          text: "Apply the doctrine of harmonious construction, but if genuine conflict exists, central legislation prevails under Article 254.",
          isCorrect: true,
          feedback: "Correct! The Constitution provides for a federal structure with divided powers, but Article 254 establishes that in case of irreconcilable conflict, central legislation prevails."
        },
        {
          text: "Let the judiciary decide each conflict on a case-by-case basis without applying any general principle.",
          isCorrect: false,
          feedback: "While courts do resolve specific disputes, they apply established constitutional principles rather than deciding without guiding principles."
        }
      ],
      hint: "Consider the constitutional provisions regarding distribution of legislative powers and conflict resolution between central and state laws."
    }
  ];
  
  // Check title to add topic-specific scenarios
  if (title.includes("Emergency")) {
    return [
      ...basicScenarios,
      {
        title: "National Emergency Declaration",
        situation: "The nation is facing a serious threat due to external aggression. The President is considering declaring a National Emergency under Article 352.",
        question: "What constitutional requirements must be met for this declaration?",
        options: [
          {
            text: "The President can declare an emergency unilaterally whenever they perceive a threat.",
            isCorrect: false,
            feedback: "This is incorrect. The President's power is not absolute and requires cabinet recommendation."
          },
          {
            text: "The President must receive written advice from the Cabinet before declaring an emergency.",
            isCorrect: true,
            feedback: "Correct! After the 44th Amendment, the President can proclaim an emergency only on the written advice of the Cabinet."
          },
          {
            text: "Only Parliament can declare a national emergency, not the President.",
            isCorrect: false,
            feedback: "This is incorrect. The President proclaims the emergency, though Parliament must approve it."
          },
          {
            text: "The Supreme Court must approve the emergency declaration before it comes into effect.",
            isCorrect: false,
            feedback: "This is incorrect. The judiciary reviews emergencies only when challenged, not as a prerequisite."
          }
        ],
        hint: "Think about the safeguards added by the 44th Amendment to prevent misuse of emergency powers."
      },
      {
        title: "Emergency Powers and Fundamental Rights",
        situation: "During a proclaimed National Emergency, the government has implemented various restrictions on citizens' movements and activities.",
        question: "How are fundamental rights affected during a National Emergency?",
        options: [
          {
            text: "All fundamental rights are automatically suspended during any type of emergency.",
            isCorrect: false,
            feedback: "This is incorrect. Only specific rights are suspended, and after the 44th Amendment, Articles 20 and 21 cannot be suspended even during emergencies."
          },
          {
            text: "Articles 20 and 21 remain enforceable even during a National Emergency, while enforcement of other rights under Article 19 may be suspended.",
            isCorrect: true,
            feedback: "Correct! After the 44th Amendment, the right to life and personal liberty (Article 21) and protections in respect of conviction for offenses (Article 20) cannot be suspended even during emergencies."
          },
          {
            text: "Fundamental rights remain fully operative, but the government gains additional powers.",
            isCorrect: false,
            feedback: "This is incorrect. During a national emergency, the enforcement of fundamental rights under Article 19 can be suspended."
          },
          {
            text: "State governments decide which fundamental rights to suspend in their territories.",
            isCorrect: false,
            feedback: "This is incorrect. The suspension of enforcement of fundamental rights during emergency is determined by constitutional provisions, not state discretion."
          }
        ],
        hint: "Consider the amendments made after the Emergency of 1975-77 to protect certain fundamental rights."
      }
    ];
  } else if (title.includes("Basic Structure")) {
    return [
      ...basicScenarios,
      {
        title: "Constitutional Amendment Challenge",
        situation: "Parliament has passed a constitutional amendment that significantly alters the independence of the judiciary by giving the executive substantial control over judicial appointments.",
        question: "As a Supreme Court judge, how would you evaluate this amendment's validity?",
        options: [
          {
            text: "Accept it without review since Parliament has unlimited power to amend any part of the Constitution.",
            isCorrect: false,
            feedback: "This contradicts the Basic Structure Doctrine established in Kesavananda Bharati case, which limits Parliament's amending power."
          },
          {
            text: "Declare it unconstitutional by applying the Basic Structure Doctrine, as judicial independence is part of the Constitution's basic structure.",
            isCorrect: true,
            feedback: "Correct! Under the Basic Structure Doctrine, Parliament cannot amend the Constitution to destroy its essential features, which include judicial independence."
          },
          {
            text: "Review only whether the proper procedure was followed, not the substance of the amendment.",
            isCorrect: false,
            feedback: "This procedural approach was rejected in the Kesavananda Bharati case, which established that substantive review of amendments is necessary."
          },
          {
            text: "Declare all constitutional amendments invalid if they affect any constitutional provision.",
            isCorrect: false,
            feedback: "This is too restrictive. Parliament can amend many constitutional provisions as long as they don't alter the basic structure."
          }
        ],
        hint: "Think about the landmark Kesavananda Bharati case and its impact on Parliament's amending power."
      },
      {
        title: "Democracy as Basic Structure",
        situation: "A constitutional amendment has been passed that extends the term of Parliament from 5 to 10 years and allows for postponement of elections during certain circumstances defined by the government.",
        question: "How would you evaluate this amendment's constitutional validity?",
        options: [
          {
            text: "It's valid because Parliament has followed the procedural requirements for amendments under Article 368.",
            isCorrect: false,
            feedback: "Procedural compliance alone is insufficient; amendments must also respect the Constitution's basic structure."
          },
          {
            text: "It's invalid because it undermines democracy, which is part of the basic structure of the Constitution.",
            isCorrect: true,
            feedback: "Correct! Democracy is a fundamental aspect of the Constitution's basic structure. Amendments that severely undermine democratic processes violate this principle."
          },
          {
            text: "It's valid because there's no explicit limit on Parliament's term in the basic structure.",
            isCorrect: false,
            feedback: "This takes too narrow a view. The basic structure includes broad principles like democracy, not just specific provisions."
          },
          {
            text: "Only the President can decide whether this amendment is valid.",
            isCorrect: false,
            feedback: "This is incorrect. The judiciary, particularly the Supreme Court, has the authority to review constitutional amendments against the basic structure doctrine."
          }
        ],
        hint: "Consider what elements the Supreme Court has identified as part of the 'basic structure' of the Constitution."
      }
    ];
  } else if (title.includes("Landmark Judgments")) {
    return [
      ...basicScenarios,
      {
        title: "Privacy as a Fundamental Right",
        situation: "The government has implemented a mandatory biometric identification system for all citizens to access public services. A citizen has challenged this system, claiming it violates their fundamental right to privacy.",
        question: "Based on constitutional jurisprudence, how would you approach this case?",
        options: [
          {
            text: "Reject the challenge because privacy is not explicitly mentioned as a fundamental right in the Constitution.",
            isCorrect: false,
            feedback: "This approach ignores the K.S. Puttaswamy judgment, which recognized privacy as a fundamental right."
          },
          {
            text: "Recognize privacy as a fundamental right under Article 21, but apply the proportionality test to determine if the identification system constitutes a reasonable restriction.",
            isCorrect: true,
            feedback: "Correct! The K.S. Puttaswamy judgment recognized privacy as a fundamental right under Article 21, subject to reasonable restrictions that pass the proportionality test."
          },
          {
            text: "Accept the challenge and declare any biometric system unconstitutional because privacy is absolute.",
            isCorrect: false,
            feedback: "This ignores the fact that fundamental rights, including privacy, can be subject to reasonable restrictions in the interest of legitimate state aims."
          },
          {
            text: "Declare that policies related to public services are entirely the government's prerogative and beyond judicial review.",
            isCorrect: false,
            feedback: "This incorrectly suggests that government policies are beyond judicial review, which contradicts the principle of constitutional supremacy."
          }
        ],
        hint: "Consider the Supreme Court's landmark judgment in Justice K.S. Puttaswamy v. Union of India."
      },
      {
        title: "Interpreting Article 21",
        situation: "An underprivileged community is living in severely polluted conditions due to industrial waste being dumped near their settlement. They've filed a petition claiming their right to life under Article 21 is being violated.",
        question: "Based on judicial interpretation of Article 21, what should be the approach to this case?",
        options: [
          {
            text: "Dismiss the petition because Article 21 only protects against death penalty and physical detention.",
            isCorrect: false,
            feedback: "This narrow interpretation ignores the evolution of Article 21 jurisprudence since the Maneka Gandhi case."
          },
          {
            text: "Recognize that the right to life includes the right to live with human dignity and in a clean environment, and evaluate whether the state has taken adequate measures.",
            isCorrect: true,
            feedback: "Correct! The Supreme Court has expanded Article 21 to include the right to live with human dignity and in a clean environment in cases like Subhash Kumar v. State of Bihar."
          },
          {
            text: "Redirect the petitioners to seek remedies under environmental laws only, as Article 21 doesn't cover environmental concerns.",
            isCorrect: false,
            feedback: "This ignores the expanded interpretation of Article 21, which the Supreme Court has held includes the right to a clean environment."
          },
          {
            text: "Declare that all industrial activity near residential areas is unconstitutional without further analysis.",
            isCorrect: false,
            feedback: "This absolutist approach doesn't reflect the balanced consideration required in constitutional adjudication."
          }
        ],
        hint: "Think about how the Supreme Court has expanded the scope of Article 21 in cases like Francis Coralie Mullin and environmental jurisprudence."
      }
    ];
  }
  
  // Default to basic scenarios if no specific matches
  return basicScenarios;
} 