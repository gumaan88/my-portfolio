import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Project, HeroContent, Service, AISolution, CommunityContent } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Layout, Zap, Users, Monitor, FileText, CheckCircle } from 'lucide-react';
import { CONTENT } from '../../constants';
import { iconOptions, getIcon } from '../../utils/iconMapper';

const Content = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'expertise' | 'ai' | 'projects' | 'community'>('hero');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // --- Data States ---
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [expertiseList, setExpertiseList] = useState<Service[]>([]);
  const [aiList, setAiList] = useState<AISolution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [communityData, setCommunityData] = useState<CommunityContent | null>(null);

  // --- Modal/Editing States ---
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'project' | 'expertise' | 'ai' | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);

  // --- Fetching Logic ---
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Hero
      const heroSnap = await getDoc(doc(db, 'content', 'hero'));
      if (heroSnap.exists()) setHeroData(heroSnap.data() as HeroContent);
      else {
        // Initialize with default if not in DB
        const defaultHero = {
            titlePart1: { ar: CONTENT.ar.hero.titlePart1, en: CONTENT.en.hero.titlePart1 },
            titleHighlight: { ar: CONTENT.ar.hero.titleHighlight, en: CONTENT.en.hero.titleHighlight },
            titlePart2: { ar: CONTENT.ar.hero.titlePart2, en: CONTENT.en.hero.titlePart2 },
            description: { ar: CONTENT.ar.hero.description, en: CONTENT.en.hero.description },
            status: { ar: CONTENT.ar.hero.status, en: CONTENT.en.hero.status },
            image: "https://alawn.org/Uploads/Persons/51f4c8ca-90c5-42fd-818b-f675bacf21f0.png"
        };
        setHeroData(defaultHero);
      }

      // 2. Expertise
      const expSnap = await getDocs(collection(db, 'content', 'expertise', 'items'));
      setExpertiseList(expSnap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));

      // 3. AI Solutions
      const aiSnap = await getDocs(collection(db, 'content', 'ai_solutions', 'items'));
      setAiList(aiSnap.docs.map(d => ({ id: d.id, ...d.data() } as AISolution)));

      // 4. Projects
      const projSnap = await getDocs(collection(db, 'projects'));
      setProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));

      // 5. Community
      const commSnap = await getDoc(doc(db, 'content', 'community'));
      if (commSnap.exists()) setCommunityData(commSnap.data() as CommunityContent);
      else {
          const defaultComm = {
              title: { ar: CONTENT.ar.community.title, en: CONTENT.en.community.title },
              description: { ar: CONTENT.ar.community.description, en: CONTENT.en.community.description },
              roles: {
                  role1: { title: { ar: CONTENT.ar.community.role1, en: CONTENT.en.community.role1 }, desc: { ar: CONTENT.ar.community.desc1, en: CONTENT.en.community.desc1 }},
                  role2: { title: { ar: CONTENT.ar.community.role2, en: CONTENT.en.community.role2 }, desc: { ar: CONTENT.ar.community.desc2, en: CONTENT.en.community.desc2 }},
                  role3: { title: { ar: CONTENT.ar.community.role3, en: CONTENT.en.community.role3 }, desc: { ar: CONTENT.ar.community.desc3, en: CONTENT.en.community.desc3 }}
              }
          };
          setCommunityData(defaultComm);
      }

    } catch (e) {
      console.error("Fetch error", e);
    }
    setLoading(false);
  };

  // --- Saving Logic ---
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const saveHero = async () => {
    if (!heroData) return;
    await setDoc(doc(db, 'content', 'hero'), heroData);
    showNotification('تم تحديث قسم الواجهة الرئيسية');
  };

  const saveCommunity = async () => {
    if (!communityData) return;
    await setDoc(doc(db, 'content', 'community'), communityData);
    showNotification('تم تحديث قسم المجتمع');
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editType || !currentItem) return;

    try {
        let collPath = '';
        if (editType === 'project') collPath = 'projects';
        else if (editType === 'expertise') collPath = 'content/expertise/items';
        else if (editType === 'ai') collPath = 'content/ai_solutions/items';

        if (currentItem.id) {
            await updateDoc(doc(db, collPath, currentItem.id), currentItem);
        } else {
            await addDoc(collection(db, collPath), currentItem);
        }
        
        setIsEditing(false);
        fetchAllData();
        showNotification('تم الحفظ بنجاح');
    } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (collectionPath: string, id: string) => {
      if(window.confirm('هل أنت متأكد من الحذف؟')) {
          await deleteDoc(doc(db, collectionPath, id));
          fetchAllData();
      }
  };

  // --- Render Helpers ---
  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-8 bg-navy-800 p-1 rounded-xl border border-white/5">
        {[
            { id: 'hero', label: 'الواجهة الرئيسية', icon: Layout },
            { id: 'expertise', label: 'التخصصات', icon: Monitor },
            { id: 'ai', label: 'حلول AI', icon: Zap },
            { id: 'projects', label: 'المشاريع', icon: FileText },
            { id: 'community', label: 'المجتمع', icon: Users },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all flex-1 justify-center ${
                    activeTab === tab.id 
                    ? 'bg-electric-600 text-white shadow-lg shadow-electric-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">إدارة المحتوى</h1>
          {notification && (
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold animate-in fade-in">
                  <CheckCircle size={16} /> {notification}
              </div>
          )}
      </div>

      {renderTabs()}

      {loading && <div className="text-white text-center py-10">جاري التحميل...</div>}

      {/* --- HERO SECTION --- */}
      {!loading && activeTab === 'hero' && heroData && (
          <div className="bg-navy-800 rounded-xl border border-white/5 p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <h3 className="text-electric-400 text-sm font-bold uppercase border-b border-white/5 pb-2 mb-4">النصوص (عربي)</h3>
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="العنوان الجزء 1"
                        value={heroData.titlePart1.ar}
                        onChange={e => setHeroData({...heroData, titlePart1: {...heroData.titlePart1, ar: e.target.value}})}
                      />
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="الكلمة المميزة (Highlight)"
                        value={heroData.titleHighlight.ar}
                        onChange={e => setHeroData({...heroData, titleHighlight: {...heroData.titleHighlight, ar: e.target.value}})}
                      />
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="العنوان الجزء 2"
                        value={heroData.titlePart2.ar}
                        onChange={e => setHeroData({...heroData, titlePart2: {...heroData.titlePart2, ar: e.target.value}})}
                      />
                      <textarea 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white h-24"
                        placeholder="الوصف"
                        value={heroData.description.ar}
                        onChange={e => setHeroData({...heroData, description: {...heroData.description, ar: e.target.value}})}
                      />
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="حالة التوفر"
                        value={heroData.status.ar}
                        onChange={e => setHeroData({...heroData, status: {...heroData.status, ar: e.target.value}})}
                      />
                  </div>
                  <div className="space-y-4">
                      <h3 className="text-electric-400 text-sm font-bold uppercase border-b border-white/5 pb-2 mb-4">English Text</h3>
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="Title Part 1"
                        value={heroData.titlePart1.en}
                        onChange={e => setHeroData({...heroData, titlePart1: {...heroData.titlePart1, en: e.target.value}})}
                      />
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="Highlight"
                        value={heroData.titleHighlight.en}
                        onChange={e => setHeroData({...heroData, titleHighlight: {...heroData.titleHighlight, en: e.target.value}})}
                      />
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="Title Part 2"
                        value={heroData.titlePart2.en}
                        onChange={e => setHeroData({...heroData, titlePart2: {...heroData.titlePart2, en: e.target.value}})}
                      />
                       <textarea 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white h-24"
                        placeholder="Description"
                        value={heroData.description.en}
                        onChange={e => setHeroData({...heroData, description: {...heroData.description, en: e.target.value}})}
                      />
                      <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        placeholder="Status Badge"
                        value={heroData.status.en}
                        onChange={e => setHeroData({...heroData, status: {...heroData.status, en: e.target.value}})}
                      />
                  </div>
              </div>
              <div>
                   <h3 className="text-white text-sm font-bold mb-2">رابط الصورة الشخصية</h3>
                   <input 
                        className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white"
                        value={heroData.image}
                        onChange={e => setHeroData({...heroData, image: e.target.value})}
                      />
              </div>
              <button onClick={saveHero} className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-3 rounded-lg flex justify-center gap-2">
                  <Save size={18} /> حفظ التغييرات
              </button>
          </div>
      )}

      {/* --- EXPERTISE TAB --- */}
      {!loading && activeTab === 'expertise' && (
          <div>
              <button onClick={() => { 
                  setEditType('expertise'); 
                  setCurrentItem({ title: {ar:'', en:''}, description: {ar:'', en:''}, tags: [], iconName: 'Brain' }); 
                  setIsEditing(true); 
                }} 
                className="mb-4 bg-electric-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-electric-500"
              >
                  <Plus size={16} /> إضافة تخصص جديد
              </button>
              <div className="grid md:grid-cols-2 gap-4">
                  {expertiseList.map(item => {
                      const Icon = getIcon(item.iconName);
                      return (
                      <div key={item.id} className="bg-navy-800 border border-white/5 p-4 rounded-xl flex items-start gap-4">
                          <div className="p-3 bg-navy-900 rounded-lg text-electric-400"><Icon size={20} /></div>
                          <div className="flex-1">
                              <h4 className="text-white font-bold">{item.title.ar}</h4>
                              <p className="text-xs text-gray-500 mb-2">{item.description.ar}</p>
                              <div className="flex flex-wrap gap-1">
                                  {item.tags.map(t => <span key={t} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{t}</span>)}
                              </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditType('expertise'); setCurrentItem(item); setIsEditing(true); }} className="text-blue-400 hover:text-white"><Edit2 size={16} /></button>
                            <button onClick={() => item.id && handleDelete('content/expertise/items', item.id)} className="text-red-400 hover:text-white"><Trash2 size={16} /></button>
                          </div>
                      </div>
                  )})}
              </div>
          </div>
      )}

      {/* --- AI SOLUTIONS TAB --- */}
      {!loading && activeTab === 'ai' && (
          <div>
              <button onClick={() => { 
                  setEditType('ai'); 
                  setCurrentItem({ title: {ar:'', en:''}, description: {ar:'', en:''}, impact: {ar:'', en:''}, iconName: 'Bot' }); 
                  setIsEditing(true); 
                }} 
                className="mb-4 bg-electric-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-electric-500"
              >
                  <Plus size={16} /> إضافة حل جديد
              </button>
              <div className="grid md:grid-cols-2 gap-4">
                  {aiList.map(item => {
                      const Icon = getIcon(item.iconName);
                      return (
                      <div key={item.id} className="bg-navy-800 border border-white/5 p-4 rounded-xl flex items-start gap-4">
                          <div className="p-3 bg-navy-900 rounded-lg text-electric-400"><Icon size={20} /></div>
                          <div className="flex-1">
                              <h4 className="text-white font-bold">{item.title.ar}</h4>
                              <p className="text-xs text-gray-500">{item.description.ar}</p>
                              <div className="mt-2 text-xs text-electric-400 font-bold border border-electric-500/20 inline-block px-2 py-1 rounded">
                                  {item.impact.ar}
                              </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditType('ai'); setCurrentItem(item); setIsEditing(true); }} className="text-blue-400 hover:text-white"><Edit2 size={16} /></button>
                            <button onClick={() => item.id && handleDelete('content/ai_solutions/items', item.id)} className="text-red-400 hover:text-white"><Trash2 size={16} /></button>
                          </div>
                      </div>
                  )})}
              </div>
          </div>
      )}

      {/* --- COMMUNITY TAB --- */}
      {!loading && activeTab === 'community' && communityData && (
          <div className="bg-navy-800 rounded-xl border border-white/5 p-6 space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <h3 className="text-electric-400 text-sm font-bold uppercase">القسم الرئيسي (عربي)</h3>
                      <input className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white" value={communityData.title.ar} onChange={e => setCommunityData({...communityData, title: {...communityData.title, ar: e.target.value}})} />
                      <textarea className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white h-24" value={communityData.description.ar} onChange={e => setCommunityData({...communityData, description: {...communityData.description, ar: e.target.value}})} />
                  </div>
                  <div className="space-y-4">
                      <h3 className="text-electric-400 text-sm font-bold uppercase">Main Section (English)</h3>
                      <input className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white" value={communityData.title.en} onChange={e => setCommunityData({...communityData, title: {...communityData.title, en: e.target.value}})} />
                      <textarea className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white h-24" value={communityData.description.en} onChange={e => setCommunityData({...communityData, description: {...communityData.description, en: e.target.value}})} />
                  </div>
               </div>
               
               <div className="border-t border-white/5 pt-6 space-y-6">
                   <h3 className="text-white font-bold">الأدوار المجتمعية</h3>
                   {['role1', 'role2', 'role3'].map((roleKey, idx) => (
                       <div key={roleKey} className="bg-navy-900/50 p-4 rounded-lg border border-white/5">
                           <div className="grid md:grid-cols-2 gap-4">
                               <div>
                                   <label className="text-xs text-gray-500 block mb-1">Role {idx+1} Title (AR)</label>
                                   <input className="w-full bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" value={(communityData.roles as any)[roleKey].title.ar} 
                                   onChange={e => {
                                       const newRoles = {...communityData.roles};
                                       (newRoles as any)[roleKey].title.ar = e.target.value;
                                       setCommunityData({...communityData, roles: newRoles});
                                   }} />
                                    <label className="text-xs text-gray-500 block mb-1 mt-2">Description (AR)</label>
                                   <input className="w-full bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" value={(communityData.roles as any)[roleKey].desc.ar} 
                                   onChange={e => {
                                       const newRoles = {...communityData.roles};
                                       (newRoles as any)[roleKey].desc.ar = e.target.value;
                                       setCommunityData({...communityData, roles: newRoles});
                                   }} />
                               </div>
                               <div>
                                   <label className="text-xs text-gray-500 block mb-1">Role {idx+1} Title (EN)</label>
                                   <input className="w-full bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" value={(communityData.roles as any)[roleKey].title.en} 
                                   onChange={e => {
                                       const newRoles = {...communityData.roles};
                                       (newRoles as any)[roleKey].title.en = e.target.value;
                                       setCommunityData({...communityData, roles: newRoles});
                                   }} />
                                   <label className="text-xs text-gray-500 block mb-1 mt-2">Description (EN)</label>
                                   <input className="w-full bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" value={(communityData.roles as any)[roleKey].desc.en} 
                                   onChange={e => {
                                       const newRoles = {...communityData.roles};
                                       (newRoles as any)[roleKey].desc.en = e.target.value;
                                       setCommunityData({...communityData, roles: newRoles});
                                   }} />
                               </div>
                           </div>
                       </div>
                   ))}
               </div>

               <button onClick={saveCommunity} className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-3 rounded-lg flex justify-center gap-2">
                  <Save size={18} /> حفظ التغييرات
               </button>
          </div>
      )}

      {/* --- PROJECTS TAB (Previous logic simplified) --- */}
      {!loading && activeTab === 'projects' && (
          <div>
            <button onClick={() => { setEditType('project'); setCurrentItem({ title: '', category: '', description: '', image: '' }); setIsEditing(true); }} className="mb-4 bg-electric-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><Plus size={16} /> مشروع جديد</button>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {projects.map(p => (
                     <div key={p.id} className="bg-navy-800 border border-white/5 rounded-xl overflow-hidden group">
                         <img src={p.image} className="h-32 w-full object-cover" />
                         <div className="p-4 relative">
                             <div className="absolute top-2 left-2 flex gap-1 bg-black/50 p-1 rounded backdrop-blur">
                                 <button onClick={() => { setEditType('project'); setCurrentItem(p); setIsEditing(true); }} className="p-1 hover:text-blue-400"><Edit2 size={14}/></button>
                                 <button onClick={() => p.id && handleDelete('projects', p.id)} className="p-1 hover:text-red-400"><Trash2 size={14}/></button>
                             </div>
                             <h4 className="font-bold text-white truncate">{p.title}</h4>
                             <p className="text-xs text-gray-400 truncate">{p.category}</p>
                         </div>
                     </div>
                 ))}
            </div>
          </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditing && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-navy-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">تعديل / إضافة عنصر</h2>
                      <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X /></button>
                  </div>
                  <form onSubmit={handleModalSave} className="space-y-4">
                      {/* Project Fields */}
                      {editType === 'project' && (
                          <>
                            <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="عنوان المشروع" value={currentItem.title} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                            <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="التصنيف" value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} />
                            <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="رابط الصورة" value={currentItem.image} onChange={e => setCurrentItem({...currentItem, image: e.target.value})} />
                            <textarea required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="الوصف" value={currentItem.description} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} />
                          </>
                      )}

                      {/* Expertise/AI Common Fields (Multi-lang) */}
                      {(editType === 'expertise' || editType === 'ai') && (
                          <>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-electric-400 block mb-1">عربي</label>
                                    <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white mb-2" placeholder="العنوان" value={currentItem.title.ar} onChange={e => setCurrentItem({...currentItem, title: {...currentItem.title, ar: e.target.value}})} />
                                    <textarea required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white h-20" placeholder="الوصف" value={currentItem.description.ar} onChange={e => setCurrentItem({...currentItem, description: {...currentItem.description, ar: e.target.value}})} />
                                </div>
                                <div>
                                    <label className="text-xs text-electric-400 block mb-1">English</label>
                                    <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white mb-2" placeholder="Title" value={currentItem.title.en} onChange={e => setCurrentItem({...currentItem, title: {...currentItem.title, en: e.target.value}})} />
                                    <textarea required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white h-20" placeholder="Description" value={currentItem.description.en} onChange={e => setCurrentItem({...currentItem, description: {...currentItem.description, en: e.target.value}})} />
                                </div>
                             </div>

                             {/* Icon Selector */}
                             <div>
                                 <label className="text-sm text-gray-400 mb-2 block">الأيقونة</label>
                                 <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-navy-900 rounded-lg">
                                     {iconOptions.map(iconName => {
                                         const Icon = getIcon(iconName);
                                         return (
                                            <button key={iconName} type="button" onClick={() => setCurrentItem({...currentItem, iconName})} 
                                                className={`p-2 rounded-lg border ${currentItem.iconName === iconName ? 'bg-electric-600 border-electric-400 text-white' : 'border-white/5 text-gray-400 hover:bg-white/5'}`}>
                                                <Icon size={20} />
                                            </button>
                                         )
                                     })}
                                 </div>
                             </div>

                             {/* Expertise Tags */}
                             {editType === 'expertise' && (
                                 <div>
                                     <label className="text-sm text-gray-400">الوسوم (مفصولة بفاصلة)</label>
                                     <input className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" 
                                        placeholder="LLMs, Strategy, etc."
                                        value={currentItem.tags.join(', ')} 
                                        onChange={e => setCurrentItem({...currentItem, tags: e.target.value.split(',').map((t: string) => t.trim())})} 
                                     />
                                 </div>
                             )}

                             {/* AI Impact */}
                             {editType === 'ai' && (
                                  <div className="grid grid-cols-2 gap-4">
                                      <input className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="الأثر (عربي)" value={currentItem.impact.ar} onChange={e => setCurrentItem({...currentItem, impact: {...currentItem.impact, ar: e.target.value}})} />
                                      <input className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="Impact (English)" value={currentItem.impact.en} onChange={e => setCurrentItem({...currentItem, impact: {...currentItem.impact, en: e.target.value}})} />
                                  </div>
                             )}
                          </>
                      )}

                      <button type="submit" className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-3 rounded-lg flex justify-center gap-2">
                        <Save size={18} /> حفظ
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Content;