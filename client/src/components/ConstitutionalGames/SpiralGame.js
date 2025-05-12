import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ConstitutionSpiralGame = ({ gameData, onComplete, isCompleted, score, onPlayAgain }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState(null);
  const [progress, setProgress] = useState(0);
  const [exploredItems, setExploredItems] = useState([]);
  
  // Calculate progress
  useEffect(() => {
    if (gameData && gameData.levels) {
      const totalItems = gameData.levels.reduce((acc, level) => acc + level.items.length, 0);
      const progressPercentage = (exploredItems.length / totalItems) * 100;
      setProgress(progressPercentage);
      
      // If all items are explored, complete the game
      if (progressPercentage >= 100 && !isCompleted) {
        onComplete(100);
      }
    }
  }, [exploredItems, gameData, onComplete, isCompleted]);
  
  // Handle level selection
  const handleLevelSelect = (level, index) => {
    setSelectedLevel(index);
    setSelectedItem(null);
    setDetails(null);
  };
  
  // Handle item selection
  const handleItemSelect = (item, levelIndex) => {
    // Mark item as explored if not already
    if (!exploredItems.includes(`${levelIndex}-${item}`)) {
      setExploredItems([...exploredItems, `${levelIndex}-${item}`]);
    }
    
    setSelectedItem(item);
    
    // Set details based on the selected item
    // In a real application, these would come from a database
    const detailsMap = {
      // Level 0
      "Preamble": {
        title: "Preamble",
        content: "The Preamble declares India to be a sovereign, socialist, secular, democratic republic. It secures to all citizens justice, liberty, equality and fraternity.",
        facts: ["The Preamble was amended once by the 42nd Amendment (1976)", "Words 'socialist', 'secular', and 'integrity' were added in 1976"]
      },
      "History": {
        title: "Constitutional History",
        content: "The Constitution was drafted by the Constituent Assembly between 1946 and 1949. It was adopted on 26 November 1949 and came into effect on 26 January 1950.",
        facts: ["The drafting took 2 years, 11 months and 17 days", "Dr. B.R. Ambedkar was the Chairman of the Drafting Committee"]
      },
      "Features": {
        title: "Key Features",
        content: "The Indian Constitution is the longest written constitution of any sovereign country in the world. It contains 395 articles in 22 parts, 12 schedules, and 105 amendments.",
        facts: ["It is a mixture of federalism and unitary features", "Inspired by constitutions from many countries including UK, USA, Ireland, etc."]
      },
      
      // Level 1
      "Parts I-VIII": {
        title: "Parts I-VIII",
        content: "These parts cover Union & Territory, Citizenship, Fundamental Rights, Directive Principles, Fundamental Duties, Union Government, and State Government.",
        facts: ["Part III on Fundamental Rights is often called the soul of the Constitution", "Part IV contains non-justiciable Directive Principles"]
      },
      "Parts IX-XV": {
        title: "Parts IX-XV",
        content: "These parts cover Panchayats, Municipalities, Cooperative Societies, Scheduled & Tribal Areas, Center-State Relations, Finance, and Trade & Commerce.",
        facts: ["Part IX was added by the 73rd Amendment (1992)", "Part IX-A was added by the 74th Amendment (1992)"]
      },
      "Parts XVI-XXII": {
        title: "Parts XVI-XXII",
        content: "These parts cover Special Provisions for certain classes, Official Language, Emergency Provisions, Amendments, Temporary Provisions, and more.",
        facts: ["Part XVIII covers three types of emergencies", "Part XX (Article 368) deals with the power to amend the Constitution"]
      },
      
      // Level 2
      "Schedules 1-4": {
        title: "Schedules 1-4",
        content: "Schedule 1: Names of States and Union Territories. Schedule 2: Salaries of officials. Schedule 3: Forms of Oaths. Schedule 4: Allocation of seats in Rajya Sabha.",
        facts: ["First Schedule has been amended multiple times to reflect changes in states", "Second Schedule covers salaries of the President, Governors, Judges, etc."]
      },
      "Schedules 5-8": {
        title: "Schedules 5-8",
        content: "Schedule 5: Administration of Scheduled Areas. Schedule 6: Administration of Tribal Areas. Schedule 7: Division of powers (Union, State, Concurrent Lists). Schedule 8: 22 Official Languages.",
        facts: ["Seventh Schedule contains three lists with 97, 66, and 47 subjects respectively", "Eighth Schedule originally had 14 languages, now has 22"]
      },
      "Schedules 9-12": {
        title: "Schedules 9-12",
        content: "Schedule 9: Acts & Regulations protected from judicial review. Schedule 10: Anti-defection provisions. Schedule 11: Panchayat powers. Schedule 12: Municipality powers.",
        facts: ["Ninth Schedule was added by the First Amendment in 1951", "Tenth Schedule was added by the 52nd Amendment in 1985"]
      },
      
      // Level 3
      "1st-42nd": {
        title: "Amendments 1-42",
        content: "Key amendments include the 1st (Added Ninth Schedule), 7th (Reorganization of states), 24th & 25th (Parliament's amending powers), and 42nd (Comprehensive changes during Emergency).",
        facts: ["42nd Amendment (1976) is known as 'Mini-Constitution'", "It made the most extensive changes to the Constitution"]
      },
      "43rd-86th": {
        title: "Amendments 43-86",
        content: "Key amendments include the 44th (Restored Supreme Court powers), 73rd & 74th (Local governments), 86th (Right to Education).",
        facts: ["73rd & 74th Amendments (1992) gave constitutional status to local governments", "86th Amendment (2002) made education a fundamental right"]
      },
      "87th-105th": {
        title: "Amendments 87-105",
        content: "Recent amendments include the 101st (GST), 102nd (National Commission for Backward Classes), and 103rd (10% reservation for Economically Weaker Sections).",
        facts: ["101st Amendment (2016) introduced Goods and Services Tax", "103rd Amendment (2019) provided for 10% reservation for economically weaker sections"]
      },
      
      // Level 4
      "Basic Structure": {
        title: "Basic Structure Doctrine",
        content: "This doctrine, established in the Kesavananda Bharati case (1973), holds that Parliament cannot amend the basic structure or framework of the Constitution.",
        facts: ["It is a judicial innovation not explicitly mentioned in the Constitution", "Parliament can amend but not destroy the basic structure"]
      },
      "Judicial Review": {
        title: "Judicial Review",
        content: "The power of the courts to examine the constitutionality of legislative acts and executive orders. It's a check to ensure they don't violate the Constitution.",
        facts: ["Derived from Articles 13, 32, 226 and 227", "Supreme Court can strike down laws that violate fundamental rights"]
      },
      "Landmark Cases": {
        title: "Landmark Cases",
        content: "Key cases include Kesavananda Bharati v. State of Kerala, Golaknath v. State of Punjab, Maneka Gandhi v. Union of India, and Minerva Mills v. Union of India.",
        facts: ["Kesavananda Bharati case (1973) established the Basic Structure doctrine", "Maneka Gandhi case (1978) expanded the scope of Article 21"]
      }
    };
    
    setDetails(detailsMap[item] || {
      title: item,
      content: "Detailed information about this topic will be available soon.",
      facts: ["This is a part of the Indian Constitution", "Explore more to learn about this topic"]
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Constitution Spiral Explorer</h2>
        <div className="text-sm text-gray-400">
          Explored: {Math.round(progress)}%
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Spiral visualization */}
        <div className="w-full md:w-7/12">
          <div className="bg-dark-200 rounded-lg p-4 h-full flex flex-col">
            <div className="flex-grow relative overflow-hidden">
              {/* Center */}
              <motion.div 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-center text-sm p-2">
                  {gameData.centerTitle}
                </div>
              </motion.div>
              
              {/* Levels */}
              {gameData.levels.map((level, index) => (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                >
                  <div
                    className={`relative w-full h-full rounded-full border-2 ${
                      selectedLevel === index ? 'border-primary-500' : 'border-gray-700'
                    }`}
                    style={{
                      width: `${(index + 1) * 120}px`,
                      height: `${(index + 1) * 120}px`,
                    }}
                    onClick={() => handleLevelSelect(level, index)}
                  >
                    {/* Level title */}
                    <div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-200 px-2"
                      style={{ color: level.color }}
                    >
                      {level.title}
                    </div>
                    
                    {/* Items around this level */}
                    {level.items.map((item, itemIndex) => {
                      const angle = (itemIndex * (360 / level.items.length)) * (Math.PI / 180);
                      const radius = ((index + 1) * 120) / 2;
                      
                      const isExplored = exploredItems.includes(`${index}-${item}`);
                      
                      return (
                        <motion.div
                          key={item}
                          className={`absolute w-20 rounded-lg p-2 text-center text-xs font-medium cursor-pointer transition transform hover:scale-110 ${
                            selectedItem === item 
                              ? 'bg-primary-600 text-white' 
                              : isExplored
                                ? 'bg-opacity-70 text-white'
                                : 'bg-dark-300 text-gray-400'
                          }`}
                          style={{
                            left: `calc(50% + ${Math.cos(angle) * radius}px - 2.5rem)`,
                            top: `calc(50% + ${Math.sin(angle) * radius}px - 1.5rem)`,
                            backgroundColor: selectedItem === item ? level.color : isExplored ? `${level.color}90` : '',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemSelect(item, index);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-3 text-center text-gray-400 text-sm">
              Click on a level ring to highlight it, then click on items to explore details
            </div>
          </div>
        </div>
        
        {/* Details panel */}
        <div className="w-full md:w-5/12">
          <div className="bg-dark-200 rounded-lg p-4 h-full">
            {details ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <h3 className="text-lg font-bold text-white mb-3">{details.title}</h3>
                <p className="text-gray-300 mb-4">{details.content}</p>
                
                <div className="bg-dark-300 rounded-lg p-3 mt-auto">
                  <h4 className="text-white text-sm font-semibold mb-2">Quick Facts</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    {details.facts.map((fact, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block mr-2 mt-0.5 text-primary-500">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
                    onClick={() => {
                      setSelectedItem(null);
                      setDetails(null);
                    }}
                  >
                    Explore More
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Select a topic to explore</h3>
                <p className="text-gray-400 max-w-xs">Click on any item in the spiral to view detailed information about that constitutional topic</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="bg-dark-200 h-3 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ConstitutionSpiralGame; 