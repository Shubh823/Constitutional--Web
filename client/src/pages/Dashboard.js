import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

// Components
const ProgressCard = ({ title, value, maxValue, color = 'primary' }) => {
  const percentage = Math.min(100, Math.round((value / maxValue) * 100)) || 0;
  
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
      <div className="w-full bg-dark-200 rounded-full h-4 mb-2">
        <motion.div 
          className={`h-4 rounded-full bg-${color}-600`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="text-sm text-gray-400">
        {value} of {maxValue} ({percentage}%)
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <motion.div 
      className="card flex items-center"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex-shrink-0 h-12 w-12 rounded-lg bg-${color}-600/20 flex items-center justify-center mr-4`}>
        <span className={`text-${color}-500`}>{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <h3 className="text-xl font-semibold text-white">{value}</h3>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user, authAxios } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await authAxios.get('/users/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [authAxios]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select 
            className="input bg-dark-200 text-sm"
            defaultValue={user?.preferredCountry || 'India'}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>
      </div>
      
      {dashboardData && (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Overall Progress" 
              value={`${dashboardData.stats.overallProgress}%`} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              } 
            />
            
            <StatCard 
              title="Topics Completed" 
              value={`${dashboardData.stats.completedTopics}/${dashboardData.stats.totalTopics}`} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } 
              color="secondary"
            />
            
            <StatCard 
              title="Average Quiz Score" 
              value={`${dashboardData.stats.averageQuizScore}%`} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              } 
              color="green"
            />
            
            <StatCard 
              title="Badges Earned" 
              value={dashboardData.stats.totalBadges} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              } 
              color="yellow"
            />
          </div>
          
          {/* Recent activity and progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topic progress */}
            <div className="lg:col-span-2 card space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">Topic Progress</h2>
                <Link to="/topics" className="text-sm text-primary-500 hover:text-primary-400">
                  View all topics
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.progress.slice(0, 3).map((item) => (
                  <motion.div 
                    key={item.topicId}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/topics/${item.topicId}`}>
                      <ProgressCard 
                        title={item.topicTitle} 
                        value={item.completionPercentage} 
                        maxValue={100} 
                      />
                    </Link>
                  </motion.div>
                ))}
                
                {dashboardData.progress.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No topics started yet. Explore topics to begin learning!</p>
                    <Link to="/topics" className="btn btn-primary mt-4">
                      Explore Topics
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent activities */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-3 border-b border-dark-200">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {activity.completed 
                          ? `Completed an activity in ${activity.topicTitle}` 
                          : `Started an activity in ${activity.topicTitle}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.date).toLocaleDateString()}
                        {activity.score > 0 && ` • Score: ${activity.score}%`}
                      </p>
                    </div>
                  </div>
                ))}
                
                {dashboardData.recentActivities.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Continue learning section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <Link to="/topics" className="text-sm text-primary-500 hover:text-primary-400">
                View all topics
              </Link>
            </div>
            
            {dashboardData.progress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.progress
                  .filter(item => item.completionPercentage > 0 && item.completionPercentage < 100)
                  .slice(0, 3)
                  .map((item) => (
                    <motion.div 
                      key={item.topicId}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-dark-200 p-4 rounded-lg"
                    >
                      <Link to={`/topics/${item.topicId}`}>
                        <h3 className="font-medium text-gray-100 mb-2">{item.topicTitle}</h3>
                        <div className="w-full bg-dark-300 rounded-full h-2 mb-2">
                          <div 
                            className="h-2 rounded-full bg-primary-600"
                            style={{ width: `${item.completionPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{item.completionPercentage}% complete</span>
                          <span>Continue</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Start exploring topics to begin your learning journey!</p>
                <Link to="/topics" className="btn btn-primary mt-4">
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 