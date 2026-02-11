import React from 'react';
import { Mic2, Users, Award } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <section id="community" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                المشاركة <span className="text-electric-400">المجتمعية</span>
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                أؤمن بأن المعرفة تنمو بالمشاركة. أحرص دائماً على التواجد في الفعاليات التقنية ونقل الخبرات للمجتمع التقني العربي.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-electric-400 shrink-0">
                    <Mic2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">متحدث تقني</h4>
                    <p className="text-gray-400 text-sm">مشاركة دورية في مؤتمرات التحول الرقمي والذكاء الاصطناعي.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-electric-400 shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">ورش عمل تدريبية</h4>
                    <p className="text-gray-400 text-sm">تقديم ورش عمل في هندسة الشبكات (MikroTik) وتطوير الأنظمة.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-electric-400 shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">مساهمات مفتوحة المصدر</h4>
                    <p className="text-gray-400 text-sm">نشر أدوات وسكربتات مفيدة على GitHub لمجتمع المطورين.</p>
                  </div>
                </div>
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
                <span>📍 الرياض، المملكة العربية السعودية</span>
                <span>📅 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;