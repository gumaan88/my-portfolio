import React from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const Expertise: React.FC = () => {
  const { language } = useLanguage();
  const t = CONTENT[language];

  return (
    <section id="expertise" className="py-24 relative bg-navy-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.expertise.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.expertise.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.expertise.items.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-navy-800/50 border border-white/5 rounded-2xl p-6 hover:border-electric-500/30 hover:bg-navy-800 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-6 text-electric-500 group-hover:scale-110 transition-transform border border-white/5">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-400 transition-colors">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;