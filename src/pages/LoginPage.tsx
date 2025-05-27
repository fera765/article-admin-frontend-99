
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Shield, ArrowRight, TrendingUp } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      // Redirecionar para home após login bem-sucedido
      navigate('/', { replace: true });
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Breaking News Bar */}
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

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">FinanceNews</span>
                <span className="text-xs text-slate-500 -mt-1">Portal de Notícias Financeiras</span>
              </div>
            </Link>
          </div>

          {/* Success Message */}
          {location.state?.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">{location.state.message}</p>
            </div>
          )}

          {/* Login Card */}
          <Card className="border border-slate-200 shadow-xl bg-white">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                Acesso Restrito
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Entre com suas credenciais para acessar o portal
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-red-500 focus:ring-red-500/20 bg-white transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-12 border-slate-200 focus:border-red-500 focus:ring-red-500/20 bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Autenticando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Entrar no Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">
                    Ainda não possui conta?
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 border-2 border-red-200 rounded-xl text-sm font-medium text-red-700 bg-red-50/50 hover:bg-red-100/50 hover:border-red-300 transition-all duration-200"
                  >
                    Criar Nova Conta
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-slate-500 hover:text-red-600 transition-colors"
                >
                  <span>← Voltar ao portal</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
              <Shield className="w-4 h-4 text-red-500" />
              <p className="text-xs text-slate-600 font-medium">
                Conexão segura SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
