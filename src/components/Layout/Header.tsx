
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, X, User, Settings, LogOut, TrendingUp } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
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

            {/* Desktop Navigation - Only show when authenticated */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center space-x-8">
                <Link to="/" className="text-slate-700 hover:text-red-600 font-medium transition-colors border-b-2 border-transparent hover:border-red-600 pb-1">
                  Início
                </Link>
                <Link to="/articles" className="text-slate-700 hover:text-red-600 font-medium transition-colors border-b-2 border-transparent hover:border-red-600 pb-1">
                  Notícias
                </Link>
                <Link to="/categories" className="text-slate-700 hover:text-red-600 font-medium transition-colors border-b-2 border-transparent hover:border-red-600 pb-1">
                  Mercados
                </Link>
                <Link to="/analysis" className="text-slate-700 hover:text-red-600 font-medium transition-colors border-b-2 border-transparent hover:border-red-600 pb-1">
                  Análises
                </Link>
                <Link to="/about" className="text-slate-700 hover:text-red-600 font-medium transition-colors border-b-2 border-transparent hover:border-red-600 pb-1">
                  Sobre
                </Link>
              </nav>
            )}

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* User Avatar with Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white shadow-lg border" align="end" forceMount>
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
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Administrador
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Menu Button */}
                  <div className="lg:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Show login/register buttons only when not authenticated */}
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-700 hover:text-red-600">
                      Entrar
                    </Button>
                    <Button onClick={() => navigate('/register')} className="bg-red-600 hover:bg-red-700 text-white">
                      Cadastrar
                    </Button>
                  </div>

                  {/* Mobile Menu Button for non-authenticated users */}
                  <div className="lg:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button for small screens */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                {isAuthenticated ? (
                  <>
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
                      Mercados
                    </Link>
                    <Link 
                      to="/analysis" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Análises
                    </Link>
                    <Link 
                      to="/about" 
                      className="block px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sobre
                    </Link>
                    
                    {/* User info and actions */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate('/admin');
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Administrador
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600"
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
                    {/* Login/Register buttons for non-authenticated users */}
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full"
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
