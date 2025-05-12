import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import ConstitutionalTopicCard from '../components/ConstitutionalTopicCard';
import { Link } from 'react-router-dom';

const ConstitutionalTopics = () => {
  const { authAxios } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('level0');
  const [filters, setFilters] = useState({
    country: 'India', // Default to India
    category: '',
    difficulty: ''
  });

  // Define the level structure
  const levels = [
    {
      id: 'level0',
      name: 'Level 0: Introduction',
      description: 'Get started with the basics of Indian Constitution'
    },
    {
      id: 'level1',
      name: 'Level 1: Basic Structure',
      description: 'Explore the 25 parts of the Indian Constitution'
    },
    {
      id: 'level2',
      name: 'Level 2: Schedules',
      description: 'Learn about the 12 schedules of the Constitution'
    },
    {
      id: 'level3',
      name: 'Level 3: Amendments',
      description: 'Study significant amendments to the Constitution'
    },
    {
      id: 'level4',
      name: 'Level 4: Advanced',
      description: 'Dive into advanced constitutional concepts and doctrines'
    }
  ];

  // Mock topics for now - in real application, this would be fetched from API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        
        // In real application:
        // const response = await authAxios.get('/content/topics', { params: filters });
        // setTopics(response.data);
        
        // Level 0: Introduction topics
        const level0Topics = [
          {
            _id: 'l0-1',
            title: 'Preamble',
            description: 'Introduction to the Constitution, its purpose, and ideals including sovereignty, socialism, secularism, democracy, justice, liberty, equality, and fraternity.',
            category: 'Introduction',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 3,
            level: 'level0'
          },
          {
            _id: 'l0-2',
            title: 'History of Constitution',
            description: 'Timeline of formation, Constituent Assembly, and the drafting process of the Indian Constitution.',
            category: 'Introduction',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 4,
            level: 'level0'
          },
          {
            _id: 'l0-3',
            title: 'Features of Constitution',
            description: 'Federalism, Parliamentary System, Secularism, and other unique features of the Indian Constitution.',
            category: 'Introduction',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 5,
            level: 'level0'
          }
        ];
        
        // Level 1: Basic Structure topics (selected parts)
        const level1Topics = [
          {
            _id: 'l1-1',
            title: 'Part I: Union and its Territory',
            description: 'Articles 1-4: Name and territory of the Union, admission of new states, formation of new states, and alteration of boundaries.',
            category: 'Basic Structure',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 2,
            level: 'level1'
          },
          {
            _id: 'l1-2',
            title: 'Part III: Fundamental Rights',
            description: 'Articles 12-35: Six fundamental rights including Right to Equality, Right to Freedom, Right against Exploitation, and more.',
            category: 'Basic Structure',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 6,
            level: 'level1'
          },
          {
            _id: 'l1-3',
            title: 'Part IV: Directive Principles',
            description: 'Articles 36-51: Guidelines provided to the government to ensure social and economic democracy through welfare approach.',
            category: 'Basic Structure',
            difficulty: 'Intermediate',
            country: 'India',
            contentCount: 4,
            level: 'level1'
          },
          {
            _id: 'l1-4',
            title: 'Part IV-A: Fundamental Duties',
            description: 'Article 51A: List of duties that citizens are expected to abide by.',
            category: 'Basic Structure',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 1,
            level: 'level1'
          },
          {
            _id: 'l1-5',
            title: 'Part V: Union Government',
            description: 'Articles 52-151: Structure and functioning of the President, Vice-President, Prime Minister, and Parliament.',
            category: 'Basic Structure',
            difficulty: 'Intermediate',
            country: 'India',
            contentCount: 5,
            level: 'level1'
          },
          {
            _id: 'l1-6',
            title: 'Part XVIII: Emergency Provisions',
            description: 'Articles 352-360: Three types of emergencies - National, State, and Financial, and their implications.',
            category: 'Basic Structure',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 3,
            level: 'level1'
          }
        ];
        
        // Level 2: Schedules topics
        const level2Topics = [
          {
            _id: 'l2-1',
            title: 'Schedule 1: States and UTs',
            description: 'List of states and union territories in India with their territories.',
            category: 'Schedules',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 1,
            level: 'level2'
          },
          {
            _id: 'l2-2',
            title: 'Schedule 7: Division of Powers',
            description: 'Union List, State List, and Concurrent List defining the division of powers between the Centre and States.',
            category: 'Schedules',
            difficulty: 'Intermediate',
            country: 'India',
            contentCount: 3,
            level: 'level2'
          },
          {
            _id: 'l2-3',
            title: 'Schedule 8: Official Languages',
            description: 'The 22 official languages recognized by the Constitution of India.',
            category: 'Schedules',
            difficulty: 'Beginner',
            country: 'India',
            contentCount: 1,
            level: 'level2'
          },
          {
            _id: 'l2-4',
            title: 'Schedule 9 & 10: Special Acts & Anti-Defection',
            description: 'Schedule 9 protects certain laws from judicial review, while Schedule 10 contains anti-defection provisions.',
            category: 'Schedules',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 2,
            level: 'level2'
          }
        ];
        
        // Level 3: Amendments topics
        const level3Topics = [
          {
            _id: 'l3-1',
            title: '1st Amendment (1951)',
            description: 'Added Ninth Schedule to protect land reform laws from judicial review.',
            category: 'Amendments',
            difficulty: 'Intermediate',
            country: 'India',
            contentCount: 1,
            level: 'level3'
          },
          {
            _id: 'l3-2',
            title: '42nd Amendment (1976)',
            description: 'The "Mini-Constitution" that made significant changes during the Emergency period.',
            category: 'Amendments',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 3,
            level: 'level3'
          },
          {
            _id: 'l3-3',
            title: '73rd & 74th Amendments',
            description: 'Constitutional status to Panchayati Raj Institutions and Municipalities.',
            category: 'Amendments',
            difficulty: 'Intermediate',
            country: 'India',
            contentCount: 2,
            level: 'level3'
          },
          {
            _id: 'l3-4',
            title: '101st Amendment (GST)',
            description: 'Introduction of Goods and Services Tax (GST) in India.',
            category: 'Amendments',
            difficulty: 'Intermediate',
            country: 'India',
            contentCount: 1,
            level: 'level3'
          }
        ];
        
        // Level 4: Advanced topics
        const level4Topics = [
          {
            _id: 'l4-1',
            title: 'Doctrine of Basic Structure',
            description: 'Explore the judicial doctrine that sets limits on Parliament\'s power to amend the Constitution.',
            category: 'Advanced',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 2,
            level: 'level4'
          },
          {
            _id: 'l4-2',
            title: 'Judicial Review',
            description: 'Study the power of the Supreme Court and High Courts to review the constitutionality of laws.',
            category: 'Advanced',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 2,
            level: 'level4'
          },
          {
            _id: 'l4-3',
            title: 'Landmark Judgments',
            description: 'Analyze landmark Supreme Court judgments that have shaped constitutional interpretation.',
            category: 'Advanced',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 5,
            level: 'level4'
          },
          {
            _id: 'l4-4',
            title: 'Constitution in Modern India',
            description: 'Evaluate the role and relevance of the Constitution in contemporary Indian society.',
            category: 'Advanced',
            difficulty: 'Advanced',
            country: 'India',
            contentCount: 3,
            level: 'level4'
          }
        ];
        
        // Combine all topics
        const allTopics = [
          ...level0Topics,
          ...level1Topics,
          ...level2Topics,
          ...level3Topics,
          ...level4Topics
        ];
        
        // Filter topics based on current filters and selected level
        const filteredTopics = allTopics.filter(topic => {
          return (
            (filters.country === '' || topic.country === filters.country) &&
            (filters.category === '' || topic.category === filters.category) &&
            (filters.difficulty === '' || topic.difficulty === filters.difficulty) &&
            topic.level === selectedLevel
          );
        });
        
        setTopics(filteredTopics);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load constitutional topics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, [authAxios, filters, selectedLevel]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Handle level selection
  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
  };

  // Get unique values for filter options
  const getUniqueFilterValues = (key) => {
    return [...new Set(topics.map(topic => topic[key]))].filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Indian Constitution</h1>
          <p className="text-gray-400 mt-1">Explore the structure and principles of the Indian Constitution</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Link 
            to="/constitution/games" 
            className="px-4 py-2 flex items-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play Games
          </Link>
          
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input bg-dark-200 text-white py-2 pl-3 pr-8"
          >
            <option value="">All Categories</option>
            {getUniqueFilterValues('category').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="input bg-dark-200 text-white py-2 pl-3 pr-8"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
      
      {/* Level selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => handleLevelChange(level.id)}
            className={`p-3 rounded-lg text-left transition ${
              selectedLevel === level.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
            }`}
          >
            <h3 className="font-medium">{level.name}</h3>
            <p className="text-xs mt-1 opacity-80">{level.description}</p>
          </button>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {topics.length === 0 ? (
            <div className="card py-12">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No topics found</h3>
                <p className="text-gray-400">Try changing your filters or check back later for new content.</p>
              </div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {topics.map(topic => (
                <motion.div 
                  key={topic._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ConstitutionalTopicCard topic={topic} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
      
    </div>
  );
};

export default ConstitutionalTopics; 