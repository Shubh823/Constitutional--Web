import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Profile from './pages/Profile';
import ContentDetail from './pages/ContentDetail';
import NotFound from './pages/NotFound';
import ConstitutionalTopics from './pages/ConstitutionalTopics';
import ConstitutionalGamePage from './pages/ConstitutionalGamePage';

// Layout
import Layout from './components/Layout';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="topics" element={<Topics />} />
        <Route path="topics/:topicId" element={<TopicDetail />} />
        <Route path="content/:contentId" element={<ContentDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="constitution" element={<ConstitutionalTopics />} />
        <Route path="constitution/games" element={<ConstitutionalGamePage />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App; 