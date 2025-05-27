
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  Grid3x3,
  Calendar,
  Plus 
} from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Artigos', path: '/admin/articles' },
    { icon: Grid3x3, label: 'Categorias', path: '/admin/categories' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: Calendar, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Novo Artigo', path: '/admin/articles/new' },
    { icon: Plus, label: 'Nova Categoria', path: '/admin/categories/new' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      <nav className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Navegação
        </h3>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Ações Rápidas
        </h3>
        <ul className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <li key={action.path}>
                <Link
                  to={action.path}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {action.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DashboardSidebar;
