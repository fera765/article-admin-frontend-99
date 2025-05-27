
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/utils/api';
import { Article, Category } from '@/types';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const HomePage = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured articles (isDetach = true)
        const articles = await apiClient.getArticles(1, 20);
        const featured = articles.filter((article: Article) => article.isDetach).slice(0, 3);
        const recent = articles.filter((article: Article) => !article.isDetach).slice(0, 6);
        
        setFeaturedArticles(featured);
        setRecentArticles(recent);

        // Load categories
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
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bem-vindo ao nosso{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra artigos incríveis sobre tecnologia, desenvolvimento e as últimas 
              tendências do mundo digital. Conhecimento que transforma.
            </p>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={article.imageUrl || '/placeholder.svg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Destaque
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      <Link to={`/articles/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(article.publishDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Autor</span>
                        </div>
                      </div>
                      <Link 
                        to={`/articles/${article.id}`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <span>Ler mais</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Artigos Recentes</h2>
              <p className="text-gray-600">Confira nossos últimos conteúdos</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/articles">
                Ver todos os artigos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={article.imageUrl || '/placeholder.svg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    <Link to={`/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <Link 
                      to={`/articles/${article.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ler →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore por Categoria</h2>
              <p className="text-gray-600">Encontre conteúdo do seu interesse</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Não perca nenhum conteúdo
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Inscreva-se em nossa newsletter e receba os melhores artigos direto no seu email.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Inscrever-se na Newsletter
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
