
import React, { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  Calendar
} from 'lucide-react';
import { Category } from '@/types';
import CategoryForm from '@/components/Admin/CategoryForm';
import DeleteConfirmDialog from '@/components/Admin/DeleteConfirmDialog';

const AdminCategories: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({
    open: false,
    category: null,
  });
  
  const categoriesPerPage = 20;
  const deleteCategoryMutation = useDeleteCategory();
  
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    search: searchTerm,
  });
  
  const categories = categoriesData?.categories || [];
  const totalCategories = categoriesData?.total || 0;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);
  
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const endIndex = startIndex + categoriesPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);
  
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

  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteDialog({
      open: true,
      category,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.category) return;

    try {
      await deleteCategoryMutation.mutateAsync(deleteDialog.category.id);
      setDeleteDialog({ open: false, category: null });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  if (categoriesLoading) {
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
          <h1 className="text-3xl font-bold text-slate-900">Categorias</h1>
          <p className="text-slate-600 mt-1">
            Gerencie todas as categorias do sistema
          </p>
        </div>
        
        <Button onClick={handleNewCategory} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="text-slate-500">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma categoria encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <span className="font-semibold text-slate-900">
                      {category.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600 line-clamp-2">
                      {category.description || 'Sem descrição'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.active ? 'default' : 'secondary'}
                      className={category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {category.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDateDisplay(category.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={deleteCategoryMutation.isPending}
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
        Exibindo {paginatedCategories.length} de {totalCategories} categorias
      </div>

      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <CategoryForm
            category={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !deleteCategoryMutation.isPending && setDeleteDialog(prev => ({ ...prev, open }))}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria "${deleteDialog.category?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        loading={deleteCategoryMutation.isPending}
      />
    </div>
  );
};

export default AdminCategories;
