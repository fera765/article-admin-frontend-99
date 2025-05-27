
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/utils/api';
import { Article, Category } from '@/types';
import { Calendar, User, Eye, ArrowRight, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const HomePage = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const articles = await apiClient.getArticles(1, 20);
        const featured = articles.filter((article: Article) => article.isDetach).slice(0, 4);
        const recent = articles.filter((article: Article) => !article.isDetach).slice(0, 8);
        
        setFeaturedArticles(featured);
        setRecentArticles(recent);

        const categoriesData = await apiClient.getActiveCategories();
        setCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error('Error loading homepage data:', error);
        toast({
          title: "Erro ao carregar conteúdo",
          description: "Houve um problema ao carregar os dados da página.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breaking News Banner */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Badge className="bg-white text-red-600 font-bold text-xs px-2 py-1">
              URGENT
            </Badge>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm animate-pulse">
                Banco Central mantém taxa Selic em 11,25% • Dólar fecha em alta de 1,2% • Ibovespa opera em queda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Featured News - Left Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-red-600 pl-3">
                Principais Notícias
              </h2>
              <Button variant="ghost" className="text-red-600 hover:text-red-700">
                Ver todas <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Hero Article */}
            {featuredArticles[0] && (
              <Card className="mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={featuredArticles[0].imageUrl || '/placeholder.svg'}
                    alt={featuredArticles[0].title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="bg-red-600 text-white mb-3">
                      DESTAQUE
                    </Badge>
                    <h1 className="text-2xl font-bold mb-2 line-clamp-2">
                      <Link to={`/articles/${featuredArticles[0].id}`} className="hover:text-red-400 transition-colors">
                        {featuredArticles[0].title}
                      </Link>
                    </h1>
                    <p className="text-slate-200 text-sm line-clamp-2 mb-3">
                      {featuredArticles[0].summary}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-300">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(featuredArticles[0].publishDate)}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(featuredArticles[0].publishDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Secondary Featured Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.slice(1, 3).map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={article.imageUrl || '/placeholder.svg'}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-600 text-white text-xs">
                        DESTAQUE
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                      <Link to={`/articles/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(article.publishDate)}
                      </span>
                      <Link 
                        to={`/articles/${article.id}`}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center"
                      >
                        Ler <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Market Data Widget */}
            <Card className="bg-slate-900 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Mercados em Tempo Real
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-sm">IBOVESPA</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">127.432</div>
                      <div className="text-xs text-green-400">+2.35%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-sm">USD/BRL</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">5.84</div>
                      <div className="text-xs text-red-400">-0.15%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-sm">Bitcoin</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">$67,432</div>
                      <div className="text-xs text-green-400">+3.21%</div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4 text-white hover:bg-slate-800">
                  Ver Mais Cotações
                </Button>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-red-600 pl-3">
                  Últimas Notícias
                </h3>
                <div className="space-y-4">
                  {recentArticles.slice(0, 5).map((article) => (
                    <div key={article.id} className="border-b border-slate-200 pb-3 last:border-b-0">
                      <h4 className="text-sm font-medium text-slate-900 hover:text-red-600 transition-colors line-clamp-2 mb-1">
                        <Link to={`/articles/${article.id}`}>
                          {article.title}
                        </Link>
                      </h4>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(article.publishDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-red-600 text-red-600 hover:bg-red-50">
                  Ver Todas as Notícias
                </Button>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Newsletter Diária</h3>
                <p className="text-sm text-red-100 mb-4">
                  Receba as principais notícias do mercado financeiro direto no seu email.
                </p>
                <Button 
                  className="w-full bg-white text-red-600 hover:bg-red-50"
                  onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Inscrever-se Grátis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-red-600 pl-3">
              Explore por Categoria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="text-center p-4 hover:shadow-lg transition-all duration-300 group-hover:bg-red-50 border hover:border-red-200">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors text-sm">
                      {category.name}
                    </h3>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
