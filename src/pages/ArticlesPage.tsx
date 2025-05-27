import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/utils/api';
import { Article, Category } from '@/types';
import { Calendar, User, Search, ArrowRight, Filter } from 'lucide-react';
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
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando artigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todos os Artigos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção completa de artigos sobre tecnologia, desenvolvimento e inovação.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
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

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar seus filtros ou termos de busca.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 bg-white">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={article.imageUrl || '/placeholder.svg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.isDetach && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          Destaque
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryName(article.category)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link to={`/articles/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.summary}
                    </p>
                    
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(article.publishDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Autor</span>
                        </div>
                      </div>
                      <Link 
                        to={`/articles/${article.id}`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <span>Ler</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
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
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
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
