import React, { useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useEditors } from '@/hooks/useEditors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Calendar
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { Article } from '@/types';
import ArticleForm from '@/components/Admin/ArticleForm';
import DeleteConfirmDialog from '@/components/Admin/DeleteConfirmDialog';

const AdminArticles: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    article: Article | null;
    loading: boolean;
  }>({
    open: false,
    article: null,
    loading: false,
  });
  
  const articlesPerPage = 20;
  const queryClient = useQueryClient();
  
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    page: currentPage,
    limit: articlesPerPage,
    search: searchTerm,
    category: selectedCategory,
    author: selectedAuthor,
  });
  
  const { data: categoriesData } = useCategories();
  const { data: editorsData = [] } = useEditors();
  
  const articles = articlesData?.articles || [];
  const totalArticles = articlesData?.total || 0;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const categories = categoriesData?.categories || [];
  
  // Use editors from the API instead of extracting from articles
  const authors = editorsData.map(editor => editor.name);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  const handleEditArticle = async (article: Article) => {
    try {
      const response = await fetch(`${apiClient.baseURL}/articles/${article.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const fullArticle = await response.json();
        setEditingArticle(fullArticle);
        setIsFormOpen(true);
      } else {
        toast({
          title: 'Erro ao carregar artigo',
          description: 'Não foi possível carregar os dados do artigo.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: 'Erro ao carregar artigo',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteArticle = (article: Article) => {
    setDeleteDialog({
      open: true,
      article,
      loading: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.article) return;

    setDeleteDialog(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${apiClient.baseURL}/articles/${deleteDialog.article.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Artigo excluído com sucesso!',
          description: 'O artigo foi removido permanentemente.',
        });
        
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        setDeleteDialog({ open: false, article: null, loading: false });
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Erro ao excluir artigo',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
    queryClient.invalidateQueries({ queryKey: ['articles'] });
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  if (articlesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Artigos</h1>
          <p className="text-slate-600 mt-1">
            Gerencie todos os artigos do sistema
          </p>
        </div>
        
        <Button onClick={handleNewArticle} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título ou resumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="lg:w-64">
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
          
          <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
            <SelectTrigger className="lg:w-64">
              <SelectValue placeholder="Todos os autores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os autores</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-slate-500">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum artigo encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                        {article.summary}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(article.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">
                      {article.author || 'Sem autor'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={article.status === 'published' ? 'default' : 'secondary'}
                      className={article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDateDisplay(article.publishDate || article.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteArticle(article)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-slate-500 text-center">
        Exibindo {articles.length} de {totalArticles} artigos
      </div>

      {/* Article Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          setEditingArticle(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
            </DialogTitle>
          </DialogHeader>
          <ArticleForm
            article={editingArticle}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !deleteDialog.loading && setDeleteDialog(prev => ({ ...prev, open }))}
        title="Excluir Artigo"
        description={`Tem certeza que deseja excluir o artigo "${deleteDialog.article?.title}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        loading={deleteDialog.loading}
      />
    </div>
  );
};

export default AdminArticles;
