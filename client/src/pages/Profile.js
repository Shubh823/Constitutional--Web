import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, logout, error, setError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    preferredCountry: user?.preferredCountry || 'India',
    profilePicture: user?.profilePicture || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Clear global error and success message
    setError(null);
    setUpdateSuccess(false);
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    // Clear error for this field when user types
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: '' });
    }
    
    // Clear global error and success message
    setError(null);
    setPasswordSuccess(false);
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      try {
        await updateProfile(formData);
        setIsEditing(false);
        setUpdateSuccess(true);
      } catch (err) {
        // Error is already set in the context
        console.error('Profile update error:', err);
      }
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        // Here you would call your API to change the password
        // For now we'll just mock it
        console.log('Password changed successfully');
        setIsChangingPassword(false);
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (err) {
        console.error('Password change error:', err);
      }
    }
  };

  // Helper to get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
      
      {error && (
        <motion.div 
          className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative" 
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}
      
      {updateSuccess && (
        <motion.div 
          className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded relative" 
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="block sm:inline">Profile updated successfully!</span>
        </motion.div>
      )}
      
      {passwordSuccess && (
        <motion.div 
          className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded relative" 
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="block sm:inline">Password changed successfully!</span>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - User info */}
        <div className="md:col-span-1">
          <div className="card flex flex-col items-center py-8">
            <div className="h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-medium mb-4">
              {getUserInitials()}
            </div>
            
            <h2 className="text-xl font-bold text-white">{user?.name || user?.username}</h2>
            <p className="text-gray-400">{user?.email}</p>
            
            <div className="mt-6">
              <button
                onClick={() => logout()}
                className="btn btn-outline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Right column - Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile form */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Account Information</h2>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-500 hover:text-primary-400"
                >
                  Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className={`input w-full ${formErrors.username ? 'border-red-500' : ''}`}
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input w-full"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="preferredCountry" className="block text-sm font-medium text-gray-300 mb-1">
                    Preferred Country
                  </label>
                  <select
                    id="preferredCountry"
                    name="preferredCountry"
                    className="input w-full"
                    value={formData.preferredCountry}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user?.username || '',
                        name: user?.name || '',
                        preferredCountry: user?.preferredCountry || 'India',
                        profilePicture: user?.profilePicture || ''
                      });
                      setFormErrors({});
                    }}
                    className="btn border border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Password form */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-primary-500 hover:text-primary-400"
                >
                  Change
                </button>
              )}
            </div>
            
            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className={`input w-full ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className={`input w-full ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`input w-full ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordErrors({});
                    }}
                    className="btn border border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-400">
                We recommend using a strong password that you don't use elsewhere.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 