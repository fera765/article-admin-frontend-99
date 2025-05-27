
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X,
  BarChart3, 
  Users, 
  FileText, 
  Grid3x3,
  Settings,
  LogOut,
  Home,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from '@/components/ui/drawer';

// Função para gerar cor baseada na primeira letra
const getAvatarColor = (name: string) => {
  const firstLetter = name?.charAt(0)?.toLowerCase() || 'u';
  const colors = {
    'a': 'bg-red-500', 'b': 'bg-blue-500', 'c': 'bg-green-500', 'd': 'bg-yellow-500',
    'e': 'bg-purple-500', 'f': 'bg-pink-500', 'g': 'bg-indigo-500', 'h': 'bg-orange-500',
    'i': 'bg-teal-500', 'j': 'bg-cyan-500', 'k': 'bg-lime-500', 'l': 'bg-amber-500',
    'm': 'bg-emerald-500', 'n': 'bg-violet-500', 'o': 'bg-rose-500', 'p': 'bg-sky-500',
    'q': 'bg-stone-500', 'r': 'bg-slate-500', 's': 'bg-gray-500', 't': 'bg-zinc-500',
    'u': 'bg-neutral-500', 'v': 'bg-red-600', 'w': 'bg-blue-600', 'x': 'bg-green-600',
    'y': 'bg-yellow-600', 'z': 'bg-purple-600'
  };
  return colors[firstLetter] || 'bg-red-600';
};

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin', exact: true },
    { icon: FileText, label: 'Artigos', path: '/admin/articles' },
    { icon: Grid3x3, label: 'Categorias', path: '/admin/categories' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: Calendar, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'h-full' : 'h-screen'} bg-slate-900 text-white flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-slate-300">Painel Administrativo</p>
          </div>
          {isMobile && (
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-slate-600">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : null}
            <AvatarFallback className={`${getAvatarColor(user?.name || '')} text-white text-sm font-semibold`}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-300 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={handleBackHome}
          className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
        >
          <Home className="mr-3 h-5 w-5" />
          Voltar ao Site
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[80vh]">
                  <SidebarContent isMobile />
                </DrawerContent>
              </Drawer>
              <h1 className="text-lg font-semibold text-slate-900">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className={`${getAvatarColor(user?.name || '')} text-white text-xs font-semibold`}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
