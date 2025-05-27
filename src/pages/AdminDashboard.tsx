
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useTopArticles } from '@/hooks/useDashboardData';
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';
import StatsCard from '@/components/Dashboard/StatsCard';
import TopArticlesList from '@/components/Dashboard/TopArticlesList';
import DashboardCharts from '@/components/Dashboard/DashboardCharts';
import { FileText, Users, Grid3x3, Mail, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useDashboardStats();
  
  const { 
    data: topArticles, 
    isLoading: topArticlesLoading 
  } = useTopArticles();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh manual das estatísticas
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/views/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      await refetchStats();
      
      toast({
        title: "Dados atualizados",
        description: "As estatísticas foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as estatísticas.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo de volta, {user?.name}!
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Artigos"
            value={stats?.totalArticles || 0}
            icon={FileText}
            loading={statsLoading}
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatsCard
            title="Total de Usuários"
            value={stats?.totalUsers || 156}
            icon={Users}
            loading={statsLoading}
            trend={{ value: 8, isPositive: true }}
          />
          
          <StatsCard
            title="Categorias Ativas"
            value={stats?.totalCategories || 0}
            icon={Grid3x3}
            loading={statsLoading}
          />
          
          <StatsCard
            title="Newsletter"
            value={stats?.newsletterStats?.total || 0}
            icon={Mail}
            loading={statsLoading}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Top 5 Artigos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TopArticlesList
            title="Mais Visualizados"
            articles={topArticles?.mostViewed || []}
            type="views"
            loading={topArticlesLoading}
          />
          
          <TopArticlesList
            title="Mais Curtidos"
            articles={topArticles?.mostLiked || []}
            type="likes"
            loading={topArticlesLoading}
          />
          
          <TopArticlesList
            title="Mais Salvos"
            articles={topArticles?.mostBookmarked || []}
            type="bookmarks"
            loading={topArticlesLoading}
          />
        </div>

        {/* Gráficos */}
        <DashboardCharts />

        {/* Notificações e Ações Rápidas */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                <div className="font-medium text-blue-900">Criar Novo Artigo</div>
                <div className="text-sm text-blue-600">Publicar conteúdo rapidamente</div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">
                <div className="font-medium text-green-900">Nova Categoria</div>
                <div className="text-sm text-green-600">Organizar melhor o conteúdo</div>
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">
                <div className="font-medium text-purple-900">Gerenciar Usuários</div>
                <div className="text-sm text-purple-600">Administrar permissões</div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notificações Recentes
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                <div className="text-sm font-medium text-yellow-800">
                  5 novos comentários pendentes
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  Há 2 horas
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                <div className="text-sm font-medium text-green-800">
                  12 novas inscrições na newsletter
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Hoje
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <div className="text-sm font-medium text-blue-800">
                  Backup automático concluído
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Ontem
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
