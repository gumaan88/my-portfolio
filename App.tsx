import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import AIApplications from './components/AIApplications';
import Projects from './components/Projects';
import Community from './components/Community';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CommentsSection from './components/CommentsSection';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Messages from './pages/admin/Messages';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-navy-900 text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function PublicApp() {
  return (
    <div className="bg-navy-900 min-h-screen text-slate-200 selection:bg-electric-500/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Expertise />
        <AIApplications />
        <Projects />
        <Community />
        <CommentsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicApp />} />
            
            {/* Admin Authentication */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="messages" element={<Messages />} />
              <Route path="content" element={<div className="text-white p-6">Content Management System (Coming Soon)</div>} />
              <Route path="settings" element={<div className="text-white p-6">Settings (Coming Soon)</div>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;