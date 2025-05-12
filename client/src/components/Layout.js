import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

// Icons (you can replace with actual icons)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TopicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ConstitutionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;

const Layout = () => {
  const { user, logout, authAxios } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ topics: [], content: [] });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { path: '/topics', label: 'Topics', icon: <TopicsIcon /> },
    { path: '/constitution', label: 'Constitution', icon: <ConstitutionIcon /> },
    { path: '/constitution/games', label: 'Learning Games', icon: <GameIcon /> },
    { path: '/constitution/map', label: 'Constitution Map', icon: <MapIcon /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon /> }
  ];
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length === 0) {
      setShowResults(false);
    }
  };
  
  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    setShowResults(true);
    
    try {
      const response = await authAxios.get(`/content/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle clicking a search result
  const handleResultClick = (result) => {
    setShowResults(false);
    if (result.type) {
      // This is a content result
      navigate(`/content/${result._id}`);
    } else {
      // This is a topic result
      navigate(`/topics/${result._id}`);
    }
  };
  
  // Close search results when clicking outside
  const handleClickOutside = () => {
    setShowResults(false);
  };

  return (
    <div className="flex min-h-screen bg-dark-400">
      {/* Sidebar for desktop */}
      <motion.aside 
        className="hidden md:flex flex-col w-64 bg-dark-300 border-r border-dark-200"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center h-16 p-4 border-b border-dark-200">
          <Link to="/" className="text-2xl font-bold text-primary-500">
            Constitutional
          </Link>
        </div>
        
        <div className="flex flex-col flex-grow pt-5">
          <nav className="flex-1 px-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  location.pathname === link.path 
                    ? 'bg-primary-700/20 text-primary-400' 
                    : 'text-gray-300 hover:bg-dark-200 hover:text-white'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-dark-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-dark-200 hover:text-white"
          >
            <span className="mr-3"><LogoutIcon /></span>
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Mobile menu */}
      <motion.div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className={`fixed inset-y-0 left-0 w-64 bg-dark-300 z-30 md:hidden transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: -300 }}
        animate={{ x: isMobileMenuOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-16 p-4 border-b border-dark-200">
          <Link to="/" className="text-xl font-bold text-primary-500">
            Constitutional
          </Link>
        </div>
        
        <div className="flex flex-col flex-grow pt-5">
          <nav className="flex-1 px-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  location.pathname === link.path 
                    ? 'bg-primary-700/20 text-primary-400' 
                    : 'text-gray-300 hover:bg-dark-200 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-dark-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-dark-200 hover:text-white"
          >
            <span className="mr-3"><LogoutIcon /></span>
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-dark-300 border-b border-dark-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 rounded-md hover:text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4 relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search constitutional topics..."
                    className="input w-full pl-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchResults.topics.length > 0 || searchResults.content.length > 0) {
                        setShowResults(true);
                      }
                    }}
                  />
                  <button type="submit" className="hidden">Search</button>
                </div>
              </form>
              
              {/* Search results dropdown */}
              {showResults && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1 bg-dark-200 rounded-lg shadow-lg z-50 border border-dark-100 overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin h-5 w-5 border-t-2 border-primary-500 rounded-full mx-auto"></div>
                      <p className="text-gray-400 text-sm mt-2">Searching...</p>
                    </div>
                  ) : (
                    <>
                      {searchResults.topics.length === 0 && searchResults.content.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          No results found for "{searchQuery}"
                        </div>
                      ) : (
                        <div>
                          {searchResults.topics.length > 0 && (
                            <div>
                              <div className="px-4 py-2 bg-dark-300 text-xs font-medium text-gray-400 uppercase">
                                Topics
                              </div>
                              <div className="divide-y divide-dark-300">
                                {searchResults.topics.map(topic => (
                                  <div 
                                    key={topic._id} 
                                    className="px-4 py-3 hover:bg-dark-300 cursor-pointer"
                                    onClick={() => handleResultClick(topic)}
                                  >
                                    <div className="font-medium text-white">{topic.title}</div>
                                    <div className="text-sm text-gray-400 mt-1 truncate">{topic.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {searchResults.content.length > 0 && (
                            <div>
                              <div className="px-4 py-2 bg-dark-300 text-xs font-medium text-gray-400 uppercase">
                                Content
                              </div>
                              <div className="divide-y divide-dark-300">
                                {searchResults.content.map(content => (
                                  <div 
                                    key={content._id} 
                                    className="px-4 py-3 hover:bg-dark-300 cursor-pointer"
                                    onClick={() => handleResultClick(content)}
                                  >
                                    <div className="font-medium text-white">{content.title}</div>
                                    <div className="text-sm text-gray-400 mt-1">
                                      <span className="bg-primary-900/30 text-primary-400 text-xs px-2 py-1 rounded-full uppercase">
                                        {content.type}
                                      </span>
                                      <span className="ml-2">in {content.topic.title}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* User info */}
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium text-gray-300">{user?.name || user?.username}</span>
                  <Link to="/profile">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          onClick={handleClickOutside}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 