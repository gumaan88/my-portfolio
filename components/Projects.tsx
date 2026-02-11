import React, { useEffect, useState } from 'react';
import { CONTENT } from '../constants';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';

const Projects: React.FC = () => {
  const { language, dir } = useLanguage();
  const t = CONTENT[language];
  const ArrowIcon = dir === 'rtl' ? ArrowUpLeft : ArrowUpRight;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const dbProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        
        if (dbProjects.length > 0) {
          setProjects(dbProjects);
        } else {
          // Fallback to constants if DB is empty
          setProjects(t.projects.items);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
        setProjects(t.projects.items);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [language]); // Re-fetch isn't strictly necessary for lang change unless DB has lang support, but good for reset

  return (
    <section id="projects" className="py-24 bg-navy-950 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t.projects.title}</h2>
          <a href="#" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            {t.cta.allWork}
            <ArrowIcon size={16} />
          </a>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading projects...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group rounded-2xl bg-navy-900 border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-navy-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} z-20 bg-navy-900/80 backdrop-blur text-xs font-bold text-white px-3 py-1 rounded-full border border-white/10`}>
                    {project.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">
                    {project.description}
                  </p>
                  
                  {project.stats && project.stats.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      {project.stats.map((stat, idx) => (
                        <div key={idx}>
                          <div className="text-lg font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;