import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, increment, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Comment } from '../types';
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, User, Trash2, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { language } = useLanguage();
  const { user } = useAuth(); // Check if admin is logged in

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        name,
        content: newComment,
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        replies: []
      });
      setNewComment('');
      if (!user) setName(''); // Keep admin name if logged in
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("حدث خطأ أثناء إضافة التعليق. تأكد من الاتصال بالإنترنت.");
    }
    setIsSubmitting(false);
  };

  const handleReplySubmit = async (commentId: string) => {
    const content = replyContent[commentId];
    if (!content?.trim()) return;

    try {
      const ref = doc(db, 'comments', commentId);
      await updateDoc(ref, {
        replies: arrayUnion({
          id: Date.now().toString(),
          name: language === 'ar' ? 'م. جمعان سعيد' : 'Eng. Jamaan',
          content: content,
          createdAt: new Date().toISOString(), // Use string for array objects
          isAdmin: true
        })
      });
      setReplyContent(prev => ({...prev, [commentId]: ''}));
      setActiveReplyId(null);
    } catch (error) {
      console.error("Error replying", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      await deleteDoc(doc(db, 'comments', id));
    }
  };

  const handleLike = async (id: string) => {
    const ref = doc(db, 'comments', id);
    await updateDoc(ref, { likes: increment(1) });
  };

  const handleDislike = async (id: string) => {
    const ref = doc(db, 'comments', id);
    await updateDoc(ref, { dislikes: increment(1) });
  };

  return (
    <section className="py-24 bg-navy-900 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
          <MessageSquare className="text-electric-500" />
          {language === 'ar' ? 'آراء المجتمع' : 'Community Thoughts'}
        </h2>

        {/* Comment Form */}
        <div className="bg-navy-800/50 p-6 rounded-2xl border border-white/10 mb-12 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'الاسم' : 'Your Name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-navy-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-electric-500/50 focus:outline-none"
                  required
                />
              </div>
            )}
            <div>
              <textarea
                placeholder={user 
                  ? (language === 'ar' ? 'اكتب تعليقاً بصفتك المسؤول...' : 'Write a comment as Admin...') 
                  : (language === 'ar' ? 'أضف تعليقك...' : 'Add your comment...')
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-navy-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-electric-500/50 focus:outline-none min-h-[100px]"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-electric-600 hover:bg-electric-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {language === 'ar' ? 'نشر التعليق' : 'Post Comment'}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-navy-800/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-600 to-blue-700 flex items-center justify-center text-white font-bold shrink-0">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {comment.name}
                        {/* If this was an admin comment (future feature), show badge */}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt?.seconds 
                          ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: language === 'ar' ? ar : enUS })
                          : (language === 'ar' ? 'الآن' : 'Just now')}
                      </span>
                    </div>
                    
                    {/* Admin Actions */}
                    {user && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{comment.content}</p>
                  
                  {/* Actions Bar */}
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 hover:text-electric-400 transition-colors">
                      <ThumbsUp size={16} />
                      <span>{comment.likes}</span>
                    </button>
                    <button onClick={() => handleDislike(comment.id)} className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <ThumbsDown size={16} />
                      <span>{comment.dislikes}</span>
                    </button>
                    
                    {user && (
                      <button 
                        onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 text-electric-400 hover:text-electric-300 transition-colors"
                      >
                        <Reply size={16} />
                        <span>{language === 'ar' ? 'رد كمسؤول' : 'Reply as Admin'}</span>
                      </button>
                    )}
                  </div>

                  {/* Admin Reply Input */}
                  {activeReplyId === comment.id && user && (
                    <div className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                      <input 
                        type="text" 
                        value={replyContent[comment.id] || ''}
                        onChange={(e) => setReplyContent(prev => ({...prev, [comment.id]: e.target.value}))}
                        className="flex-1 bg-navy-900 border border-electric-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none"
                        placeholder={language === 'ar' ? 'اكتب ردك هنا...' : 'Write your reply...'}
                      />
                      <button 
                        onClick={() => handleReplySubmit(comment.id)}
                        className="bg-electric-600 hover:bg-electric-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        <Reply size={16} />
                      </button>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 space-y-4 pl-4 border-l-2 border-electric-500/20">
                      {comment.replies.map((reply, idx) => (
                        <div key={idx} className="bg-navy-900/50 p-4 rounded-lg relative">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-5 h-5 rounded bg-electric-500 flex items-center justify-center shadow-lg shadow-electric-500/20">
                                <ShieldCheck size={12} className="text-white" />
                             </div>
                             <span className="text-sm font-bold text-electric-400">
                               {reply.name} 
                               <span className="text-xs font-normal text-gray-500 mx-2">
                                 ({language === 'ar' ? 'مسؤول' : 'Admin'})
                               </span>
                             </span>
                          </div>
                          <p className="text-gray-300 text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommentsSection;