import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ConstitutionMap = ({ country = 'India' }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('level0');
  const [expandedView, setExpandedView] = useState(false);

  // Constitution structure based on levels
  const constitutionStructure = {
    India: {
      level0: [
        { id: 'l0-1', title: 'Preamble', color: '#3498db', linkId: 'l0-1' },
        { id: 'l0-2', title: 'History', color: '#2ecc71', linkId: 'l0-2' },
        { id: 'l0-3', title: 'Features', color: '#9b59b6', linkId: 'l0-3' }
      ],
      level1: [
        { id: 'l1-1', title: 'Part I: Union and Territory', color: '#e74c3c', linkId: 'l1-1' },
        { id: 'l1-2', title: 'Part II: Citizenship', color: '#f39c12', linkId: 'l1-2' },
        { id: 'l1-3', title: 'Part III: Fundamental Rights', color: '#1abc9c', linkId: 'l1-2' },
        { id: 'l1-4', title: 'Part IV: Directive Principles', color: '#3498db', linkId: 'l1-3' },
        { id: 'l1-5', title: 'Part IV-A: Fundamental Duties', color: '#2ecc71', linkId: 'l1-4' },
        { id: 'l1-6', title: 'Part V: Union Government', color: '#9b59b6', linkId: 'l1-5' },
        { id: 'l1-7', title: 'Part VI: State Government', color: '#e67e22', linkId: 'l1-6' }
      ],
      level2: [
        { id: 'l2-1', title: 'Schedule 1: States and UTs', color: '#3498db', linkId: 'l2-1' },
        { id: 'l2-2', title: 'Schedule 7: Division of Powers', color: '#2ecc71', linkId: 'l2-2' },
        { id: 'l2-3', title: 'Schedule 8: Official Languages', color: '#9b59b6', linkId: 'l2-3' },
        { id: 'l2-4', title: 'Schedule 9 & 10: Special Acts', color: '#e74c3c', linkId: 'l2-4' }
      ],
      level3: [
        { id: 'l3-1', title: '1st Amendment (1951)', color: '#3498db', linkId: 'l3-1' },
        { id: 'l3-2', title: '42nd Amendment (1976)', color: '#e74c3c', linkId: 'l3-2' },
        { id: 'l3-3', title: '73rd & 74th Amendments', color: '#2ecc71', linkId: 'l3-3' },
        { id: 'l3-4', title: '101st Amendment (GST)', color: '#f39c12', linkId: 'l3-4' }
      ],
      level4: [
        { id: 'l4-1', title: 'Basic Structure Doctrine', color: '#9b59b6', linkId: 'l4-1' },
        { id: 'l4-2', title: 'Judicial Review', color: '#e74c3c', linkId: 'l4-2' },
        { id: 'l4-3', title: 'Constitutional Interpretation', color: '#3498db', linkId: 'l4-3' }
      ]
    }
  };

  // Get sections for current level and country
  const getCurrentSections = () => {
    return constitutionStructure[country]?.[selectedLevel] || [];
  };

  // Get total sections count for current country
  const getTotalSectionsCount = () => {
    let count = 0;
    Object.keys(constitutionStructure[country] || {}).forEach(level => {
      count += constitutionStructure[country][level].length;
    });
    return count;
  };

  // Level definitions
  const levels = [
    { id: 'level0', title: 'Introduction', icon: '📚' },
    { id: 'level1', title: 'Basic Structure', icon: '🏛️' },
    { id: 'level2', title: 'Schedules', icon: '📜' },
    { id: 'level3', title: 'Amendments', icon: '✏️' },
    { id: 'level4', title: 'Advanced', icon: '🔍' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const sectionVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  // Mode toggle
  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
  };

  // Get positions for interactive map in expanded view
  const getSectionPosition = (index, total) => {
    if (!expandedView) return {};
    
    const radius = Math.min(window.innerWidth, 800) * 0.35; // Responsive radius
    const angle = (index / total) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      position: 'absolute',
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      transform: 'translate(-50%, -50%)',
      zIndex: 2
    };
  };

  return (
    <div className="relative py-8">
      {/* Mode Switch */}
      <div className="absolute top-0 right-0 m-4">
        <button 
          onClick={toggleExpandedView}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          {expandedView ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2H5v-2h10zm0-4v2H5V9h10z" clipRule="evenodd" />
              </svg>
              List View
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
              </svg>
              Interactive Map
            </>
          )}
        </button>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {country} Constitution Map
        </h1>
        
        {/* Level Navigation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {levels.map((level) => (
            <motion.button
              key={level.id}
              variants={itemVariants}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                selectedLevel === level.id
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
              }`}
            >
              <span className="text-xl">{level.icon}</span>
              <span>{level.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Constitution Sections */}
        {expandedView ? (
          // Interactive Map View with Radial Layout
          <div className="relative flex justify-center items-center" style={{ height: '600px' }}>
            {/* Center Element */}
            <motion.div 
              className="absolute z-10 bg-primary-600 rounded-full w-24 h-24 flex items-center justify-center text-white font-bold text-lg shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              {country}
            </motion.div>
            
            {/* Connecting Lines */}
            <svg className="absolute w-full h-full" style={{ zIndex: 1 }}>
              {getCurrentSections().map((section, index) => (
                <motion.line 
                  key={`line-${section.id}`}
                  x1="50%" 
                  y1="50%" 
                  x2={`calc(50% + ${Math.cos((index / getCurrentSections().length) * Math.PI * 2) * (Math.min(window.innerWidth, 800) * 0.35)}px)`}
                  y2={`calc(50% + ${Math.sin((index / getCurrentSections().length) * Math.PI * 2) * (Math.min(window.innerWidth, 800) * 0.35)}px)`}
                  stroke={section.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredSection === section.id || !hoveredSection ? 0.6 : 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </svg>
            
            {/* Section Nodes */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full h-full"
            >
              {getCurrentSections().map((section, index) => (
                <motion.div
                  key={section.id}
                  style={getSectionPosition(index, getCurrentSections().length)}
                  variants={sectionVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredSection(section.id)}
                  onHoverEnd={() => setHoveredSection(null)}
                >
                  <Link to={`/topics/detail/${section.linkId}`}>
                    <motion.div 
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
                      style={{ backgroundColor: section.color }}
                    >
                      <div className="absolute whitespace-nowrap px-3 py-1 bg-dark-100 text-white rounded-lg text-sm font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {section.title}
                      </div>
                      <span className="text-white font-medium text-center text-xs md:text-sm">
                        {section.title.split(':')[0]}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          // List View with cards
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {getCurrentSections().map((section) => (
              <motion.div
                key={section.id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Link to={`/topics/detail/${section.linkId}`} className="block h-full">
                  <div className="bg-dark-200 rounded-lg overflow-hidden h-full group hover:bg-dark-100 transition-colors">
                    <div className="h-2" style={{ backgroundColor: section.color }}></div>
                    <div className="p-6">
                      <h3 className="text-white text-lg font-medium mb-2">{section.title}</h3>
                      <div className="flex justify-end mt-4">
                        <div className="flex items-center text-primary-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Explore
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Level Information */}
        <motion.div 
          className="mt-12 bg-dark-200 p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-2">
            {levels.find(l => l.id === selectedLevel)?.title} Level
          </h2>
          <p className="text-gray-400">
            {selectedLevel === 'level0' && "The foundational aspects of the Constitution, including its history, key features, and the Preamble."}
            {selectedLevel === 'level1' && "The core structure of the Constitution, divided into Parts that cover fundamental rights, directive principles, and governmental organization."}
            {selectedLevel === 'level2' && "The supporting Schedules of the Constitution that provide detailed information on various administrative and legal matters."}
            {selectedLevel === 'level3' && "Key amendments that have shaped and evolved the Constitution over time."}
            {selectedLevel === 'level4' && "Advanced constitutional concepts, doctrines, and interpretations developed by the judiciary."}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ConstitutionMap; 