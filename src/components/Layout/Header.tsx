
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User, Settings, LogOut, TrendingUp } from 'lucide-react';

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

const Header = () => {
  const { user, isAuthenticated, isAdmin, isEditor, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span>IBOV: +2.35%</span>
              </span>
              <span>USD/BRL: R$ 5.84</span>
              <span>Bitcoin: $67,432</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-xs">
              <span>{new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-2 border-red-600 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">FinanceNews</span>
                <span className="text-xs text-slate-500 -mt-1">Portal de Notícias Financeiras</span>
              </div>
            </Link>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* User Avatar with Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-100">
                        <Avatar className="h-10 w-10 border-2 border-slate-200 hover:border-red-300 transition-colors">
                          {user?.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : null}
                          <AvatarFallback className={`${getAvatarColor(user?.name || '')} text-white text-sm font-semibold hover:opacity-90 transition-opacity`}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white shadow-lg border z-50" align="end">
                      <div className="flex items-center justify-start gap-2 p-3">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                      {(isAdmin || isEditor) && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Menu Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-white shadow-lg border z-50" align="end">
                      <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer">
                        Início
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/articles')} className="cursor-pointer">
                        Notícias
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/categories')} className="cursor-pointer">
                        Categorias
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Menu Button for non-authenticated users */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-white shadow-lg border z-50" align="end">
                      <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer">
                        Início
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/articles')} className="cursor-pointer">
                        Notícias
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/categories')} className="cursor-pointer">
                        Categorias
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/login')} className="cursor-pointer">
                        Entrar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/register')} className="cursor-pointer">
                        Cadastrar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-slate-100"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                {isAuthenticated ? (
                  <>
                    {/* User info for mobile */}
                    <div className="px-3 py-2 border-b border-slate-200 mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {user?.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : null}
                          <AvatarFallback className={`${getAvatarColor(user?.name || '')} text-white text-xs font-semibold`}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation items for authenticated users */}
                    <Link 
                      to="/" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Início
                    </Link>
                    <Link 
                      to="/articles" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Notícias
                    </Link>
                    <Link 
                      to="/categories" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Categorias
                    </Link>
                    
                    {/* User actions */}
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-slate-50"
                        onClick={() => {
                          navigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Button>
                      {(isAdmin || isEditor) && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-slate-50"
                          onClick={() => {
                            navigate('/admin');
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Admin
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Navigation for non-authenticated users */}
                    <Link 
                      to="/" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Início
                    </Link>
                    <Link 
                      to="/articles" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Notícias
                    </Link>
                    <Link 
                      to="/categories" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Categorias
                    </Link>
                    
                    {/* Login/Register buttons for non-authenticated users */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full hover:bg-slate-50"
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Entrar
                      </Button>
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          navigate('/register');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Cadastrar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
