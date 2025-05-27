
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, TrendingUp, BarChart3, DollarSign, UserPlus, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email corporativo é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/login', {
        state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
      });
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TrendingUp className="absolute top-32 right-1/4 w-8 h-8 text-emerald-300/40 animate-pulse" />
        <BarChart3 className="absolute top-20 left-1/4 w-6 h-6 text-blue-300/40 animate-pulse delay-1000" />
        <DollarSign className="absolute bottom-32 right-1/3 w-7 h-7 text-indigo-300/40 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-xl">FN</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-left">
                <span className="block text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  FinanceNews
                </span>
                <span className="block text-xs text-slate-500 font-medium">FINANCIAL PORTAL</span>
              </div>
            </Link>
          </div>

          {/* Register Card */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Solicitar Acesso
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Crie sua conta para acessar conteúdo exclusivo
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span>⚠</span>
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

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
                    className={`h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span>⚠</span>
                      <span>{errors.email}</span>
                    </p>
                  )}
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
                      className={`h-11 pr-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm ${errors.password ? 'border-red-500' : ''}`}
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
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span>⚠</span>
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-11 pr-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span>⚠</span>
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Criar Conta</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">
                    Já possui uma conta?
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    Fazer Login
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
              Seus dados estão protegidos por criptografia de ponta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
