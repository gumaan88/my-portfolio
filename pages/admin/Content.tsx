import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Project, HeroContent, Service, AISolution, CommunityContent } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Layout, Zap, Users, Monitor, FileText, CheckCircle, PlusCircle } from 'lucide-react';
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
  const [editType, setEditType] = useState<'project' | 'expertise' | 'ai' | 'communityRole' | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [tagInput, setTagInput] = useState(''); // State for adding new tags

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
            image: "https://alawn.org/Uploads/Persons/51f4c8ca-90c5-42fd-818b-f675bacf21f0.png",
            // Fallback for new badges
            badge1Title: { ar: 'خبير ذكاء اصطناعي', en: 'AI Expert' },
            badge1Sub: { ar: 'Neural Networks', en: 'Neural Networks' },
            badge2Title: { ar: 'مهندس معتمد', en: 'Cert. Engineer' },
            badge2Sub: { ar: 'MikroTik', en: 'MikroTik' },
            badge3Title: { ar: 'أتمتة العمليات', en: 'Automation' },
            badge3Sub: { ar: 'n8n Automation', en: 'n8n Automation' },
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
      if (commSnap.exists()) {
          setCommunityData(commSnap.data() as CommunityContent);
      } else {
          // Initialize with default array structure
          const defaultComm = {
              title: { ar: CONTENT.ar.community.title, en: CONTENT.en.community.title },
              description: { ar: CONTENT.ar.community.description, en: CONTENT.en.community.description },
              roles: CONTENT.ar.community.roles // Using the array structure from constants
          };
          setCommunityData(defaultComm as unknown as CommunityContent);
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

  const handleCommunityRoleDelete = async (roleId: string) => {
      if(!communityData || !window.confirm('هل أنت متأكد من حذف هذا الدور؟')) return;
      
      const updatedRoles = communityData.roles.filter(r => r.id !== roleId);
      const updatedData = { ...communityData, roles: updatedRoles };
      setCommunityData(updatedData);
      
      // Auto save to DB
      await setDoc(doc(db, 'content', 'community'), updatedData);
      showNotification('تم حذف الدور');
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editType || !currentItem) return;

    try {
        if (editType === 'communityRole') {
            // Logic for array-based community roles
            if (!communityData) return;
            
            let updatedRoles = [...(communityData.roles || [])];
            
            if (currentItem.id) {
                // Update existing
                updatedRoles = updatedRoles.map(r => r.id === currentItem.id ? currentItem : r);
            } else {
                // Add new
                const newRole = { ...currentItem, id: Date.now().toString() };
                updatedRoles.push(newRole);
            }
            
            const updatedData = { ...communityData, roles: updatedRoles };
            setCommunityData(updatedData);
            await setDoc(doc(db, 'content', 'community'), updatedData);
            
            setIsEditing(false);
            showNotification('تم تحديث الأدوار بنجاح');
            return;
        }

        // Logic for Collections (Projects, Expertise, AI)
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
                      {/* Main Texts */}
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
                      {/* Main Texts English */}
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

              {/* Badges Section */}
              <div className="border-t border-white/5 pt-6 mt-4">
                  <h3 className="text-electric-400 text-sm font-bold uppercase mb-4">Floating Badges (الشارات العائمة)</h3>
                  
                  {/* Badge 1 (AI) */}
                  <div className="bg-navy-900/50 p-4 rounded-lg mb-4">
                      <h4 className="text-white text-xs mb-2 font-bold">Badge 1 (Top/Left - AI)</h4>
                      <div className="grid grid-cols-2 gap-4">
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Title AR" value={heroData.badge1Title?.ar || ''} onChange={e => setHeroData({...heroData, badge1Title: {...heroData.badge1Title, ar: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Title EN" value={heroData.badge1Title?.en || ''} onChange={e => setHeroData({...heroData, badge1Title: {...heroData.badge1Title, en: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Sub AR" value={heroData.badge1Sub?.ar || ''} onChange={e => setHeroData({...heroData, badge1Sub: {...heroData.badge1Sub, ar: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Sub EN" value={heroData.badge1Sub?.en || ''} onChange={e => setHeroData({...heroData, badge1Sub: {...heroData.badge1Sub, en: e.target.value} as any})} />
                      </div>
                  </div>

                  {/* Badge 2 (Network) */}
                  <div className="bg-navy-900/50 p-4 rounded-lg mb-4">
                      <h4 className="text-white text-xs mb-2 font-bold">Badge 2 (Bottom/Right - Network)</h4>
                      <div className="grid grid-cols-2 gap-4">
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Title AR" value={heroData.badge2Title?.ar || ''} onChange={e => setHeroData({...heroData, badge2Title: {...heroData.badge2Title, ar: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Title EN" value={heroData.badge2Title?.en || ''} onChange={e => setHeroData({...heroData, badge2Title: {...heroData.badge2Title, en: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Sub AR" value={heroData.badge2Sub?.ar || ''} onChange={e => setHeroData({...heroData, badge2Sub: {...heroData.badge2Sub, ar: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Sub EN" value={heroData.badge2Sub?.en || ''} onChange={e => setHeroData({...heroData, badge2Sub: {...heroData.badge2Sub, en: e.target.value} as any})} />
                      </div>
                  </div>

                  {/* Badge 3 (Automation - NEW) */}
                  <div className="bg-navy-900/50 p-4 rounded-lg">
                      <h4 className="text-white text-xs mb-2 font-bold flex items-center gap-2"><Zap size={14} className="text-fuchsia-500" /> Badge 3 (New - Automation)</h4>
                      <div className="grid grid-cols-2 gap-4">
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Title AR" value={heroData.badge3Title?.ar || ''} onChange={e => setHeroData({...heroData, badge3Title: {...heroData.badge3Title, ar: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Title EN" value={heroData.badge3Title?.en || ''} onChange={e => setHeroData({...heroData, badge3Title: {...heroData.badge3Title, en: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Sub AR" value={heroData.badge3Sub?.ar || ''} onChange={e => setHeroData({...heroData, badge3Sub: {...heroData.badge3Sub, ar: e.target.value} as any})} />
                          <input className="bg-navy-800 border border-white/10 rounded p-2 text-white text-sm" placeholder="Sub EN" value={heroData.badge3Sub?.en || ''} onChange={e => setHeroData({...heroData, badge3Sub: {...heroData.badge3Sub, en: e.target.value} as any})} />
                      </div>
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
                  setTagInput('');
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
                            <button onClick={() => { setEditType('expertise'); setCurrentItem(item); setTagInput(''); setIsEditing(true); }} className="text-blue-400 hover:text-white"><Edit2 size={16} /></button>
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
                   <div className="flex items-center justify-between mb-4">
                       <h3 className="text-white font-bold">الأدوار المجتمعية</h3>
                       <button onClick={() => { 
                            setEditType('communityRole'); 
                            setCurrentItem({ title: {ar:'', en:''}, description: {ar:'', en:''}, iconName: 'Users' }); 
                            setIsEditing(true); 
                        }} 
                        className="bg-electric-600/20 text-electric-400 hover:bg-electric-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all"
                       >
                           <Plus size={14} /> إضافة دور جديد
                       </button>
                   </div>
                   
                   <div className="grid gap-3">
                       {communityData.roles && communityData.roles.map((role, idx) => {
                           const Icon = getIcon(role.iconName);
                           return (
                               <div key={role.id || idx} className="bg-navy-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between gap-4">
                                   <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center text-gray-400 border border-white/5">
                                           <Icon size={18} />
                                       </div>
                                       <div>
                                           <h4 className="text-white text-sm font-bold">{role.title.ar}</h4>
                                           <p className="text-xs text-gray-500">{role.description.ar}</p>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <button onClick={() => { setEditType('communityRole'); setCurrentItem(role); setIsEditing(true); }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                       <button onClick={() => handleCommunityRoleDelete(role.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                   </div>
                               </div>
                           );
                       })}
                       
                       {(!communityData.roles || communityData.roles.length === 0) && (
                           <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-white/10 rounded-lg">
                               لا توجد أدوار مضافة حالياً
                           </div>
                       )}
                   </div>
               </div>

               <button onClick={saveCommunity} className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-3 rounded-lg flex justify-center gap-2">
                  <Save size={18} /> حفظ التغييرات
               </button>
          </div>
      )}

      {/* --- PROJECTS TAB --- */}
      {!loading && activeTab === 'projects' && (
          <div>
            <button onClick={() => { 
                setEditType('project'); 
                setCurrentItem({ title: '', category: '', description: '', image: '', stats: [] }); 
                setIsEditing(true); 
            }} className="mb-4 bg-electric-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-electric-500">
                <Plus size={16} /> مشروع جديد
            </button>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {projects.map(p => (
                     <div key={p.id} className="bg-navy-800 border border-white/5 rounded-xl overflow-hidden group">
                         <div className="h-32 w-full relative">
                             <img src={p.image} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                         </div>
                         <div className="p-4 relative">
                             <div className="absolute top-[-40px] left-2 flex gap-1 bg-black/70 p-1.5 rounded-lg backdrop-blur">
                                 <button onClick={() => { setEditType('project'); setCurrentItem(p); setIsEditing(true); }} className="p-1 text-blue-400 hover:text-white"><Edit2 size={16}/></button>
                                 <button onClick={() => p.id && handleDelete('projects', p.id)} className="p-1 text-red-400 hover:text-white"><Trash2 size={16}/></button>
                             </div>
                             <h4 className="font-bold text-white truncate">{p.title}</h4>
                             <p className="text-xs text-electric-400 mb-2">{p.category}</p>
                             <div className="flex flex-wrap gap-2">
                                 {p.stats && p.stats.map((s, i) => (
                                     <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                                         {s.label}: {s.value}
                                     </span>
                                 ))}
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
          </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditing && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-navy-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Edit2 size={20} className="text-electric-500"/> 
                          {editType === 'project' ? 'إدارة المشروع' : 'تعديل المحتوى'}
                      </h2>
                      <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-lg hover:bg-white/10"><X size={20} /></button>
                  </div>
                  
                  <form onSubmit={handleModalSave} className="space-y-4">
                      {/* Project Fields */}
                      {editType === 'project' && (
                          <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm mb-1 block">عنوان المشروع</label>
                                    <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="مثلاً: نظام إدارة الشبكات" value={currentItem.title} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm mb-1 block">التصنيف</label>
                                    <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="مثلاً: AI & Automation" value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">رابط الصورة</label>
                                <input required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white dir-ltr" placeholder="https://..." value={currentItem.image} onChange={e => setCurrentItem({...currentItem, image: e.target.value})} />
                            </div>

                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">الوصف</label>
                                <textarea required className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white h-24" placeholder="وصف مختصر للمشروع..." value={currentItem.description} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} />
                            </div>

                            {/* --- STATS MANAGER (New Feature) --- */}
                            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-bold text-white flex items-center gap-2">
                                        <BarChart3Icon /> إحصائيات المشروع
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newStats = [...(currentItem.stats || []), { label: '', value: '' }];
                                            setCurrentItem({ ...currentItem, stats: newStats });
                                        }}
                                        className="text-xs bg-electric-600 hover:bg-electric-500 px-3 py-1.5 rounded-lg text-white flex items-center gap-1 transition-colors"
                                    >
                                        <PlusCircle size={14} /> إضافة إحصائية
                                    </button>
                                </div>
                                
                                {(!currentItem.stats || currentItem.stats.length === 0) && (
                                    <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-white/10 rounded-lg">
                                        لا توجد إحصائيات مضافة لهذا المشروع
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {(currentItem.stats || []).map((stat: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex-1">
                                                <input 
                                                    className="w-full bg-navy-800 border border-white/10 rounded p-2 text-white text-sm focus:border-electric-500 outline-none" 
                                                    placeholder="العنوان (مثلاً: Uptime)"
                                                    value={stat.label}
                                                    onChange={(e) => {
                                                        const newStats = [...currentItem.stats];
                                                        newStats[idx].label = e.target.value;
                                                        setCurrentItem({ ...currentItem, stats: newStats });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    className="w-full bg-navy-800 border border-white/10 rounded p-2 text-white text-sm focus:border-electric-500 outline-none dir-ltr text-right" 
                                                    placeholder="القيمة (مثلاً: 99.9%)"
                                                    value={stat.value}
                                                    onChange={(e) => {
                                                        const newStats = [...currentItem.stats];
                                                        newStats[idx].value = e.target.value;
                                                        setCurrentItem({ ...currentItem, stats: newStats });
                                                    }}
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const newStats = currentItem.stats.filter((_: any, i: number) => i !== idx);
                                                    setCurrentItem({ ...currentItem, stats: newStats });
                                                }}
                                                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                          </>
                      )}

                      {/* Expertise/AI/CommunityRole Common Fields (Multi-lang) */}
                      {(editType === 'expertise' || editType === 'ai' || editType === 'communityRole') && (
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
                                 <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-navy-900 rounded-lg custom-scrollbar border border-white/10">
                                     {iconOptions.map(iconName => {
                                         const Icon = getIcon(iconName);
                                         return (
                                            <button key={iconName} type="button" onClick={() => setCurrentItem({...currentItem, iconName})} 
                                                className={`p-2 rounded-lg border transition-all ${currentItem.iconName === iconName ? 'bg-electric-600 border-electric-400 text-white scale-110' : 'border-white/5 text-gray-400 hover:bg-white/5'}`}>
                                                <Icon size={20} />
                                            </button>
                                         )
                                     })}
                                 </div>
                             </div>

                             {/* Expertise Tags (Enhanced Builder) */}
                             {editType === 'expertise' && (
                                 <div>
                                     <label className="text-sm text-gray-400 mb-2 block">الوسوم (Tags)</label>
                                     <div className="flex gap-2 mb-2">
                                         <input 
                                             className="flex-1 bg-navy-900 border border-white/10 rounded p-3 text-white"
                                             placeholder="أكتب الوسم واضغط Enter"
                                             value={tagInput}
                                             onChange={e => setTagInput(e.target.value)}
                                             onKeyDown={e => {
                                                 if(e.key === 'Enter') {
                                                     e.preventDefault();
                                                     if(tagInput.trim()) {
                                                         const newTags = [...(currentItem.tags || []), tagInput.trim()];
                                                         setCurrentItem({...currentItem, tags: newTags});
                                                         setTagInput('');
                                                     }
                                                 }
                                             }}
                                         />
                                         <button 
                                             type="button"
                                             onClick={() => {
                                                 if(tagInput.trim()) {
                                                     const newTags = [...(currentItem.tags || []), tagInput.trim()];
                                                     setCurrentItem({...currentItem, tags: newTags});
                                                     setTagInput('');
                                                 }
                                             }}
                                             className="bg-electric-600 hover:bg-electric-500 text-white p-3 rounded-lg"
                                         >
                                             <Plus size={20} />
                                         </button>
                                     </div>
                                     
                                     <div className="flex flex-wrap gap-2 bg-navy-900/50 p-3 rounded-lg border border-white/5 min-h-[50px]">
                                         {currentItem.tags && currentItem.tags.length > 0 ? (
                                             currentItem.tags.map((tag: string, index: number) => (
                                                 <span key={index} className="bg-electric-500/10 border border-electric-500/20 text-electric-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                     {tag}
                                                     <button 
                                                         type="button" 
                                                         onClick={() => {
                                                             const newTags = currentItem.tags.filter((_: any, i: number) => i !== index);
                                                             setCurrentItem({...currentItem, tags: newTags});
                                                         }}
                                                         className="hover:text-white hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
                                                     >
                                                         <X size={14} />
                                                     </button>
                                                 </span>
                                             ))
                                         ) : (
                                             <span className="text-gray-500 text-sm italic">لا توجد وسوم مضافة...</span>
                                         )}
                                     </div>
                                 </div>
                             )}

                             {/* AI Impact */}
                             {editType === 'ai' && (
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-xs text-gray-400 block mb-1">الأثر (عربي)</label>
                                        <input className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="مثلاً: توفير 50%" value={currentItem.impact.ar} onChange={e => setCurrentItem({...currentItem, impact: {...currentItem.impact, ar: e.target.value}})} />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-400 block mb-1">Impact (English)</label>
                                        <input className="w-full bg-navy-900 border border-white/10 rounded p-3 text-white" placeholder="e.g. 50% Savings" value={currentItem.impact.en} onChange={e => setCurrentItem({...currentItem, impact: {...currentItem.impact, en: e.target.value}})} />
                                      </div>
                                  </div>
                             )}
                          </>
                      )}

                      <div className="pt-4 border-t border-white/5">
                        <button type="submit" className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-3 rounded-lg flex justify-center gap-2 transition-all shadow-lg shadow-electric-500/20">
                            <Save size={18} /> حفظ البيانات
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

// Helper Icon for Stats Label
const BarChart3Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

export default Content;