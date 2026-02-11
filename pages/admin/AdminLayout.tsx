import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, FileText, Settings, MessageCircle, Menu, X, ChevronRight } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'لوحة القيادة', path: '/admin', icon: LayoutDashboard },
    { label: 'الرسائل', path: '/admin/messages', icon: MessageSquare },
    { label: 'إدارة التعليقات', path: '/admin/comments', icon: MessageCircle },
    { label: 'إدارة المحتوى', path: '/admin/content', icon: FileText },
    { label: 'الإعدادات', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden" dir="rtl">
      {/* 
        Sidebar Container 
        - Using relative positioning within a flex container
        - No 'fixed' positioning ensures no overlap with main content
      */}
      <aside 
        className={`
          bg-navy-800 border-l border-white/5 flex flex-col transition-all duration-300 ease-in-out z-20
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0'} 
          hidden md:flex
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          {isSidebarOpen ? (
            <div>
              <h2 className="text-lg font-bold text-white">لوحة التحكم</h2>
              <p className="text-[10px] text-electric-400">Admin Console</p>
            </div>
          ) : (
            <div className="mx-auto font-bold text-electric-500">CP</div>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                 ${isActive 
                    ? 'bg-electric-600 text-white shadow-lg shadow-electric-500/20' 
                    : 'text-gray-400 hover:bg-navy-900/50 hover:text-white'
                 }
                 ${!isSidebarOpen && 'justify-center'}
                `
              }
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} className={isSidebarOpen ? '' : 'w-6 h-6'} />
              
              {isSidebarOpen && (
                <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
              )}
              
              {/* Active Indicator for collapsed state */}
              {!isSidebarOpen && location.pathname === item.path && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors
              ${!isSidebarOpen && 'justify-center'}
            `}
            title="تسجيل خروج"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">خروج</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      <div className="md:hidden">
         {/* Mobile Toggle Button */}
         <div className="fixed top-4 right-4 z-50">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-navy-800 rounded-lg text-white border border-white/10 shadow-lg"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
         </div>

         {/* Mobile Menu Content */}
         {isSidebarOpen && (
           <div className="fixed inset-0 bg-navy-900/95 backdrop-blur-sm z-40 flex flex-col p-6 pt-20 animate-in fade-in slide-in-from-right-10">
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">القائمة</h2>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-colors
                      ${isActive ? 'bg-electric-600 text-white' : 'text-gray-400 hover:text-white'}`
                    }
                  >
                    <item.icon size={24} />
                    {item.label}
                  </NavLink>
                ))}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 w-full text-red-400 mt-8 font-medium"
                >
                  <LogOut size={24} />
                  تسجيل خروج
                </button>
              </nav>
           </div>
         )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-navy-900 relative">
        {/* Header Area for Main Content (Mobile only usually, or breadcrumbs) */}
        <div className="h-16 md:hidden flex items-center px-6 border-b border-white/5 bg-navy-900">
           <span className="text-white font-bold">لوحة التحكم</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;