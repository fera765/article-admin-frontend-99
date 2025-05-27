
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, UserPlus, ArrowRight, CheckCircle, TrendingUp, Shield } from 'lucide-react';

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
      newErrors.email = 'Email é obrigatório';
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
      // Redirecionar para login após cadastro bem-sucedido
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

          {/* Register Card */}
          <Card className="border border-slate-200 shadow-xl bg-white">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                <UserPlus className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                Criar Conta
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Junte-se ao portal financeiro mais confiável
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
                    className={`h-11 border-slate-200 focus:border-red-500 focus:ring-red-500/20 bg-white transition-all duration-200 ${errors.name ? 'border-red-500' : ''}`}
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
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 border-slate-200 focus:border-red-500 focus:ring-red-500/20 bg-white transition-all duration-200 ${errors.email ? 'border-red-500' : ''}`}
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
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`h-11 pr-12 border-slate-200 focus:border-red-500 focus:ring-red-500/20 bg-white transition-all duration-200 ${errors.password ? 'border-red-500' : ''}`}
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
                      className={`h-11 pr-12 border-slate-200 focus:border-red-500 focus:ring-red-500/20 bg-white transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
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
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0 mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Criar Conta</span>
                      <ArrowRight className="w-4 h-4" />
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
                    className="inline-flex items-center px-6 py-3 border-2 border-red-200 rounded-xl text-sm font-medium text-red-700 bg-red-50/50 hover:bg-red-100/50 hover:border-red-300 transition-all duration-200"
                  >
                    Fazer Login
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
                Dados protegidos com criptografia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
