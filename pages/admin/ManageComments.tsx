import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Comment } from '../../types';
import { Trash2, MessageCircle, ThumbsUp } from 'lucide-react';

const ManageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('حذف هذا التعليق نهائياً؟')) {
      await deleteDoc(doc(db, 'comments', id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">إدارة التعليقات ({comments.length})</h1>

      <div className="grid gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-navy-800 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-white">{comment.name}</h3>
                <span className="text-xs text-gray-500 bg-navy-900 px-2 py-1 rounded">
                   {comment.createdAt?.seconds && new Date(comment.createdAt.seconds * 1000).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <p className="text-gray-300 bg-navy-900/50 p-3 rounded-lg border border-white/5 mb-3">
                {comment.content}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><ThumbsUp size={14} /> {comment.likes} إعجاب</span>
                <span className="flex items-center gap-1"><MessageCircle size={14} /> {comment.replies?.length || 0} ردود</span>
              </div>

              {/* Show Replies if any */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 text-xs text-electric-400">
                  تم الرد: "{comment.replies[comment.replies.length - 1].content}"
                </div>
              )}
            </div>

            <div className="flex gap-2">
               <button 
                 onClick={() => handleDelete(comment.id)}
                 className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                 title="حذف"
               >
                 <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-20 text-gray-500">لا توجد تعليقات</div>
        )}
      </div>
    </div>
  );
};

export default ManageComments;