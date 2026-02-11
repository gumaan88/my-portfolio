import React from 'react';
import { CONTENT } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = CONTENT[language];

  return (
    <footer className="py-8 bg-black border-t border-white/5 text-center">
      <div className="container mx-auto px-6">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
        <p className="text-gray-700 text-xs mt-2">
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
};

export default Footer;