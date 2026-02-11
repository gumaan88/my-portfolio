import React, { useEffect } from 'react';
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
import WhatsAppFloat from './components/WhatsAppFloat'; // Imported
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Messages from './pages/admin/Messages';
import ManageComments from './pages/admin/ManageComments';
import Content from './pages/admin/Content'; // Projects Manager
import Settings from './pages/admin/Settings'; // Social Links Manager

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-navy-900 text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function PublicApp() {
  // View Counter Logic
  useEffect(() => {
    const incrementView = async () => {
      const viewedSession = sessionStorage.getItem('viewed');
      if (!viewedSession) {
        try {
          const ref = doc(db, 'analytics', 'views');
          const snap = await getDoc(ref);
          if (snap.exists()) {
            await updateDoc(ref, { count: increment(1) });
          } else {
            await setDoc(ref, { count: 1 });
          }
          sessionStorage.setItem('viewed', 'true');
        } catch (e) {
          console.error("Analytics Error:", e);
        }
      }
    };
    incrementView();
  }, []);

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
      <WhatsAppFloat />
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
              <Route path="comments" element={<ManageComments />} />
              <Route path="content" element={<Content />} />
              <Route path="settings" element={<Settings />} />
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