import React from 'react';
import { CONTENT } from '../constants';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AIApplications: React.FC = () => {
  const { language } = useLanguage();
  const t = CONTENT[language];

  return (
    <section id="ai-solutions" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 text-electric-400 font-medium mb-2">
              <Sparkles size={18} />
              <span>{t.aiSolutions.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t.aiSolutions.title}
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
            {t.aiSolutions.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {t.aiSolutions.items.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-gradient-to-br from-navy-800 to-navy-900 border border-white/5 p-8 rounded-2xl hover:border-electric-500/40 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-500/5 rounded-full blur-2xl group-hover:bg-electric-500/10 transition-colors"></div>
              
              <div className="relative z-10 flex gap-6">
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-full bg-navy-950 border border-white/10 flex items-center justify-center text-electric-400 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.description}</p>
                  <div className="inline-block px-3 py-1 rounded-full bg-electric-900/30 border border-electric-500/20 text-electric-400 text-xs font-bold">
                    {t.aiSolutions.impactLabel}: {item.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIApplications;