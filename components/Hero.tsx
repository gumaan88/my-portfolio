import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { HERO_IMAGE_URL } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1 text-center md:text-right"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
            </span>
            متاح للمشاريع والاستشارات
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            تطبيقات <span className="text-transparent bg-clip-text bg-gradient-to-l from-electric-400 to-blue-600">الذكاء الاصطناعي</span>
            <br />
            والبنية الرقمية المتقدمة
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            أساعد المؤسسات على تبني المستقبل من خلال دمج حلول الذكاء الاصطناعي، تأمين البنية التحتية للشبكات، وأتمتة العمليات الرقمية لتحقيق أقصى كفاءة.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-xl bg-white text-navy-900 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              اطلب استشارة
              <ArrowLeft className="w-5 h-5" />
            </a>
            <a 
              href="#projects" 
              className="px-8 py-4 rounded-xl bg-navy-800/50 text-white border border-white/10 hover:bg-navy-800 hover:border-electric-500/30 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              استعرض المشاريع
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
              src={HERO_IMAGE_URL} 
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
            className="absolute top-10 -right-4 md:right-10 bg-navy-800/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl"
          >
            <div className="text-electric-400 text-xs font-bold">AI Expert</div>
            <div className="text-white text-sm font-bold">Neural Networks</div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -left-4 md:left-10 bg-navy-800/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl"
          >
            <div className="text-blue-400 text-xs font-bold">Cert. Engineer</div>
            <div className="text-white text-sm font-bold">MikroTik & Cisco</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;