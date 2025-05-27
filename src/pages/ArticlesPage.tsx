import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/utils/api';
import { Article, Category } from '@/types';
import { Calendar, User, Search, ArrowRight, Filter, Clock, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const articlesPerPage = 12;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await apiClient.getActiveCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getArticles(currentPage, articlesPerPage);
        
        // Filter articles based on search and category
        let filteredArticles = data.filter((article: Article) => article.status === 'published');
        
        if (searchTerm) {
          filteredArticles = filteredArticles.filter((article: Article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }

        if (selectedCategory && selectedCategory !== 'all') {
          filteredArticles = filteredArticles.filter((article: Article) =>
            article.category === selectedCategory
          );
        }

        setArticles(filteredArticles);
        setTotalPages(Math.ceil(filteredArticles.length / articlesPerPage));
      } catch (error) {
        console.error('Error loading articles:', error);
        toast({
          title: "Erro ao carregar artigos",
          description: "Houve um problema ao carregar os artigos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentPage, searchTerm, selectedCategory]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

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

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoria';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Todas as Notícias
            </h1>
            <p className="text-lg text-slate-600">
              Mantenha-se atualizado com as últimas notícias do mercado financeiro
            </p>
          </div>

          {/* Filters */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="md:w-64 bg-white border-slate-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-slate-600 mb-6">
              Tente ajustar seus filtros ou termos de busca.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            {/* Featured Articles */}
            {articles.filter(article => article.isDetach).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-red-600 pl-3">
                  Notícias em Destaque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {articles.filter(article => article.isDetach).slice(0, 3).map((article) => (
                    <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={article.imageUrl || '/placeholder.svg'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-600 text-white">
                            DESTAQUE
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                            {getCategoryName(article.category)}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                          <Link to={`/articles/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(article.publishDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(article.publishDate)}</span>
                            </div>
                          </div>
                          <Link 
                            to={`/articles/${article.id}`}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium"
                          >
                            <span>Ler</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-red-600 pl-3">
                Últimas Notícias
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.filter(article => !article.isDetach).map((article) => (
                  <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 bg-white border-slate-200">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={article.imageUrl || '/placeholder.svg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                          {getCategoryName(article.category)}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        <Link to={`/articles/${article.id}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(article.publishDate)}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/articles/${article.id}`}
                          className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                        >
                          <span>Ler</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="border-slate-300 text-slate-700"
                  >
                    Anterior
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-red-600 hover:bg-red-700" : "border-slate-300 text-slate-700"}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="border-slate-300 text-slate-700"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
