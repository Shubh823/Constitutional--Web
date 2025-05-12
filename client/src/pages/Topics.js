import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

// Animations
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

const Topics = () => {
  const { user, authAxios } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(user?.preferredCountry || 'India');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get all available countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await authAxios.get('/content/countries');
        if (response.data.length > 0) {
          setCountries(response.data);
          if (!response.data.includes(selectedCountry)) {
            setSelectedCountry(response.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries');
      }
    };
    
    fetchCountries();
  }, [authAxios, selectedCountry]);
  
  // Get topics for the selected country
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await authAxios.get(`/content/topics/${selectedCountry}`);
        setTopics(response.data);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedCountry) {
      fetchTopics();
    }
  }, [authAxios, selectedCountry]);
  
  // Get category label function
  const getCategoryLabel = (categoryId) => {
    const categories = {
      'fundamental-rights': 'Fundamental Rights',
      'directive-principles': 'Directive Principles',
      'judiciary': 'Judiciary',
      'legislature': 'Legislature',
      'executive': 'Executive',
      'amendments': 'Amendments',
      'other': 'Other Topics'
    };
    
    return categories[categoryId] || categoryId;
  };
  
  // Get topic card background based on color
  const getTopicCardStyle = (color) => {
    return {
      backgroundColor: color || '#3498db',
      backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)'
    };
  };
  
  // Filter topics by category
  const topicsByCategory = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {});
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Constitutional Topics</h1>
        
        {countries.length > 0 && (
          <div className="flex items-center space-x-2">
            <label htmlFor="country" className="text-sm text-gray-400">
              Country:
            </label>
            <select 
              id="country"
              className="input bg-dark-200 text-sm"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {Object.keys(topicsByCategory).length === 0 && !loading && !error && (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-300 mb-2">No topics available yet</h3>
          <p className="text-gray-400">
            Topics for {selectedCountry}'s constitution will be added soon.
          </p>
        </div>
      )}
      
      {Object.keys(topicsByCategory).map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {getCategoryLabel(category)}
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topicsByCategory[category].map((topic) => (
              <motion.div
                key={topic._id}
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Link 
                  to={`/topics/${topic._id}`} 
                  className="block h-full"
                >
                  <div 
                    className="rounded-xl p-6 h-full shadow-lg text-white relative overflow-hidden"
                    style={getTopicCardStyle(topic.color)}
                  >
                    {/* Icon */}
                    <div className="absolute right-4 top-4 opacity-20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-xl mb-2">{topic.title}</h3>
                      <p className="text-white/80 line-clamp-3">{topic.description}</p>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
                          {topic.difficulty}
                        </span>
                        <span className="text-sm">Explore →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Topics; 