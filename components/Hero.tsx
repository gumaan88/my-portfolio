import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { HERO_IMAGE_URL, CONTENT } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { HeroContent } from '../types';

const Hero: React.FC = () => {
  const { language, dir } = useLanguage();
  const t = CONTENT[language];
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'content', 'hero'));
        if (docSnap.exists()) {
          setContent(docSnap.data() as HeroContent);
        }
      } catch (e) {
        console.error("Hero fetch error", e);
      }
    };
    fetchHero();
  }, []);

  // Helpers to get correct lang string, fallback to constants
  const getStr = (field: keyof HeroContent, subField?: string) => {
    if (content && content[field]) {
      // @ts-ignore
      return content[field][language] || CONTENT[language].hero[subField || field];
    }
    // @ts-ignore
    return CONTENT[language].hero[subField || field];
  };

  const heroImage = content?.image || HERO_IMAGE_URL;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden" dir={dir}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className={`absolute top-0 ${dir === 'rtl' ? 'left-1/4' : 'right-1/4'} w-96 h-96 bg-electric-500/10 rounded-full blur-[128px] pointer-events-none`}></div>
      <div className={`absolute bottom-0 ${dir === 'rtl' ? 'right-1/4' : 'left-1/4'} w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none`}></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`order-2 md:order-1 text-center ${dir === 'rtl' ? 'md:text-right' : 'md:text-left'}`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
            </span>
            {getStr('status')}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            {getStr('titlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-l from-electric-400 to-blue-600">{getStr('titleHighlight')}</span>
            <br />
            {getStr('titlePart2')}
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            {getStr('description')}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'md:justify-start' : 'md:justify-start'}`}>
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-xl bg-white text-navy-900 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              {t.cta.consult}
              <ArrowIcon className="w-5 h-5" />
            </a>
            <a 
              href="#projects" 
              className="px-8 py-4 rounded-xl bg-navy-800/50 text-white border border-white/10 hover:bg-navy-800 hover:border-electric-500/30 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              {t.cta.projects}
              <Download className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 md:order-2 flex justify-center relative"
        >
          {/* Decorative rings */}
          <div className="absolute inset-0 border border-electric-500/20 rounded-full scale-110 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-0 border border-dashed border-white/10 rounded-full scale-125 animate-[spin_15s_linear_infinite_reverse]"></div>
          
          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-navy-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-navy-800">
             {/* Using object-top to focus on face if image is tall */}
            <img 
              src={heroImage} 
              alt="Eng. Jamaan Saeed" 
              className="w-full h-full object-cover object-top"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent"></div>
          </div>

          {/* Floating badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-10 ${dir === 'rtl' ? '-right-4 md:right-10' : '-left-4 md:left-10'} bg-navy-800/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl`}
          >
            <div className="text-electric-400 text-xs font-bold">{t.hero.badge1Title}</div>
            <div className="text-white text-sm font-bold">{t.hero.badge1Sub}</div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={`absolute bottom-10 ${dir === 'rtl' ? '-left-4 md:left-10' : '-right-4 md:right-10'} bg-navy-800/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl`}
          >
            <div className="text-blue-400 text-xs font-bold">{t.hero.badge2Title}</div>
            <div className="text-white text-sm font-bold">{t.hero.badge2Sub}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;