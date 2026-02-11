import React, { useEffect, useState } from 'react';
import { collection, getDocs, getCountFromServer, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart3, MessageSquare, Users, Eye } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-navy-800 p-6 rounded-xl border border-white/5 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-4 rounded-lg bg-${color}-500/10 text-${color}-400`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    messages: 0,
    comments: 0,
    views: 0,
    rating: 0
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Messages Count
        const msgColl = collection(db, 'messages');
        const msgCount = await getCountFromServer(msgColl);

        // 2. Comments Count
        const commentsColl = collection(db, 'comments');
        const commentsCount = await getCountFromServer(commentsColl);
        
        // 3. Views Count
        const viewsDoc = await getDoc(doc(db, 'analytics', 'views'));
        const views = viewsDoc.exists() ? viewsDoc.data().count : 0;

        // 4. Ratings
        const ratingsDoc = await getDoc(doc(db, 'analytics', 'ratings'));
        const rating = ratingsDoc.exists() ? ratingsDoc.data().average.toFixed(1) : 0;
        
        setStats({
          messages: msgCount.data().count,
          comments: commentsCount.data().count,
          views: views,
          rating: rating
        });

        // 5. Recent Messages
        const q = query(msgColl, orderBy('createdAt', 'desc'), limit(5));
        const msgSnapshot = await getDocs(q);
        setRecentMessages(msgSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">لوحة القيادة</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الرسائل" value={stats.messages} icon={MessageSquare} color="electric" />
        <StatCard title="التعليقات" value={stats.comments} icon={Users} color="green" />
        <StatCard title="الزيارات" value={stats.views} icon={Eye} color="blue" />
        <StatCard title="التقييم العام" value={stats.rating} icon={BarChart3} color="yellow" />
      </div>

      {/* Recent Activity Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-navy-800 rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-bold text-white mb-4">آخر الرسائل المستلمة</h3>
          <div className="space-y-4">
            {recentMessages.length > 0 ? recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-center justify-between p-4 bg-navy-900/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{msg.name}</h4>
                  <p className="text-gray-400 text-sm truncate max-w-md">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {msg.createdAt?.seconds && new Date(msg.createdAt.seconds * 1000).toLocaleDateString('ar-SA')}
                </span>
              </div>
            )) : <p className="text-gray-500">لا توجد رسائل حديثة</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-navy-800 rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-bold text-white mb-4">روابط سريعة</h3>
          <div className="space-y-3">
            <a href="/admin/content" className="block w-full p-3 bg-navy-900 hover:bg-navy-700 text-electric-400 rounded-lg text-right transition-colors">
              + إضافة مشروع جديد
            </a>
            <a href="/admin/messages" className="block w-full p-3 bg-navy-900 hover:bg-navy-700 text-gray-300 rounded-lg text-right transition-colors">
              عرض كل الرسائل
            </a>
            <a href="/admin/settings" className="block w-full p-3 bg-navy-900 hover:bg-navy-700 text-gray-300 rounded-lg text-right transition-colors">
              تحديث روابط التواصل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;