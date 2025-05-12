import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const TopicDetail = () => {
  const { topicId } = useParams();
  const { authAxios } = useContext(AuthContext);
  const [topic, setTopic] = useState(null);
  const [content, setContent] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use the correct API endpoint for topic details
        const topicResponse = await authAxios.get(`/content/topics/detail/${topicId}`);
        setTopic(topicResponse.data);
        
        // Fetch content for this topic
        const contentResponse = await authAxios.get(`/content/topics/${topicId}/content`);
        setContent(contentResponse.data);
        
        // Fetch user progress for this topic
        const progressResponse = await authAxios.get(`/progress/${topicId}`);
        setProgress(progressResponse.data);
      } catch (err) {
        console.error('Error fetching topic data:', err);
        setError('Failed to load topic information');
      } finally {
        setLoading(false);
      }
    };
    
    if (topicId) {
      fetchData();
    }
  }, [topicId, authAxios]);

  // Helper function to get icon for content type
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'lesson':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'quiz':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'game':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'article':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Helper function to check if content is completed
  const isContentCompleted = (contentId) => {
    if (!progress) return false;
    
    // Check if it's in quiz scores
    const quizCompleted = progress.quizScores.some(q => q.quizId === contentId);
    if (quizCompleted) return true;
    
    // Check if it's in activities
    const activityCompleted = progress.activities.some(a => a.activityId === contentId && a.completed);
    
    return activityCompleted;
  };

  // Helper to get readable content type
  const getContentTypeLabel = (type) => {
    const labels = {
      'lesson': 'Lesson',
      'quiz': 'Quiz',
      'game': 'Interactive Game',
      'article': 'Article',
      'video': 'Video'
    };
    
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error || "Could not find the topic"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Topic header */}
      <div 
        className="relative rounded-xl px-6 py-8 overflow-hidden"
        style={{ 
          backgroundColor: topic.color || '#3498db',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)'
        }}
      >
        <div className="absolute right-4 top-4 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {topic.title}
          </motion.h1>
          
          <motion.p 
            className="text-white/90 text-lg max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {topic.description}
          </motion.p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/20 text-white">
              {topic.category}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/20 text-white">
              {topic.difficulty}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/20 text-white">
              {topic.country}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {progress && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Your Progress</h3>
            <span className="text-lg font-semibold text-primary-500">{progress.completionPercentage}%</span>
          </div>
          <div className="w-full bg-dark-200 rounded-full h-4">
            <motion.div 
              className="h-4 rounded-full bg-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress.completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
      
      {/* Content list */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Learning Content</h2>
        
        {content.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No content available for this topic yet.</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-2"
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
            {content.map((item) => (
              <motion.div 
                key={item._id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Link 
                  to={`/content/${item._id}`}
                  className="flex items-center p-4 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-600/20 flex items-center justify-center mr-4">
                    <span className="text-primary-500">
                      {getContentTypeIcon(item.type)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate">{item.title}</h3>
                    <p className="text-sm text-gray-400">
                      {getContentTypeLabel(item.type)} • {item.estimatedTime} min
                    </p>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 flex items-center">
                    {isContentCompleted(item._id) ? (
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail; 