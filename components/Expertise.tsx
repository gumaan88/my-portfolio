import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { getIcon } from '../utils/iconMapper';

const Expertise: React.FC = () => {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'content', 'expertise', 'items'));
        if (!querySnapshot.empty) {
          setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          // Fallback map constants to include iconName for consistent rendering
          setItems(t.expertise.items.map(i => ({...i, iconName: 'Brain'})));
        }
      } catch (e) {
        console.error("Expertise fetch error", e);
         setItems(t.expertise.items.map(i => ({...i, iconName: 'Brain'})));
      }
      setLoading(false);
    };
    fetchExpertise();
  }, [language]);

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
          {items.map((service, index) => {
            // Handle both dynamic (with iconName) and static (with icon component) structure
            const Icon = service.iconName ? getIcon(service.iconName) : (service.icon || getIcon('Brain'));
            // Handle multi-lang object vs static string
            const title = service.title && typeof service.title === 'object' ? service.title[language] : service.title;
            const desc = service.description && typeof service.description === 'object' ? service.description[language] : service.description;

            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-navy-800/50 border border-white/5 rounded-2xl p-6 hover:border-electric-500/30 hover:bg-navy-800 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-6 text-electric-500 group-hover:scale-110 transition-transform border border-white/5">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-400 transition-colors">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default Expertise;