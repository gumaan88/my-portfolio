import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, FileText, Settings, MessageCircle } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'لوحة القيادة', path: '/admin', icon: LayoutDashboard },
    { label: 'الرسائل', path: '/admin/messages', icon: MessageSquare },
    { label: 'إدارة التعليقات', path: '/admin/comments', icon: MessageCircle },
    { label: 'إدارة المشاريع', path: '/admin/content', icon: FileText },
    { label: 'الإعدادات العامة', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-navy-900 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 border-l border-white/5 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
          <p className="text-xs text-electric-400 mt-1">v1.0.0 Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-electric-600 text-white' 
                    : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-navy-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;