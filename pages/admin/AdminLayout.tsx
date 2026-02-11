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
    <div className="min-h-screen bg-navy-900 relative" dir="rtl">
      {/* 
        Sidebar Fixes:
        - fixed: Keeps it in place
        - top-0 right-0: Forces it to the absolute right edge (crucial for RTL)
        - z-50: Ensures it sits above other content if screen is small
      */}
      <aside className="fixed top-0 right-0 h-full w-64 bg-navy-800 border-l border-white/5 flex flex-col z-50 shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
          <p className="text-xs text-electric-400 mt-1">v1.0.0 Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-electric-600 text-white shadow-lg shadow-electric-500/20 translate-x-[-4px]' 
                    : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-navy-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* 
        Main Content Fixes:
        - mr-64: Pushes content 16rem (256px) from the right, creating space for the sidebar
        - w-auto: Ensures width adjusts correctly
        - min-h-screen: Ensures background covers full height
      */}
      <main className="mr-64 min-h-screen bg-navy-900 transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;