import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONTENT } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CommunityContent } from '../types';
import { getIcon } from '../utils/iconMapper';

const Community: React.FC = () => {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [data, setData] = useState<CommunityContent | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'content', 'community'));
        if (docSnap.exists()) {
          setData(docSnap.data() as CommunityContent);
        } else {
            // Fallback if not in DB yet
            setData(t.community as unknown as CommunityContent);
        }
      } catch (e) { console.error(e); }
    };
    fetchCommunity();
  }, [language]);

  const displayData = data || t.community as unknown as CommunityContent;

  return (
    <section id="community" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {displayData.title[language]}
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {displayData.description[language]}
              </p>

              <div className="space-y-6">
                {displayData.roles && displayData.roles.map((role: any, idx: number) => {
                   const Icon = getIcon(role.iconName);
                   return (
                    <div key={idx} className="flex gap-4 group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-electric-400 shrink-0 group-hover:scale-110 transition-transform group-hover:bg-electric-600/20">
                            <Icon size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg group-hover:text-electric-400 transition-colors">
                                {role.title[language]}
                            </h4>
                            <p className="text-gray-400 text-sm">
                                {role.description[language]}
                            </p>
                        </div>
                    </div>
                   )
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
                {/* Placeholder for event image */}
                <img 
                  src="https://picsum.photos/800/450?grayscale" 
                  alt="Speaking Event" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                   <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/30">
                     <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                   </div>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-gray-500">
                <span>📍 {t.community.location}</span>
                <span>📅 {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;