import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ContactMessage } from '../../types';
import { Mail, Calendar, CheckCircle } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
    });
    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, 'messages', id), { read: true });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">الرسائل الواردة ({messages.length})</h1>
      
      <div className="grid gap-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`bg-navy-800 rounded-xl border p-6 transition-all ${
              msg.read ? 'border-white/5 opacity-75' : 'border-electric-500/30 bg-navy-800/80 shadow-lg shadow-electric-500/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-electric-400">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                  <p className="text-electric-400 text-sm">{msg.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className="flex items-center gap-1 text-xs text-gray-500 bg-navy-900 px-2 py-1 rounded">
                   <Calendar size={12} />
                   {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'N/A'}
                 </span>
                 {!msg.read && (
                   <button 
                    onClick={() => markAsRead(msg.id)}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                   >
                     <CheckCircle size={12} /> تعليم كمقروء
                   </button>
                 )}
              </div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            لا توجد رسائل حتى الآن
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;