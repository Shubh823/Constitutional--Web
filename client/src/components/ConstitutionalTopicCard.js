import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ConstitutionalTopicCard = ({ topic }) => {
  // Generate a background color based on the topic category
  const getBackgroundColor = () => {
    const colors = {
      'Fundamental Rights': '#3498db',
      'Directive Principles': '#9b59b6',
      'Federal Structure': '#2ecc71',
      'Constitutional Bodies': '#e74c3c',
      'Amendments': '#f39c12',
      'Emergency Provisions': '#c0392b',
      'Historical': '#16a085',
      'Judiciary': '#8e44ad',
      'default': '#3498db'
    };
    
    return colors[topic.category] || colors.default;
  };

  return (
    <motion.div 
      className="h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link 
        to={`/topics/${topic._id}`} 
        className="block h-full"
      >
        <div 
          className="card h-full flex flex-col overflow-hidden"
          style={{ 
            borderTop: `4px solid ${getBackgroundColor()}`,
          }}
        >
          <div className="p-5 flex-grow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
              {topic.difficulty && (
                <span className={`text-xs px-2 py-1 rounded ${
                  topic.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                  topic.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {topic.difficulty}
                </span>
              )}
            </div>
            
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {topic.description}
            </p>
            
            <div className="mt-auto pt-3">
              <div className="flex flex-wrap gap-2">
                {topic.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-200 text-gray-300">
                    {topic.category}
                  </span>
                )}
                {topic.country && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-200 text-gray-300">
                    {topic.country}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-5 py-3 border-t border-dark-200 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {topic.contentCount || 0} lessons
            </div>
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ConstitutionalTopicCard; 