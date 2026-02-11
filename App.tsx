import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import AIApplications from './components/AIApplications';
import Projects from './components/Projects';
import Community from './components/Community';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-navy-900 min-h-screen text-slate-200 selection:bg-electric-500/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Expertise />
        <AIApplications />
        <Projects />
        <Community />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;