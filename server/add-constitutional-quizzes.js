// This script adds detailed constitutional quizzes to the database
// Run with: node add-constitutional-quizzes.js

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
  addConstitutionalQuizzes();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function addConstitutionalQuizzes() {
  try {
    console.log('🧠 Adding comprehensive constitutional quizzes...');
    
    // Find the topic for constitutional quizzes
    const topic = await Topic.findOne({ 
      $or: [
        { title: { $regex: /constitution/i } },
        { title: { $regex: /fundamental/i } },
        { category: 'fundamental-rights' }
      ]
    });
    
    if (!topic) {
      console.error('❌ No suitable topic found for constitutional quizzes');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`✅ Found topic: ${topic.title} (${topic._id})`);
    
    // Create the quiz content
    const quizContent = [
      {
        title: "Comprehensive Constitutional Principles Quiz",
        type: "game",
        content: "Test your knowledge of the core principles and concepts of the Indian Constitution with this comprehensive quiz.",
        estimatedTime: 20,
        points: 100,
        gameConfig: {
          type: "quiz",
          config: getComprehensiveConstitutionalPrinciplesQuiz()
        },
        topic: topic._id,
        order: 1,
        isActive: true
      },
      {
        title: "Fundamental Rights Deep Dive Quiz",
        type: "game",
        content: "Challenge yourself with detailed questions about the Fundamental Rights enshrined in the Indian Constitution.",
        estimatedTime: 15,
        points: 80,
        gameConfig: {
          type: "quiz",
          config: getFundamentalRightsQuiz()
        },
        topic: topic._id,
        order: 2,
        isActive: true
      },
      {
        title: "Constitutional Amendments Master Quiz",
        type: "game",
        content: "Test your knowledge about the important amendments that have shaped the Indian Constitution over time.",
        estimatedTime: 25,
        points: 120,
        gameConfig: {
          type: "quiz",
          config: getConstitutionalAmendmentsQuiz()
        },
        topic: topic._id,
        order: 3,
        isActive: true
      },
      {
        title: "Directive Principles & Landmark Cases Quiz",
        type: "game",
        content: "Explore your understanding of Directive Principles of State Policy and landmark Supreme Court judgments that have interpreted the Constitution.",
        estimatedTime: 20,
        points: 100,
        gameConfig: {
          type: "quiz",
          config: getDirectivePrinciplesAndLandmarkCasesQuiz()
        },
        topic: topic._id,
        order: 4,
        isActive: true
      },
      {
        title: "Constitutional Governance & Structure Quiz",
        type: "game",
        content: "Test your knowledge of the governmental structure, powers, and constitutional bodies established by the Indian Constitution.",
        estimatedTime: 20,
        points: 100,
        gameConfig: {
          type: "quiz",
          config: getConstitutionalGovernanceQuiz()
        },
        topic: topic._id,
        order: 5,
        isActive: true
      }
    ];
    
    let createdCount = 0;
    
    for (const quiz of quizContent) {
      // Check if a similar quiz already exists
      const existingQuiz = await Content.findOne({ 
        title: quiz.title,
        topic: quiz.topic
      });
      
      if (existingQuiz) {
        console.log(`⚠️ Quiz '${quiz.title}' already exists. Updating...`);
        existingQuiz.gameConfig = quiz.gameConfig;
        await existingQuiz.save();
        console.log(`✅ Updated quiz: ${quiz.title}`);
        createdCount++;
      } else {
        // Create new quiz
        const newQuiz = new Content(quiz);
        await newQuiz.save();
        console.log(`✅ Created new quiz: ${quiz.title}`);
        createdCount++;
      }
    }
    
    console.log(`\n🎉 Successfully added/updated ${createdCount} constitutional quizzes`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error adding constitutional quizzes:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Quiz 1: Comprehensive Constitutional Principles Quiz
function getComprehensiveConstitutionalPrinciplesQuiz() {
  return {
    timeLimit: 1200, // 20 minutes
    passingScore: 70,
    questions: [
      {
        question: "Which of the following is described as the 'soul of the Indian Constitution'?",
        options: [
          { text: "Fundamental Rights (Part III)", isCorrect: true },
          { text: "Directive Principles of State Policy (Part IV)", isCorrect: false },
          { text: "The Preamble", isCorrect: false },
          { text: "Fundamental Duties (Part IVA)", isCorrect: false }
        ],
        explanation: "Part III of the Constitution, which enshrines Fundamental Rights, is often described as the 'soul of the Constitution' as it provides justiciable rights to citizens and acts as a check on government power."
      },
      {
        question: "The Indian Constitution derives its authority from:",
        options: [
          { text: "The Parliament of India", isCorrect: false },
          { text: "The British Parliament", isCorrect: false },
          { text: "The People of India", isCorrect: true },
          { text: "The Constituent Assembly", isCorrect: false }
        ],
        explanation: "The opening words of the Preamble 'We, the people of India...' indicate that the Constitution derives its authority from the people of India, establishing popular sovereignty."
      },
      {
        question: "The Constituent Assembly that drafted the Indian Constitution was established under:",
        options: [
          { text: "The Indian Independence Act, 1947", isCorrect: false },
          { text: "The Cabinet Mission Plan, 1946", isCorrect: true },
          { text: "The Government of India Act, 1935", isCorrect: false },
          { text: "The Mountbatten Plan, 1947", isCorrect: false }
        ],
        explanation: "The Constituent Assembly of India was established as per the Cabinet Mission Plan of 1946. It first met on December 9, 1946, and its last session was held on January 24, 1950."
      },
      {
        question: "Which principle of the Indian Constitution states that no person shall be deprived of life or personal liberty except according to procedure established by law?",
        options: [
          { text: "Principle of Equality", isCorrect: false },
          { text: "Due Process of Law", isCorrect: false },
          { text: "Procedure Established by Law", isCorrect: true },
          { text: "Rule of Law", isCorrect: false }
        ],
        explanation: "Article 21 of the Indian Constitution states that 'No person shall be deprived of his life or personal liberty except according to procedure established by law.' This is the principle of Procedure Established by Law."
      },
      {
        question: "The Indian Constitution is:",
        options: [
          { text: "Completely rigid", isCorrect: false },
          { text: "Completely flexible", isCorrect: false },
          { text: "Partly rigid and partly flexible", isCorrect: true },
          { text: "Neither rigid nor flexible", isCorrect: false }
        ],
        explanation: "The Indian Constitution is partly rigid and partly flexible. Some provisions can be amended by a simple majority, some by a special majority (2/3rd), and some require special majority plus ratification by states."
      },
      {
        question: "Which of the following is NOT a feature borrowed from the British Constitution?",
        options: [
          { text: "Parliamentary System of Government", isCorrect: false },
          { text: "Rule of Law", isCorrect: false },
          { text: "Single Citizenship", isCorrect: false },
          { text: "Fundamental Rights", isCorrect: true }
        ],
        explanation: "Fundamental Rights were borrowed from the US Constitution. The Parliamentary System, Rule of Law, and Single Citizenship were borrowed from the British Constitution."
      },
      {
        question: "The 'basic structure doctrine' of the Indian Constitution was propounded in which of the following cases?",
        options: [
          { text: "Golak Nath v. State of Punjab", isCorrect: false },
          { text: "Kesavananda Bharati v. State of Kerala", isCorrect: true },
          { text: "Minerva Mills v. Union of India", isCorrect: false },
          { text: "Maneka Gandhi v. Union of India", isCorrect: false }
        ],
        explanation: "The basic structure doctrine was propounded in the landmark case of Kesavananda Bharati v. State of Kerala (1973), which held that Parliament cannot amend the basic structure of the Constitution."
      },
      {
        question: "Which of the following has been described as the 'Magna Carta of India'?",
        options: [
          { text: "The Preamble to the Constitution", isCorrect: false },
          { text: "Fundamental Rights", isCorrect: true },
          { text: "Directive Principles of State Policy", isCorrect: false },
          { text: "The entire Constitution", isCorrect: false }
        ],
        explanation: "Fundamental Rights (Articles 12-35) have been described as the 'Magna Carta of India' as they serve as a charter of rights, similar to how the Magna Carta provided rights in England."
      },
      {
        question: "The term 'socialist' was added to the Preamble of the Indian Constitution by which Amendment?",
        options: [
          { text: "1st Amendment", isCorrect: false },
          { text: "42nd Amendment", isCorrect: true },
          { text: "44th Amendment", isCorrect: false },
          { text: "74th Amendment", isCorrect: false }
        ],
        explanation: "The 42nd Amendment Act of 1976 (during Emergency) added the terms 'socialist', 'secular', and 'integrity' to the Preamble of the Indian Constitution."
      },
      {
        question: "Which of the following is considered as a 'state' under Article 12 of the Indian Constitution?",
        options: [
          { text: "A private educational institution", isCorrect: false },
          { text: "A private company", isCorrect: false },
          { text: "A government company", isCorrect: true },
          { text: "A residential welfare association", isCorrect: false }
        ],
        explanation: "Government companies come under the definition of 'state' as per Article 12, which includes the government and Parliament of India, the government and legislature of states, and all local or other authorities within India or under the control of the Indian government."
      }
    ]
  };
}

// Quiz 2: Fundamental Rights Deep Dive Quiz
function getFundamentalRightsQuiz() {
  return {
    timeLimit: 900, // 15 minutes
    passingScore: 70,
    questions: [
      {
        question: "Which Article of the Indian Constitution abolishes untouchability and forbids its practice in any form?",
        options: [
          { text: "Article 14", isCorrect: false },
          { text: "Article 15", isCorrect: false },
          { text: "Article 17", isCorrect: true },
          { text: "Article 21", isCorrect: false }
        ],
        explanation: "Article 17 of the Indian Constitution abolishes untouchability and forbids its practice in any form. It states: 'Untouchability is abolished and its practice in any form is forbidden.'"
      },
      {
        question: "The 'Right to Education' is guaranteed under which Article of the Indian Constitution?",
        options: [
          { text: "Article 21", isCorrect: false },
          { text: "Article 21A", isCorrect: true },
          { text: "Article 29", isCorrect: false },
          { text: "Article 45", isCorrect: false }
        ],
        explanation: "The Right to Education is guaranteed under Article 21A, which was added by the 86th Constitutional Amendment Act, 2002. It provides for free and compulsory education to all children between the ages of 6 and 14 years."
      },
      {
        question: "The Right to Constitutional Remedies under Article 32 is enforceable against:",
        options: [
          { text: "Only the Central Government", isCorrect: false },
          { text: "Only the State Governments", isCorrect: false },
          { text: "Both Central and State Governments", isCorrect: false },
          { text: "Any authority that comes under the definition of 'State' in Article 12", isCorrect: true }
        ],
        explanation: "The Right to Constitutional Remedies under Article 32 is enforceable against any authority that comes under the definition of 'State' in Article 12, which includes the government and Parliament of India, state governments and legislatures, and all local or other authorities."
      },
      {
        question: "Which of the following writs is issued by a court to an inferior court or tribunal to prevent it from exceeding its jurisdiction?",
        options: [
          { text: "Habeas Corpus", isCorrect: false },
          { text: "Mandamus", isCorrect: false },
          { text: "Prohibition", isCorrect: true },
          { text: "Quo Warranto", isCorrect: false }
        ],
        explanation: "The writ of Prohibition is issued by a higher court to a lower court or tribunal to prevent it from exceeding its jurisdiction or acting contrary to the rules of natural justice."
      },
      {
        question: "Dr. B.R. Ambedkar described which of the following Articles as the 'heart and soul' of the Indian Constitution?",
        options: [
          { text: "Article 14 (Right to Equality)", isCorrect: false },
          { text: "Article 19 (Right to Freedom)", isCorrect: false },
          { text: "Article 21 (Right to Life and Personal Liberty)", isCorrect: false },
          { text: "Article 32 (Right to Constitutional Remedies)", isCorrect: true }
        ],
        explanation: "Dr. B.R. Ambedkar described Article 32, which provides for the Right to Constitutional Remedies, as the 'heart and soul' of the Indian Constitution because it guarantees the enforcement of fundamental rights."
      },
      {
        question: "Which of the following is NOT a restriction on the freedom of speech and expression under Article 19(2)?",
        options: [
          { text: "Security of the State", isCorrect: false },
          { text: "Friendly relations with foreign States", isCorrect: false },
          { text: "Economic interests", isCorrect: true },
          { text: "Contempt of court", isCorrect: false }
        ],
        explanation: "Economic interests are not specifically mentioned as a restriction on freedom of speech and expression under Article 19(2). The restrictions include security of state, friendly relations with foreign states, public order, decency or morality, contempt of court, defamation, incitement to offense, and sovereignty and integrity of India."
      },
      {
        question: "In which landmark case did the Supreme Court expand the scope of Article 21 to include the right to live with human dignity?",
        options: [
          { text: "Maneka Gandhi v. Union of India", isCorrect: false },
          { text: "Francis Coralie Mullin v. The Administrator", isCorrect: true },
          { text: "Olga Tellis v. Bombay Municipal Corporation", isCorrect: false },
          { text: "Vishaka v. State of Rajasthan", isCorrect: false }
        ],
        explanation: "In Francis Coralie Mullin v. The Administrator (1981), the Supreme Court expanded the scope of Article 21 to include the right to live with human dignity, which includes the bare necessities of life such as adequate nutrition, clothing, shelter, and facilities for reading, writing, and expressing oneself."
      },
      {
        question: "Which of the following Fundamental Rights is available only to citizens and not to foreigners?",
        options: [
          { text: "Right to equality before law (Article 14)", isCorrect: false },
          { text: "Right to life and personal liberty (Article 21)", isCorrect: false },
          { text: "Right to practice any profession (Article 19(1)(g))", isCorrect: true },
          { text: "Right to freedom of religion (Article 25)", isCorrect: false }
        ],
        explanation: "The rights guaranteed under Article 19, including the right to practice any profession or carry on any occupation, trade, or business under Article 19(1)(g), are available only to citizens of India and not to foreigners."
      },
      {
        question: "The concept of 'creamy layer' is associated with which of the following Articles of the Indian Constitution?",
        options: [
          { text: "Article 14", isCorrect: false },
          { text: "Article 15(4)", isCorrect: false },
          { text: "Article 16(4)", isCorrect: true },
          { text: "Article 21", isCorrect: false }
        ],
        explanation: "The concept of 'creamy layer' is associated with Article 16(4), which provides for reservation in appointments or posts in favor of backward classes. The Supreme Court introduced this concept in the Indra Sawhney case (1992) to exclude socially advanced persons (creamy layer) from backward classes."
      },
      {
        question: "Which of the following rights was removed from the list of Fundamental Rights by the 44th Amendment to the Indian Constitution?",
        options: [
          { text: "Right to Property (Article 31)", isCorrect: true },
          { text: "Right to Constitutional Remedies (Article 32)", isCorrect: false },
          { text: "Right against Exploitation (Articles 23-24)", isCorrect: false },
          { text: "Right to Freedom of Religion (Articles 25-28)", isCorrect: false }
        ],
        explanation: "The Right to Property, which was originally a Fundamental Right under Article 31, was removed from the list of Fundamental Rights by the 44th Amendment Act, 1978. It was made a legal right under Article 300A."
      }
    ]
  };
}

// Quiz 3: Constitutional Amendments Quiz
function getConstitutionalAmendmentsQuiz() {
  return {
    timeLimit: 1500, // 25 minutes
    passingScore: 70,
    questions: [
      {
        question: "Which Constitutional Amendment is known as the 'Mini Constitution' due to the extensive changes it made?",
        options: [
          { text: "7th Amendment", isCorrect: false },
          { text: "42nd Amendment", isCorrect: true },
          { text: "44th Amendment", isCorrect: false },
          { text: "73rd Amendment", isCorrect: false }
        ],
        explanation: "The 42nd Amendment Act of 1976, enacted during the Emergency, made the most extensive changes to the Constitution at one time and is often referred to as a 'Mini Constitution' or 'Constitution of Indira'."
      },
      {
        question: "The Goods and Services Tax (GST) was introduced by which Constitutional Amendment?",
        options: [
          { text: "99th Amendment", isCorrect: false },
          { text: "100th Amendment", isCorrect: false },
          { text: "101st Amendment", isCorrect: true },
          { text: "102nd Amendment", isCorrect: false }
        ],
        explanation: "The 101st Constitutional Amendment Act, 2016 introduced the Goods and Services Tax (GST) in India. It added a new Article 246A that gives power to Parliament and state legislatures to make laws on GST."
      },
      {
        question: "Which Constitutional Amendment gave constitutional status to the Panchayati Raj Institutions?",
        options: [
          { text: "71st Amendment", isCorrect: false },
          { text: "73rd Amendment", isCorrect: true },
          { text: "74th Amendment", isCorrect: false },
          { text: "75th Amendment", isCorrect: false }
        ],
        explanation: "The 73rd Constitutional Amendment Act, 1992 gave constitutional status to the Panchayati Raj Institutions and added a new Part IX to the Constitution titled 'The Panchayats'."
      },
      {
        question: "The 86th Constitutional Amendment Act is associated with:",
        options: [
          { text: "Right to Freedom of Religion", isCorrect: false },
          { text: "Right to Constitutional Remedies", isCorrect: false },
          { text: "Right to Education", isCorrect: true },
          { text: "Right to Property", isCorrect: false }
        ],
        explanation: "The 86th Constitutional Amendment Act, 2002 made education a fundamental right by inserting Article 21A, which provides for free and compulsory education to all children between the ages of 6 and 14 years."
      },
      {
        question: "Which Amendment added Fundamental Duties to the Indian Constitution?",
        options: [
          { text: "42nd Amendment", isCorrect: true },
          { text: "44th Amendment", isCorrect: false },
          { text: "52nd Amendment", isCorrect: false },
          { text: "86th Amendment", isCorrect: false }
        ],
        explanation: "The 42nd Amendment Act, 1976 added Fundamental Duties to the Indian Constitution by inserting a new Part IVA (Article 51A) after the Directive Principles of State Policy."
      },
      {
        question: "The 10% reservation for Economically Weaker Sections (EWS) among the general category was introduced by which Amendment?",
        options: [
          { text: "101st Amendment", isCorrect: false },
          { text: "102nd Amendment", isCorrect: false },
          { text: "103rd Amendment", isCorrect: true },
          { text: "104th Amendment", isCorrect: false }
        ],
        explanation: "The 103rd Constitutional Amendment Act, 2019 provided for 10% reservation in education and government jobs for economically weaker sections (EWS) in the general category."
      },
      {
        question: "Which Constitutional Amendment reduced the voting age from 21 years to 18 years?",
        options: [
          { text: "42nd Amendment", isCorrect: false },
          { text: "44th Amendment", isCorrect: false },
          { text: "61st Amendment", isCorrect: true },
          { text: "73rd Amendment", isCorrect: false }
        ],
        explanation: "The 61st Constitutional Amendment Act, 1988 reduced the voting age from 21 years to 18 years for elections to the Lok Sabha and state legislative assemblies by amending Article 326."
      },
      {
        question: "The National Judicial Appointments Commission (NJAC) was established by which Amendment but was later struck down by the Supreme Court?",
        options: [
          { text: "89th Amendment", isCorrect: false },
          { text: "91st Amendment", isCorrect: false },
          { text: "99th Amendment", isCorrect: true },
          { text: "102nd Amendment", isCorrect: false }
        ],
        explanation: "The 99th Constitutional Amendment Act, 2014 established the National Judicial Appointments Commission (NJAC) to replace the collegium system for appointments to the higher judiciary. However, it was struck down by the Supreme Court in 2015 as unconstitutional."
      },
      {
        question: "Which Constitutional Amendment made the right to property a legal right instead of a fundamental right?",
        options: [
          { text: "42nd Amendment", isCorrect: false },
          { text: "44th Amendment", isCorrect: true },
          { text: "52nd Amendment", isCorrect: false },
          { text: "73rd Amendment", isCorrect: false }
        ],
        explanation: "The 44th Constitutional Amendment Act, 1978 removed the right to property from the list of Fundamental Rights (Article 31) and made it only a legal right under Article 300A."
      },
      {
        question: "The Anti-Defection Law was introduced by which Constitutional Amendment?",
        options: [
          { text: "42nd Amendment", isCorrect: false },
          { text: "44th Amendment", isCorrect: false },
          { text: "52nd Amendment", isCorrect: true },
          { text: "91st Amendment", isCorrect: false }
        ],
        explanation: "The 52nd Constitutional Amendment Act, 1985 added the Tenth Schedule to the Constitution, which contains provisions related to disqualification on grounds of defection (Anti-Defection Law)."
      }
    ]
  };
}

// Quiz 4: Directive Principles & Landmark Cases Quiz
function getDirectivePrinciplesAndLandmarkCasesQuiz() {
  return {
    timeLimit: 1200, // 20 minutes
    passingScore: 70,
    questions: [
      {
        question: "Directive Principles of State Policy are:",
        options: [
          { text: "Enforceable by courts", isCorrect: false },
          { text: "Not enforceable by courts but fundamental in governance", isCorrect: true },
          { text: "Partially enforceable by courts", isCorrect: false },
          { text: "Enforceable only during a national emergency", isCorrect: false }
        ],
        explanation: "As per Article 37 of the Constitution, Directive Principles of State Policy are not enforceable by any court, but they are fundamental in the governance of the country, and it is the duty of the state to apply these principles in making laws."
      },
      {
        question: "Which of the following is a Directive Principle of State Policy?",
        options: [
          { text: "Right to equality before law", isCorrect: false },
          { text: "Right to constitutional remedies", isCorrect: false },
          { text: "Uniform civil code for citizens", isCorrect: true },
          { text: "Right to freedom of religion", isCorrect: false }
        ],
        explanation: "Article 44 directs the state to secure a uniform civil code for citizens throughout the territory of India. This is a Directive Principle of State Policy, not a Fundamental Right."
      },
      {
        question: "In which landmark case did the Supreme Court propound the 'Basic Structure Doctrine'?",
        options: [
          { text: "A.K. Gopalan v. State of Madras", isCorrect: false },
          { text: "Golak Nath v. State of Punjab", isCorrect: false },
          { text: "Kesavananda Bharati v. State of Kerala", isCorrect: true },
          { text: "Minerva Mills v. Union of India", isCorrect: false }
        ],
        explanation: "In the landmark case of Kesavananda Bharati v. State of Kerala (1973), the Supreme Court propounded the 'Basic Structure Doctrine,' holding that Parliament cannot amend the basic or essential features of the Constitution."
      },
      {
        question: "Which case is associated with the evolution of the concept of 'procedure established by law' towards 'due process of law'?",
        options: [
          { text: "A.K. Gopalan v. State of Madras", isCorrect: false },
          { text: "Maneka Gandhi v. Union of India", isCorrect: true },
          { text: "Shankari Prasad v. Union of India", isCorrect: false },
          { text: "Minerva Mills v. Union of India", isCorrect: false }
        ],
        explanation: "In Maneka Gandhi v. Union of India (1978), the Supreme Court evolved the concept of 'procedure established by law' in Article 21 towards 'due process of law,' holding that the procedure must be just, fair, and reasonable."
      },
      {
        question: "Which Directive Principle of State Policy aims at securing equal pay for equal work?",
        options: [
          { text: "Article 39(a)", isCorrect: false },
          { text: "Article 39(d)", isCorrect: true },
          { text: "Article 41", isCorrect: false },
          { text: "Article 45", isCorrect: false }
        ],
        explanation: "Article 39(d) directs the state to secure equal pay for equal work for both men and women. This principle aims at removing wage discrimination based on gender."
      },
      {
        question: "The landmark case of Vishaka v. State of Rajasthan is related to:",
        options: [
          { text: "Sexual harassment at workplace", isCorrect: true },
          { text: "Environmental protection", isCorrect: false },
          { text: "Right to education", isCorrect: false },
          { text: "Anti-defection law", isCorrect: false }
        ],
        explanation: "Vishaka v. State of Rajasthan (1997) is a landmark case related to sexual harassment at workplace. The Supreme Court laid down guidelines for prevention of sexual harassment, which were later replaced by the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013."
      },
      {
        question: "Which Article of the Constitution directs the State to organize village panchayats?",
        options: [
          { text: "Article 40", isCorrect: true },
          { text: "Article 45", isCorrect: false },
          { text: "Article 48", isCorrect: false },
          { text: "Article 51", isCorrect: false }
        ],
        explanation: "Article 40 directs the State to organize village panchayats and endow them with such powers and authority as may be necessary to enable them to function as units of self-government."
      },
      {
        question: "In which landmark case did the Supreme Court declare the Right to Privacy as a fundamental right?",
        options: [
          { text: "M.P. Sharma v. Satish Chandra", isCorrect: false },
          { text: "Kharak Singh v. State of Uttar Pradesh", isCorrect: false },
          { text: "Justice K.S. Puttaswamy v. Union of India", isCorrect: true },
          { text: "Navtej Singh Johar v. Union of India", isCorrect: false }
        ],
        explanation: "In Justice K.S. Puttaswamy v. Union of India (2017), a nine-judge bench of the Supreme Court unanimously declared the Right to Privacy as a fundamental right protected under Articles 14, 19, and 21 of the Constitution."
      },
      {
        question: "Which Directive Principle of State Policy deals with the protection of monuments of historic and artistic interest?",
        options: [
          { text: "Article 48", isCorrect: false },
          { text: "Article 49", isCorrect: true },
          { text: "Article 50", isCorrect: false },
          { text: "Article 51", isCorrect: false }
        ],
        explanation: "Article 49 directs the state to protect monuments, places, and objects of national importance from spoliation, disfigurement, destruction, removal, disposal, or export."
      },
      {
        question: "The landmark case of Indra Sawhney v. Union of India is associated with:",
        options: [
          { text: "Reservation for women in government jobs", isCorrect: false },
          { text: "Reservation for OBCs and the concept of creamy layer", isCorrect: true },
          { text: "Reservation for persons with disabilities", isCorrect: false },
          { text: "Reservation for economically weaker sections", isCorrect: false }
        ],
        explanation: "Indra Sawhney v. Union of India (1992), also known as the Mandal Commission case, is associated with reservation for OBCs (Other Backward Classes) and the concept of 'creamy layer.' The Supreme Court upheld 27% reservation for OBCs but introduced the concept of excluding the creamy layer from its benefits."
      }
    ]
  };
}

// Quiz 5: Constitutional Governance Quiz
function getConstitutionalGovernanceQuiz() {
  return {
    timeLimit: 1200, // 20 minutes
    passingScore: 70,
    questions: [
      {
        question: "Under which Article of the Constitution is the President of India elected?",
        options: [
          { text: "Article 52", isCorrect: false },
          { text: "Article 54", isCorrect: true },
          { text: "Article 58", isCorrect: false },
          { text: "Article 61", isCorrect: false }
        ],
        explanation: "Article 54 of the Constitution provides for the election of the President by an electoral college consisting of the elected members of both Houses of Parliament and the elected members of the Legislative Assemblies of the States."
      },
      {
        question: "The concept of 'Collective Responsibility' of the Council of Ministers is mentioned in which Article of the Indian Constitution?",
        options: [
          { text: "Article 74", isCorrect: false },
          { text: "Article 75", isCorrect: true },
          { text: "Article 77", isCorrect: false },
          { text: "Article 78", isCorrect: false }
        ],
        explanation: "Article 75(3) of the Constitution states that 'The Council of Ministers shall be collectively responsible to the House of the People,' thus establishing the principle of collective responsibility."
      },
      {
        question: "Which of the following is NOT a qualification for appointment as a judge of the Supreme Court of India?",
        options: [
          { text: "Citizen of India", isCorrect: false },
          { text: "At least five years' experience as a High Court judge", isCorrect: false },
          { text: "At least ten years' experience as an advocate of a High Court", isCorrect: false },
          { text: "Minimum age of 45 years", isCorrect: true }
        ],
        explanation: "There is no minimum age requirement for appointment as a judge of the Supreme Court. The qualifications are: (1) Citizen of India, (2) Either a judge of a High Court for at least five years, or an advocate of a High Court for at least ten years, or a distinguished jurist in the opinion of the President."
      },
      {
        question: "Who administers the oath of office to the President of India?",
        options: [
          { text: "Prime Minister of India", isCorrect: false },
          { text: "Vice-President of India", isCorrect: false },
          { text: "Chief Justice of India", isCorrect: true },
          { text: "Speaker of the Lok Sabha", isCorrect: false }
        ],
        explanation: "As per Article 60 of the Constitution, the oath of office to the President is administered by the Chief Justice of India, and in his absence, by the senior-most judge of the Supreme Court."
      },
      {
        question: "Which of the following statements is correct about the Attorney General of India?",
        options: [
          { text: "He is appointed by the Prime Minister", isCorrect: false },
          { text: "He must have the same qualifications as a Supreme Court judge", isCorrect: true },
          { text: "He is a member of the Parliament", isCorrect: false },
          { text: "He is a member of the Union Cabinet", isCorrect: false }
        ],
        explanation: "As per Article 76, the Attorney General must have the same qualifications as required for a judge of the Supreme Court. He is appointed by the President and holds office during the pleasure of the President."
      },
      {
        question: "The power to summon and prorogue the Houses of Parliament rests with:",
        options: [
          { text: "The Prime Minister", isCorrect: false },
          { text: "The President", isCorrect: true },
          { text: "The Speaker of Lok Sabha", isCorrect: false },
          { text: "The Chairman of Rajya Sabha", isCorrect: false }
        ],
        explanation: "As per Articles 85 and 174, the power to summon and prorogue the Houses of Parliament and State Legislatures rests with the President and Governors respectively, who exercise this power on the advice of the Council of Ministers."
      },
      {
        question: "Under the Indian Constitution, which of the following is a non-justiciable duty of the President?",
        options: [
          { text: "Appointment of the Prime Minister", isCorrect: false },
          { text: "Granting pardons", isCorrect: false },
          { text: "Returning a bill for reconsideration", isCorrect: false },
          { text: "Preservation, protection, and defense of the Constitution", isCorrect: true }
        ],
        explanation: "The oath taken by the President under Article 60 to preserve, protect, and defend the Constitution is a non-justiciable duty, meaning it cannot be enforced by courts."
      },
      {
        question: "The electoral college for the election of the Vice-President of India consists of:",
        options: [
          { text: "Members of both Houses of Parliament", isCorrect: true },
          { text: "Members of both Houses of Parliament and State Legislative Assemblies", isCorrect: false },
          { text: "Only members of Rajya Sabha", isCorrect: false },
          { text: "Only members of Lok Sabha", isCorrect: false }
        ],
        explanation: "As per Article 66, the Vice-President is elected by the members of an electoral college consisting of the members of both Houses of Parliament (Lok Sabha and Rajya Sabha) in accordance with the system of proportional representation by means of a single transferable vote."
      },
      {
        question: "Which of the following Constitutional Bodies is NOT mentioned in the Constitution of India?",
        options: [
          { text: "Election Commission", isCorrect: false },
          { text: "Union Public Service Commission", isCorrect: false },
          { text: "Central Vigilance Commission", isCorrect: true },
          { text: "Finance Commission", isCorrect: false }
        ],
        explanation: "The Central Vigilance Commission (CVC) is not mentioned in the Constitution. It was established by a Government Resolution in 1964 based on the recommendations of the Santhanam Committee and was later given statutory status by the Central Vigilance Commission Act, 2003."
      },
      {
        question: "Under which emergency provision does the financial emergency fall?",
        options: [
          { text: "Article 352", isCorrect: false },
          { text: "Article 356", isCorrect: false },
          { text: "Article 360", isCorrect: true },
          { text: "Article 370", isCorrect: false }
        ],
        explanation: "Financial Emergency falls under Article 360 of the Constitution. It can be proclaimed by the President if he is satisfied that a situation has arisen whereby the financial stability or credit of India or any part thereof is threatened."
      }
    ]
  };
} 