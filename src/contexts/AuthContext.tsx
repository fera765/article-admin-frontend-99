
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  total_favorites: number;
  total_likes: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor' || user?.role === 'admin';

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await apiClient.getCurrentUser();
          if (response.user) {
            setUser(response.user);
            // Salvar dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } else {
        // Tentar recuperar dados do usuário do localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      
      // A API retorna: token, name, email, avatar, role, total_favorites, total_likes
      const { token: newToken, ...userData } = response;
      
      // Salvar token e dados do usuário no localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Atualizar estado
      setToken(newToken);
      setUser(userData);
      
      // Toast de sucesso com nome do usuário
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${userData.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiClient.register(name, email, password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Faça login para continuar.",
      });
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar a conta.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    // Limpar localStorage completamente
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      loading,
      isAuthenticated,
      isAdmin,
      isEditor,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
