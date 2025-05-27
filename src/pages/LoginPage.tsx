
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, TrendingUp, BarChart3, DollarSign, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TrendingUp className="absolute top-20 left-1/4 w-8 h-8 text-emerald-300/40 animate-pulse" />
        <BarChart3 className="absolute top-40 right-1/4 w-6 h-6 text-blue-300/40 animate-pulse delay-1000" />
        <DollarSign className="absolute bottom-40 left-1/3 w-7 h-7 text-indigo-300/40 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-xl">FN</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-left">
                <span className="block text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  FinanceNews
                </span>
                <span className="block text-xs text-slate-500 font-medium">FINANCIAL PORTAL</span>
              </div>
            </Link>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Área Restrita
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Acesse sua conta para continuar navegando
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Corporativo
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Senha de Acesso
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
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
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Acessando...</span>
                    </div>
                  ) : (
                    'Acessar Plataforma'
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">
                    Ainda não possui acesso?
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    Solicitar Credenciais
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span>← Voltar ao portal principal</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Plataforma segura protegida por criptografia SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
