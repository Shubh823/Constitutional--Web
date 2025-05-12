import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-400 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-extrabold text-primary-500">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="mt-4 text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link 
            to="/" 
            className="btn btn-primary inline-flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <motion.div
          className="mt-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 10, -5, 5, -2, 2, 0] }}
          transition={{ 
            scale: { delay: 0.3, duration: 0.5 },
            rotate: { delay: 0.8, duration: 1.5 }
          }}
        >
          <div className="inline-block text-8xl">📚</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound; 