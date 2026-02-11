import React from 'react';
import { CONTENT } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const navigate = useNavigate();

  return (
    <footer className="py-8 bg-black border-t border-white/5 text-center">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
        <p className="text-gray-700 text-xs mt-2 mb-4">
          {t.footer.tagline}
        </p>
        
        {/* Visible Admin Login Link */}
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-electric-400 transition-all text-xs border border-white/5"
          title="Admin Login"
        >
          <Lock size={12} />
          <span>Admin Login</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;