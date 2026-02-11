import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Project } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

const Content = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project>({
    title: '',
    category: '',
    description: '',
    image: '',
    stats: []
  });

  const projectsCollection = collection(db, 'projects');

  const fetchProjects = async () => {
    const data = await getDocs(projectsCollection);
    setProjects(data.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project)));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject.id) {
        // Update
        const projectRef = doc(db, 'projects', currentProject.id);
        const { id, ...data } = currentProject;
        await updateDoc(projectRef, data);
      } else {
        // Create
        await addDoc(projectsCollection, currentProject);
      }
      setIsEditing(false);
      fetchProjects();
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.")) {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    }
  };

  const resetForm = () => {
    setCurrentProject({
      title: '',
      category: '',
      description: '',
      image: '',
      stats: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">إدارة المشاريع</h1>
        <button 
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="bg-electric-600 hover:bg-electric-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> إضافة مشروع
        </button>
      </div>

      {/* Project Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{currentProject.id ? 'تعديل مشروع' : 'مشروع جديد'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">عنوان المشروع</label>
                  <input 
                    type="text" 
                    value={currentProject.title}
                    onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">التصنيف</label>
                  <input 
                    type="text" 
                    value={currentProject.category}
                    onChange={e => setCurrentProject({...currentProject, category: e.target.value})}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">رابط الصورة (URL)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentProject.image}
                    onChange={e => setCurrentProject({...currentProject, image: e.target.value})}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-white"
                    placeholder="https://..."
                    required
                  />
                  {currentProject.image && (
                     <img src={currentProject.image} alt="preview" className="w-10 h-10 rounded object-cover border border-white/10" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">الوصف</label>
                <textarea 
                  value={currentProject.description}
                  onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                  className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-white h-24"
                  required
                />
              </div>

              {/* Simple Stats Editor (Optional for now, simple implementation) */}
              <div className="bg-navy-900/50 p-4 rounded-lg">
                <p className="text-sm text-electric-400 mb-2">الإحصائيات (اختياري)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="قيمة (مثلاً: +500)" 
                    value={currentProject.stats?.[0]?.value || ''}
                    onChange={e => {
                      const newStats = [...(currentProject.stats || [])];
                      if(!newStats[0]) newStats[0] = {label: '', value: ''};
                      newStats[0].value = e.target.value;
                      setCurrentProject({...currentProject, stats: newStats});
                    }}
                    className="bg-navy-800 p-2 rounded text-white text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="وصف (مثلاً: عميل)" 
                    value={currentProject.stats?.[0]?.label || ''}
                    onChange={e => {
                      const newStats = [...(currentProject.stats || [])];
                      if(!newStats[0]) newStats[0] = {label: '', value: ''};
                      newStats[0].label = e.target.value;
                      setCurrentProject({...currentProject, stats: newStats});
                    }}
                    className="bg-navy-800 p-2 rounded text-white text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                <Save size={18} /> حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-navy-800 rounded-xl border border-white/5 overflow-hidden group">
            <div className="relative h-48">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => { setCurrentProject(project); setIsEditing(true); }} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"><Edit2 size={18}/></button>
                <button onClick={() => project.id && handleDelete(project.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs text-electric-400 font-bold px-2 py-1 bg-electric-500/10 rounded-full mb-2 inline-block">
                {project.category}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد مشاريع مضافة. ابدأ بإضافة مشروعك الأول.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;