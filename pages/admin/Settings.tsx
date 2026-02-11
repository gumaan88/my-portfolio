import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { SOCIAL_LINKS } from '../../constants';
import { Save, Link as LinkIcon, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [links, setLinks] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'socials');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setLinks(docSnap.data() as any);
        } else {
          // Initialize with defaults from constants
          const defaults: any = {};
          SOCIAL_LINKS.forEach(link => defaults[link.platform] = link.url);
          setLinks(defaults);
        }
      } catch (error) {
        console.error("Error loading settings", error);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'socials'), links);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Error saving settings");
    }
  };

  const handleChange = (platform: string, value: string) => {
    setLinks(prev => ({ ...prev, [platform]: value }));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">الإعدادات العامة</h1>
      <p className="text-gray-400 mb-8">إدارة روابط التواصل الاجتماعي التي تظهر في الموقع.</p>

      <div className="bg-navy-800 rounded-xl border border-white/5 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          {SOCIAL_LINKS.map((link) => (
            <div key={link.platform}>
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <link.icon size={16} className="text-electric-400" />
                {link.platform}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={links[link.platform] || ''}
                  onChange={(e) => handleChange(link.platform, e.target.value)}
                  className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-electric-500 outline-none dir-ltr"
                  placeholder="https://..."
                />
                <LinkIcon className="absolute left-3 top-3.5 text-gray-600 w-4 h-4" />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-white/5 flex items-center gap-4">
            <button 
              type="submit" 
              className="bg-electric-600 hover:bg-electric-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Save size={18} /> حفظ التغييرات
            </button>
            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-1 animate-in fade-in">
                <AlertCircle size={14} /> تم الحفظ بنجاح
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;