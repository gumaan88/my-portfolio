import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-900/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-electric-500/10 flex items-center justify-center border border-electric-500/20 group-hover:border-electric-500/50 transition-colors">
            <Terminal className="text-electric-400 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white leading-none">م. جمعان سعيد</span>
            <span className="text-xs text-gray-400">مستشار تقني</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-electric-400 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-electric-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href="#contact"
            className="px-5 py-2.5 rounded-full bg-electric-600 hover:bg-electric-500 text-white text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]"
          >
            اطلب استشارة
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg text-gray-300 hover:text-electric-400 py-2 border-b border-white/5"
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full text-center px-5 py-3 rounded-lg bg-electric-600 text-white font-semibold"
          >
            اطلب استشارة
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;