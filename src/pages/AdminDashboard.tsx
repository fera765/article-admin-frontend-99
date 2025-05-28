
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStats, useTopArticles, useRefreshStats } from '@/hooks/useAdminData';
import StatsCard from '@/components/Dashboard/StatsCard';
import TopArticlesList from '@/components/Dashboard/TopArticlesList';
import DashboardCharts from '@/components/Dashboard/DashboardCharts';
import { FileText, Users, Grid3x3, Mail, RefreshCw, Plus, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useAdminStats();
  
  const { 
    data: topArticles, 
    isLoading: topArticlesLoading 
  } = useTopArticles();

  const refreshStats = useRefreshStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshStats();
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

  console.log('AdminDashboard renderizando:', { user, stats, topArticles });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Bem-vindo de volta, {user?.name}!
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Artigos"
          value={stats?.totalArticles || 0}
          icon={FileText}
          loading={statsLoading}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatsCard
          title="Total de Usuários"
          value={stats?.totalUsers || 0}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Análise de Dados
        </h3>
        <DashboardCharts />
      </div>

      {/* Ações Rápidas e Notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900">Criar Novo Artigo</div>
                <div className="text-sm text-blue-600">Publicar conteúdo rapidamente</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-green-200 hover:bg-green-50"
            >
              <Plus className="h-5 w-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900">Nova Categoria</div>
                <div className="text-sm text-green-600">Organizar melhor o conteúdo</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-purple-200 hover:bg-purple-50"
            >
              <Users className="h-5 w-5 mr-3 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-purple-900">Gerenciar Usuários</div>
                <div className="text-sm text-purple-600">Administrar permissões</div>
              </div>
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notificações Recentes
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <div className="text-sm font-medium text-yellow-800">
                {stats?.newsletterStats?.total || 0} novas inscrições na newsletter
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                Última atualização
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="text-sm font-medium text-green-800">
                {stats?.totalArticles || 0} artigos publicados
              </div>
              <div className="text-xs text-green-600 mt-1">
                Total atual
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="text-sm font-medium text-blue-800">
                Sistema funcionando normalmente
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Status atualizado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
