// This script adds detailed constitutional scenario games to the database
// Run with: node add-constitutional-scenarios.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const Topic = require('./models/Topic');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  addConstitutionalScenarios();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function addConstitutionalScenarios() {
  try {
    console.log('🧠 Adding constitutional scenario games...');
    
    // Find the topic for constitutional scenarios
    const topic = await Topic.findOne({ 
      $or: [
        { title: { $regex: /constitution/i } },
        { title: { $regex: /fundamental/i } },
        { category: 'fundamental-rights' }
      ]
    });
    
    if (!topic) {
      console.error('❌ No suitable topic found for constitutional scenarios');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`✅ Found topic: ${topic.title} (${topic._id})`);
    
    // Create the scenario content
    const scenarioContent = [
      {
        title: "Constitutional Rights in Action",
        type: "game",
        content: "Apply your understanding of constitutional rights to real-world scenarios. Analyze situations and determine how constitutional principles would be applied.",
        estimatedTime: 20,
        points: 100,
        gameConfig: {
          type: "scenario",
          config: {
            scenarios: getConstitutionalRightsScenarios()
          }
        },
        topic: topic._id,
        order: 6,
        isActive: true
      },
      {
        title: "Judicial Review Challenges",
        type: "game",
        content: "Take on the role of a Supreme Court judge examining challenging constitutional cases. Apply the principles of judicial review to determine the constitutionality of various laws and actions.",
        estimatedTime: 25,
        points: 120,
        gameConfig: {
          type: "scenario",
          config: {
            scenarios: getJudicialReviewScenarios()
          }
        },
        topic: topic._id,
        order: 7,
        isActive: true
      },
      {
        title: "Constitutional Governance Dilemmas",
        type: "game",
        content: "Navigate complex constitutional governance dilemmas involving separation of powers, checks and balances, and institutional relationships within the framework of the Constitution.",
        estimatedTime: 20,
        points: 100,
        gameConfig: {
          type: "scenario",
          config: {
            scenarios: getConstitutionalGovernanceScenarios()
          }
        },
        topic: topic._id,
        order: 8,
        isActive: true
      }
    ];
    
    let createdCount = 0;
    
    for (const scenario of scenarioContent) {
      // Check if a similar scenario already exists
      const existingScenario = await Content.findOne({ 
        title: scenario.title,
        topic: scenario.topic
      });
      
      if (existingScenario) {
        console.log(`⚠️ Scenario '${scenario.title}' already exists. Updating...`);
        existingScenario.gameConfig = scenario.gameConfig;
        await existingScenario.save();
        console.log(`✅ Updated scenario: ${scenario.title}`);
        createdCount++;
      } else {
        // Create new scenario
        const newScenario = new Content(scenario);
        await newScenario.save();
        console.log(`✅ Created new scenario: ${scenario.title}`);
        createdCount++;
      }
    }
    
    console.log(`\n🎉 Successfully added/updated ${createdCount} constitutional scenarios`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error adding constitutional scenarios:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Scenario 1: Constitutional Rights in Action
function getConstitutionalRightsScenarios() {
  return [
    {
      title: "Freedom of Speech vs. Hate Speech",
      situation: "A political leader makes a speech that contains derogatory remarks against a particular religious community, claiming it's protected as free speech under Article 19(1)(a).",
      question: "How would a court likely rule on this constitutional question?",
      options: [
        {
          text: "The speech is absolutely protected under Article 19(1)(a) regardless of its content.",
          isCorrect: false,
          feedback: "Incorrect. Freedom of speech under Article 19(1)(a) is subject to reasonable restrictions under Article 19(2), including public order, decency, and morality."
        },
        {
          text: "The speech would be examined to determine if it constitutes hate speech that incites violence or discrimination, which would not be protected.",
          isCorrect: true,
          feedback: "Correct! The Supreme Court has held that hate speech that incites violence or discrimination is not protected under Article 19(1)(a) and falls within the reasonable restrictions under Article 19(2)."
        },
        {
          text: "All political speech is automatically protected regardless of content.",
          isCorrect: false,
          feedback: "Incorrect. While political speech receives strong protection, it is still subject to reasonable restrictions under Article 19(2)."
        },
        {
          text: "The government can ban any speech it considers offensive without judicial review.",
          isCorrect: false,
          feedback: "Incorrect. Restrictions on speech must be reasonable and proportionate, and are subject to judicial review."
        }
      ],
      hint: "Consider the balance between free speech rights and reasonable restrictions under Article 19(2)."
    },
    {
      title: "Religious Freedom and Public Policy",
      situation: "A religious community practices animal sacrifice as part of its traditional rituals. The state government passes a law banning all animal sacrifice, citing animal welfare.",
      question: "How should this constitutional conflict be resolved?",
      options: [
        {
          text: "Religious practices are completely immune from state regulation.",
          isCorrect: false,
          feedback: "Incorrect. The Constitution allows for reasonable regulation of religious practices on grounds of public order, morality, health, and other provisions of Part III of the Constitution."
        },
        {
          text: "The state can ban any religious practice it deems contrary to public policy.",
          isCorrect: false,
          feedback: "Incorrect. This would give too much power to the state and undermine the fundamental right to religious freedom."
        },
        {
          text: "The court should apply the 'essential religious practices' test and balance it with the state's interest in animal welfare.",
          isCorrect: true,
          feedback: "Correct! Courts apply the 'essential religious practices' test to determine if the practice is integral to the religion, and then balance it with legitimate state interests. This approach was followed in cases like Ramesh Sharma v. State of HP."
        },
        {
          text: "Animal welfare laws always override religious practices without exception.",
          isCorrect: false,
          feedback: "Incorrect. While animal welfare is important, courts must balance this with the constitutional protection of religious practices."
        }
      ],
      hint: "Think about how courts distinguish between essential and non-essential religious practices and how they balance competing constitutional values."
    },
    {
      title: "Affirmative Action and Equality",
      situation: "A state government has reserved 75% of seats in higher educational institutions for socially and educationally backward classes, SC/STs, and economically weaker sections.",
      question: "Is this reservation policy constitutionally valid?",
      options: [
        {
          text: "Yes, states have unlimited power to make reservations for backward classes.",
          isCorrect: false,
          feedback: "Incorrect. While Article 15(4) allows special provisions for backward classes, the Supreme Court has capped reservations at 50% in most circumstances (Indra Sawhney case)."
        },
        {
          text: "No, as it exceeds the 50% ceiling established by the Supreme Court without exceptional circumstances.",
          isCorrect: true,
          feedback: "Correct! In Indra Sawhney v. Union of India, the Supreme Court established a 50% ceiling on reservations to balance equality of opportunity with special provisions for backward classes. Exceeding this limit requires exceptional circumstances."
        },
        {
          text: "Yes, as long as the state legislature unanimously approves it.",
          isCorrect: false,
          feedback: "Incorrect. Legislative unanimity doesn't exempt policies from constitutional scrutiny."
        },
        {
          text: "No, as the Constitution prohibits all forms of reservation.",
          isCorrect: false,
          feedback: "Incorrect. The Constitution explicitly allows reservations for socially and educationally backward classes under Articles 15(4) and 16(4)."
        }
      ],
      hint: "Consider the Supreme Court's rulings on the balance between formal equality and substantive equality through reservations."
    },
    {
      title: "Privacy Rights and State Surveillance",
      situation: "The government has implemented a facial recognition system in public spaces that continuously monitors citizens and stores their data for security purposes.",
      question: "How would this be evaluated from a constitutional perspective?",
      options: [
        {
          text: "It's constitutional as national security always overrides privacy concerns.",
          isCorrect: false,
          feedback: "Incorrect. After the Puttaswamy judgment, privacy is a fundamental right and security measures must pass the tests of legality, necessity, and proportionality."
        },
        {
          text: "It's unconstitutional as privacy rights are absolute.",
          isCorrect: false,
          feedback: "Incorrect. While privacy is a fundamental right, it can be restricted by procedure established by law that is just, fair, and reasonable."
        },
        {
          text: "It would need to be evaluated using the triple test of legality, legitimate aim, and proportionality.",
          isCorrect: true,
          feedback: "Correct! After K.S. Puttaswamy v. Union of India, restrictions on privacy must satisfy the triple test: (1) legality - backed by law; (2) legitimate aim for a valid state purpose; and (3) proportionality - means used are proportional to the objective."
        },
        {
          text: "It's constitutional as there is no expectation of privacy in public spaces.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has recognized that privacy protections extend to public spaces as well, especially regarding mass surveillance technologies."
        }
      ],
      hint: "Think about the K.S. Puttaswamy judgment and the tests established for justifying restrictions on the right to privacy."
    },
    {
      title: "Freedom of Press and National Security",
      situation: "A journalist publishes classified government documents revealing human rights violations by security forces. The government seeks to prosecute the journalist under the Official Secrets Act.",
      question: "How would this case be resolved constitutionally?",
      options: [
        {
          text: "National security laws always override press freedom without exception.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has established that even national security restrictions must be reasonable and proportionate."
        },
        {
          text: "The courts would balance the public interest in disclosure against the specific national security concerns.",
          isCorrect: true,
          feedback: "Correct! In cases like Romesh Thappar and others, courts have established that press freedom is essential to democracy but subject to reasonable restrictions. When human rights violations are exposed, courts often recognize a significant public interest in disclosure."
        },
        {
          text: "Journalists have absolute immunity from national security laws.",
          isCorrect: false,
          feedback: "Incorrect. While press freedom is protected, it is subject to reasonable restrictions under Article 19(2), including security of the State."
        },
        {
          text: "The classification of documents as 'secret' automatically makes their publication unconstitutional.",
          isCorrect: false,
          feedback: "Incorrect. The mere classification of documents doesn't automatically override press freedom; courts examine the actual harm to national security versus public interest."
        }
      ],
      hint: "Consider how courts balance press freedom with national security concerns, particularly when human rights issues are involved."
    }
  ];
}

// Scenario 2: Judicial Review Challenges
function getJudicialReviewScenarios() {
  return [
    {
      title: "Constitutional Amendment Review",
      situation: "Parliament passes a constitutional amendment that removes judicial review of laws related to agrarian reform. Several petitioners challenge this amendment as unconstitutional.",
      question: "As a Supreme Court judge, how would you approach this case?",
      options: [
        {
          text: "Dismiss the challenge since Parliament has unlimited amendment powers under Article 368.",
          isCorrect: false,
          feedback: "Incorrect. The Basic Structure Doctrine established in Kesavananda Bharati case limits Parliament's power to amend the Constitution."
        },
        {
          text: "Strike down the amendment as judicial review is part of the basic structure of the Constitution.",
          isCorrect: true,
          feedback: "Correct! Judicial review has been recognized as part of the basic structure of the Constitution in cases like Kesavananda Bharati and L. Chandra Kumar. Parliament cannot amend the Constitution to eliminate this essential feature."
        },
        {
          text: "Uphold the amendment as agrarian reform is a Directive Principle of State Policy.",
          isCorrect: false,
          feedback: "Incorrect. While agrarian reform is important, eliminating judicial review even in this specific area would violate the basic structure."
        },
        {
          text: "Defer completely to Parliament on all constitutional amendments.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has established its power to review constitutional amendments for compliance with the basic structure."
        }
      ],
      hint: "Consider the Kesavananda Bharati case and what it established regarding Parliament's power to amend the Constitution."
    },
    {
      title: "Executive Privilege vs. Right to Information",
      situation: "The Prime Minister refuses to disclose minutes of high-level meetings on a policy decision, claiming executive privilege. An RTI activist challenges this refusal.",
      question: "How should the constitutional balance be struck in this case?",
      options: [
        {
          text: "Executive privilege is absolute for all internal government deliberations.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has held that executive privilege is not absolute and must be balanced against the public's right to information."
        },
        {
          text: "The right to information always overrides executive privilege.",
          isCorrect: false,
          feedback: "Incorrect. While the RTI Act promotes transparency, it recognizes certain exemptions for sensitive information where disclosure would harm the public interest."
        },
        {
          text: "The court should conduct an in-camera examination to balance transparency with legitimate confidentiality needs.",
          isCorrect: true,
          feedback: "Correct! In cases like S.P. Gupta v. Union of India, the Supreme Court established that courts can examine privileged documents in-camera to determine if the public interest in disclosure outweighs the need for confidentiality."
        },
        {
          text: "The judiciary has no power to review executive privilege claims.",
          isCorrect: false,
          feedback: "Incorrect. The judiciary has the power to review executive privilege claims to ensure they are not used to shield information arbitrarily."
        }
      ],
      hint: "Think about how courts balance government confidentiality with transparency in a democratic system."
    },
    {
      title: "Minority Educational Rights",
      situation: "A state law mandates that all educational institutions, including minority-run institutions, must reserve 50% of their seats for local residents.",
      question: "Would this law be constitutionally valid?",
      options: [
        {
          text: "Yes, states have complete regulatory power over all educational institutions.",
          isCorrect: false,
          feedback: "Incorrect. Article 30 guarantees minorities the right to establish and administer educational institutions of their choice."
        },
        {
          text: "No, minority institutions are completely exempt from all government regulations.",
          isCorrect: false,
          feedback: "Incorrect. While minority institutions have special protections, reasonable regulations in the interest of academic standards and management are permissible."
        },
        {
          text: "No, as it interferes with the core of minority educational rights by substantially reducing their ability to admit students of their choice.",
          isCorrect: true,
          feedback: "Correct! In cases like T.M.A. Pai Foundation, the Supreme Court has held that while reasonable regulations are permissible, requirements that substantially affect the right of minorities to establish and administer educational institutions would be unconstitutional."
        },
        {
          text: "Yes, as long as the reservation doesn't exceed 50%.",
          isCorrect: false,
          feedback: "Incorrect. The percentage alone doesn't determine constitutionality; the key issue is whether it interferes with the essential right of minorities to establish and administer their institutions."
        }
      ],
      hint: "Consider how courts have interpreted Article 30 rights of minorities and what constitutes the core of these rights."
    },
    {
      title: "Environmental Protection and Development",
      situation: "The government approves a large infrastructure project in an ecologically sensitive area, citing economic development. Environmental groups challenge this approval.",
      question: "How would a court apply judicial review in this case?",
      options: [
        {
          text: "Economic development always takes precedence over environmental concerns.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has established that sustainable development requires balancing economic needs with environmental protection."
        },
        {
          text: "The court should apply the precautionary principle and principle of sustainable development.",
          isCorrect: true,
          feedback: "Correct! In cases like Vellore Citizens Welfare Forum, the Supreme Court has recognized environmental principles like 'precautionary principle' and 'sustainable development' as part of Indian law, requiring a balance between development and environmental protection."
        },
        {
          text: "Courts have no jurisdiction over policy decisions regarding infrastructure projects.",
          isCorrect: false,
          feedback: "Incorrect. While courts defer to policy expertise, they can review whether environmental laws and constitutional protections have been followed."
        },
        {
          text: "Environmental concerns always override development needs.",
          isCorrect: false,
          feedback: "Incorrect. Courts recognize both development needs and environmental protection, seeking sustainable approaches rather than absolute prioritization."
        }
      ],
      hint: "Think about how courts have incorporated environmental principles into constitutional jurisprudence through Article 21 and directive principles."
    },
    {
      title: "Legislative Privileges vs. Fundamental Rights",
      situation: "A state legislative assembly orders the arrest of a journalist for publishing an article allegedly defaming the Speaker. The journalist claims violation of fundamental rights.",
      question: "How would the court resolve this constitutional conflict?",
      options: [
        {
          text: "Legislative privileges are absolute and cannot be questioned in any court.",
          isCorrect: false,
          feedback: "Incorrect. While legislative privileges are important, they are not absolute and must be harmonized with fundamental rights."
        },
        {
          text: "The court would examine whether the assembly's action was related to its legislative functions and balance it with fundamental rights.",
          isCorrect: true,
          feedback: "Correct! In cases like MSM Sharma v. Sri Krishna Sinha and Raja Ram Pal v. Hon'ble Speaker, the Supreme Court has held that it can examine whether legislative privileges have been exercised within constitutional limits and must be harmonized with fundamental rights."
        },
        {
          text: "Fundamental rights always override legislative privileges without exception.",
          isCorrect: false,
          feedback: "Incorrect. Courts seek to harmonize these constitutional provisions rather than establishing absolute hierarchy."
        },
        {
          text: "Only the legislature can decide the extent of its own privileges with no judicial oversight.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has established its power to determine the constitutional validity of actions taken under legislative privileges."
        }
      ],
      hint: "Consider how courts balance constitutional provisions for legislative privileges with fundamental rights protections."
    }
  ];
}

// Scenario 3: Constitutional Governance Dilemmas
function getConstitutionalGovernanceScenarios() {
  return [
    {
      title: "Federalism and National Emergencies",
      situation: "During a pandemic, the central government issues nationwide directives under the Disaster Management Act that conflict with measures implemented by several state governments.",
      question: "How should this federal conflict be resolved constitutionally?",
      options: [
        {
          text: "States must always follow central directives during emergencies without question.",
          isCorrect: false,
          feedback: "Incorrect. While the centre has certain overriding powers during emergencies, the federal structure remains intact and requires cooperative federalism."
        },
        {
          text: "States have complete autonomy to reject central directives.",
          isCorrect: false,
          feedback: "Incorrect. The Constitution establishes a unified structure with specific powers for the centre during emergencies."
        },
        {
          text: "Apply the doctrine of harmonious construction, with central measures prevailing where there is direct conflict on matters of national importance.",
          isCorrect: true,
          feedback: "Correct! Courts apply the doctrine of harmonious construction to balance federal powers. During national emergencies affecting multiple states, central measures on the specific emergency response generally prevail in direct conflicts, while respecting state authority in other areas."
        },
        {
          text: "Each state can decide independently which directives to follow with no coordinated approach.",
          isCorrect: false,
          feedback: "Incorrect. This would undermine the constitutional framework for national emergencies and create potentially dangerous inconsistencies in emergency response."
        }
      ],
      hint: "Consider how the Constitution balances central authority and state autonomy, especially during national emergencies."
    },
    {
      title: "Appointment of Constitutional Authorities",
      situation: "The government seeks to appoint the Chief Election Commissioner through a committee that gives dominant representation to the ruling party with minimal opposition input.",
      question: "Would this appointment mechanism be constitutionally sound?",
      options: [
        {
          text: "Yes, the ruling majority has complete discretion in appointments.",
          isCorrect: false,
          feedback: "Incorrect. The Supreme Court has emphasized the need for independence and neutrality in constitutional appointments."
        },
        {
          text: "No, as independent constitutional authorities require appointment processes that ensure institutional independence.",
          isCorrect: true,
          feedback: "Correct! In cases like Anoop Baranwal v. Union of India (2023), the Supreme Court has emphasized that appointment mechanisms for constitutional authorities like the Election Commission must ensure independence and neutrality, requiring meaningful multi-partisan involvement rather than executive dominance."
        },
        {
          text: "Yes, as the Constitution doesn't specify detailed appointment procedures.",
          isCorrect: false,
          feedback: "Incorrect. While specific procedures may not be detailed, the Supreme Court has interpreted constitutional provisions to require procedures that preserve the independence of these institutions."
        },
        {
          text: "No, as all appointments must have unanimous political consensus.",
          isCorrect: false,
          feedback: "Incorrect. While broad consensus is valuable, the key requirement is a balanced process that prevents dominance by any single political interest, not unanimity."
        }
      ],
      hint: "Think about recent Supreme Court judgments on appointments to constitutional bodies and the principles they establish."
    },
    {
      title: "Separation of Powers",
      situation: "Parliament passes a law nullifying a Supreme Court judgment that had struck down a previous law as unconstitutional. The new law includes identical provisions to those previously invalidated.",
      question: "How would this conflict between legislature and judiciary be resolved?",
      options: [
        {
          text: "Parliament can override any judicial decision through legislation.",
          isCorrect: false,
          feedback: "Incorrect. Parliament cannot directly override a constitutional judgment through ordinary legislation."
        },
        {
          text: "The law would be invalid as the legislature cannot directly overturn a constitutional judgment of the Supreme Court.",
          isCorrect: true,
          feedback: "Correct! In cases like Minerva Mills and others, the Supreme Court has established that Parliament cannot directly nullify a constitutional judgment through ordinary legislation. This would violate separation of powers."
        },
        {
          text: "The law would be valid if passed by a special majority.",
          isCorrect: false,
          feedback: "Incorrect. Even a special majority cannot allow Parliament to directly overturn a constitutional judgment through ordinary legislation."
        },
        {
          text: "Only the judiciary can decide the constitutionality of laws with no checks.",
          isCorrect: false,
          feedback: "Incorrect. While the judiciary has the final say on constitutionality, Parliament can amend the Constitution (subject to basic structure) to change the constitutional basis of a judgment."
        }
      ],
      hint: "Consider the separation of powers and how the Constitution balances legislative and judicial authority."
    },
    {
      title: "Money Bills and Legislative Process",
      situation: "The government introduces far-reaching economic reforms through a money bill to bypass Rajya Sabha approval. The bill contains provisions not directly related to taxation or government spending.",
      question: "Is this legislative approach constitutionally valid?",
      options: [
        {
          text: "Yes, the Speaker's certification of a bill as a money bill is final and cannot be questioned.",
          isCorrect: false,
          feedback: "Incorrect. In the Rojer Mathew case, the Supreme Court indicated that the Speaker's decision can be subject to judicial review if it suffers from manifest illegality or constitutional malice."
        },
        {
          text: "No, as provisions unrelated to the specific subjects listed in Article 110 cannot be part of a money bill.",
          isCorrect: true,
          feedback: "Correct! In cases like Rojer Mathew and the subsequent AADHAR judgment, the Supreme Court has clarified that money bills are strictly limited to matters specified in Article 110. Including unrelated provisions to bypass Rajya Sabha would be constitutionally improper."
        },
        {
          text: "Yes, any bill dealing with economic matters can be classified as a money bill.",
          isCorrect: false,
          feedback: "Incorrect. Article 110 specifically defines what constitutes a money bill, and not all economic matters fall within this definition."
        },
        {
          text: "No, as Rajya Sabha approval is mandatory for all legislation without exception.",
          isCorrect: false,
          feedback: "Incorrect. The Constitution does create specific exceptions for money bills, but with a narrow definition of what constitutes such bills."
        }
      ],
      hint: "Consider Article 110's definition of money bills and recent Supreme Court judgments on this issue."
    },
    {
      title: "Governor's Discretionary Powers",
      situation: "After inconclusive election results, the Governor invites the second-largest party to form the government without first inviting the largest party or alliance to prove its majority.",
      question: "Is this exercise of Governor's discretion constitutionally proper?",
      options: [
        {
          text: "Yes, the Governor has absolute discretion in government formation.",
          isCorrect: false,
          feedback: "Incorrect. While the Governor has discretion, it must be exercised in accordance with constitutional conventions and principles."
        },
        {
          text: "No, the Governor must follow the established constitutional convention of inviting the largest party/alliance first.",
          isCorrect: true,
          feedback: "Correct! In cases like Rameshwar Prasad and S.R. Bommai, the Supreme Court has established that the Governor's discretion is not absolute and must follow constitutional conventions. These conventions generally require first inviting the largest party/pre-poll alliance to form the government."
        },
        {
          text: "Yes, the Governor can invite any party that they personally believe can form a stable government.",
          isCorrect: false,
          feedback: "Incorrect. The Governor's personal belief is not the constitutional standard; they must follow objective criteria and established conventions."
        },
        {
          text: "No, the Governor has no discretion and must always call for fresh elections in hung assemblies.",
          isCorrect: false,
          feedback: "Incorrect. The Governor does have discretion in hung assemblies, but it must be exercised according to constitutional principles, not arbitrarily."
        }
      ],
      hint: "Consider the Sarkaria Commission recommendations and Supreme Court judgments on the Governor's role in government formation."
    }
  ];
} 