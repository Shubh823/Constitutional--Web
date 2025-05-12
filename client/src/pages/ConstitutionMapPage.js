import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConstitutionMap from '../components/ConstitutionMap';

const ConstitutionMapPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('India');
  
  // Available countries (can be expanded in the future)
  const countries = [
    { id: 'India', name: 'India', flag: '🇮🇳' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Constitution Map</h1>
        <p className="text-gray-400 mb-8">
          Explore the structure and organization of constitutional documents with an interactive map
        </p>
      </motion.div>
      
      {/* Country Selector */}
      <div className="mb-10 flex flex-wrap gap-3">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => setSelectedCountry(country.id)}
            className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              selectedCountry === country.id
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
            }`}
          >
            <span className="text-xl">{country.flag}</span>
            <span>{country.name}</span>
          </button>
        ))}
      </div>
      
      {/* Main Constitution Map */}
      <motion.div
        key={selectedCountry}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <ConstitutionMap country={selectedCountry} />
      </motion.div>
      
      {/* Information Section */}
      <motion.div 
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, staggerChildren: 0.1 }}
      >
        <motion.div 
          className="bg-dark-200 p-6 rounded-lg"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Interactive Learning</h3>
          </div>
          <p className="text-gray-400">
            Explore constitutional concepts through interactive visualizations and maps that make complex topics easier to understand.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-dark-200 p-6 rounded-lg"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-500 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Structured Content</h3>
          </div>
          <p className="text-gray-400">
            Navigate through organized levels of constitutional knowledge, from introductory concepts to advanced legal doctrines.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-dark-200 p-6 rounded-lg"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-500 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Visual Connections</h3>
          </div>
          <p className="text-gray-400">
            See how different parts of the constitution connect and relate to each other through our intuitive visualization system.
          </p>
        </motion.div>
      </motion.div>
      
      {/* How to Use Section */}
      <motion.div 
        className="mt-10 bg-gradient-to-r from-primary-800/30 to-primary-600/30 p-6 rounded-lg border border-primary-600/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">How to Use the Constitution Map</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-white font-medium mb-2">Select a Level</h3>
            <p className="text-gray-400 text-sm">Choose a level of constitutional content based on your learning needs</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-white font-medium mb-2">Switch Views</h3>
            <p className="text-gray-400 text-sm">Toggle between List View and Interactive Map to explore content differently</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-white font-medium mb-2">Explore Topics</h3>
            <p className="text-gray-400 text-sm">Click on any topic to view detailed information and learning resources</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-white font-bold">4</span>
            </div>
            <h3 className="text-white font-medium mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">As you explore topics, your learning progress will be tracked automatically</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConstitutionMapPage; 