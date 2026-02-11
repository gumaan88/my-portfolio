import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Download, Cpu, Activity, Zap, Workflow } from 'lucide-react';
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

  const getStr = (field: keyof HeroContent, subField?: string) => {
    if (content && content[field]) {
      // @ts-ignore
      return content[field][language] || CONTENT[language].hero[subField || field];
    }
    // @ts-ignore
    return CONTENT[language].hero[subField || field];
  };

  const heroImage = content?.image || HERO_IMAGE_URL;

  // Custom animation styles for the beams
  const beamStyle = `
    @keyframes beam-flow {
      0% { transform: translateY(-100%); opacity: 0; }
      10% { opacity: 0.5; }
      100% { transform: translateY(120vh); opacity: 0; }
    }
    .tech-beam {
      position: absolute;
      width: 1px;
      background: linear-gradient(to bottom, transparent, #22d3ee, transparent);
      opacity: 0;
    }
  `;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-navy-950" dir={dir}>
      <style>{beamStyle}</style>
      
      {/* --- LAYER 1: Futuristic Grid Background --- */}
      <div className="absolute inset-0 z-0">
        {/* Vertical Lines Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Horizontal Lines Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Moving Data Beams (The "Flow" Effect) */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="tech-beam"
            style={{
              left: `${15 + i * 15}%`,
              height: `${200 + Math.random() * 300}px`,
              animation: `beam-flow ${3 + Math.random() * 4}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* --- LAYER 2: Ambient Glows --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] ${dir === 'rtl' ? 'left-[-10%]' : 'right-[-10%]'} w-[500px] h-[500px] bg-electric-500/10 rounded-full blur-[120px]`}></div>
        <div className={`absolute bottom-[-10%] ${dir === 'rtl' ? 'right-[-10%]' : 'left-[-10%]'} w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]`}></div>
      </div>

      {/* --- LAYER 3: Main Content --- */}
      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`order-2 md:order-1 text-center ${dir === 'rtl' ? 'md:text-right' : 'md:text-left'}`}
        >
          {/* Tech Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-electric-500/30 text-electric-400 text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <Activity size={16} className="animate-pulse" />
            {getStr('status')}
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            {getStr('titlePart1')} <br className="md:hidden" />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-electric-400 via-blue-400 to-electric-400 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              {getStr('titleHighlight')}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-electric-500 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
            <br />
            {getStr('titlePart2')}
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed border-l-2 border-electric-500/20 pl-4">
            {getStr('description')}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'md:justify-start' : 'md:justify-start'}`}>
            <a 
              href="#contact" 
              className="group relative px-8 py-4 rounded-xl bg-white text-navy-950 font-bold overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <div className="relative flex items-center justify-center gap-2">
                {t.cta.consult}
                <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a 
              href="#projects" 
              className="px-8 py-4 rounded-xl bg-navy-800/40 text-white border border-white/10 hover:bg-navy-800 hover:border-electric-500/50 transition-all flex items-center justify-center gap-2 backdrop-blur-sm group"
            >
              {t.cta.projects}
              <Download className="w-5 h-5 group-hover:text-electric-400 transition-colors" />
            </a>
          </div>
        </motion.div>

        {/* Image Content Wrapper - Revised Layout */}
        <div className="order-1 md:order-2 flex flex-col items-center justify-center relative mt-8 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-72 h-72 md:w-[450px] md:h-[450px] z-10"
          >
            {/* Tech Rings Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[120%] h-[120%] border border-electric-500/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="w-[140%] h-[140%] border border-dashed border-electric-500/10 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
              {/* Orbits */}
              <div className="absolute w-[160%] h-[160%] rounded-full animate-[spin_15s_linear_infinite]">
                 <div className="w-3 h-3 bg-electric-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#22d3ee]"></div>
              </div>
            </div>
            
            {/* Main Image Container */}
            <div className="relative w-full h-full z-10">
               <div className="absolute inset-0 bg-gradient-to-b from-electric-500/20 to-transparent rounded-full blur-2xl transform translate-y-4"></div>
               
               <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-electric-500/30 bg-navy-900 shadow-2xl">
                  <img 
                    src={heroImage} 
                    alt="Eng. Jamaan Saeed" 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-500/10 to-transparent w-full h-[20%] animate-[scan_3s_linear_infinite] pointer-events-none"></div>
               </div>

               {/* --- FLOATING BADGES (Responsive) --- */}
               
               {/* Badge 1: AI CORE (Top Start) */}
               <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`
                    absolute z-20 bg-navy-800/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
                    rounded-xl md:rounded-2xl p-2 md:p-4 
                    min-w-[120px] md:min-w-[140px]
                    scale-75 md:scale-100 origin-center
                    /* Approx 55% from top to clear face on mobile */
                    top-[55%] md:top-10 
                    /* Start Side */
                    ${dir === 'rtl' ? '-right-4 md:-right-8' : '-left-4 md:-left-8'}
                  `}
               >
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                     <div className="p-1.5 md:p-2 bg-electric-500/20 rounded-lg text-electric-400"><Cpu size={18} /></div>
                     <span className="text-electric-400 text-[10px] md:text-xs font-bold tracking-wider">{getStr('badge1Title')?.toUpperCase()}</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-bold">{getStr('badge1Sub')}</div>
               </motion.div>

               {/* Badge 2: NETWORK (Bottom End) */}
               <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className={`
                    absolute z-20 bg-navy-800/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
                    rounded-xl md:rounded-2xl p-2 md:p-4 
                    min-w-[120px] md:min-w-[140px]
                    scale-75 md:scale-100 origin-center
                    bottom-0 md:bottom-20
                    /* End Side */
                    ${dir === 'rtl' ? '-left-4 md:-left-8' : '-right-4 md:-right-8'}
                  `}
               >
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                     <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg text-blue-400"><Zap size={18} /></div>
                     <span className="text-blue-400 text-[10px] md:text-xs font-bold tracking-wider">{getStr('badge2Title')?.toUpperCase()}</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-bold">{getStr('badge2Sub')}</div>
               </motion.div>

               {/* Badge 3: AUTOMATION (Bottom Start - NEW) */}
               <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className={`
                    absolute z-20 bg-navy-800/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
                    rounded-xl md:rounded-2xl p-2 md:p-4 
                    min-w-[120px] md:min-w-[140px]
                    scale-75 md:scale-100 origin-center
                    /* Positioned lower left/right to balance the composition */
                    bottom-10 md:bottom-10
                    /* Start Side (Same as Badge 1) */
                    ${dir === 'rtl' ? '-right-4 md:-right-8' : '-left-4 md:-left-8'}
                  `}
               >
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                     <div className="p-1.5 md:p-2 bg-fuchsia-500/20 rounded-lg text-fuchsia-400"><Workflow size={18} /></div>
                     <span className="text-fuchsia-400 text-[10px] md:text-xs font-bold tracking-wider">{getStr('badge3Title')?.toUpperCase()}</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-bold">{getStr('badge3Sub')}</div>
               </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;