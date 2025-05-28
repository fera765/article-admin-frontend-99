
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor' || user?.role === 'admin';

  // Inicialização - executar apenas uma vez
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Verificar se o token ainda é válido
          try {
            const response = await apiClient.getCurrentUser();
            if (response.user) {
              setToken(savedToken);
              setUser(response.user);
              // Atualizar dados no localStorage se necessário
              localStorage.setItem('user', JSON.stringify(response.user));
            } else {
              throw new Error('Invalid token');
            }
          } catch (error) {
            // Token inválido, usar dados salvos localmente
            console.warn('Token validation failed, using saved data:', error);
            setToken(savedToken);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          // Limpar dados corrompidos
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []); // Array vazio para executar apenas uma vez

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login(email, password);
      
      // A API retorna: token, name, email, avatar, role, total_favorites, total_likes
      const { token: newToken, ...userData } = response;
      
      // Salvar no localStorage primeiro
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Depois atualizar o estado
      setToken(newToken);
      setUser(userData);
      
      // Toast de sucesso
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${userData.name}!`,
      });
      
      // Debug: verificar se foi salvo
      console.log('Login successful:', {
        token: newToken,
        user: userData,
        localStorage: {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar estado primeiro
    setToken(null);
    setUser(null);
    
    // Depois limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  // Debug: useEffect para monitorar mudanças no user
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

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
