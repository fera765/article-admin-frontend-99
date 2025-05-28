
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category } from '@/types';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      active: category?.active ?? true,
    },
  });

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      // Validação básica
      if (!data.name.trim() || !data.description.trim()) {
        form.setError('name', { message: 'Nome é obrigatório' });
        form.setError('description', { message: 'Descrição é obrigatória' });
        return;
      }

      const categoryData = {
        name: data.name.trim(),
        description: data.description.trim(),
        active: data.active,
      };

      if (category) {
        await updateCategoryMutation.mutateAsync({ id: category.id, categoryData });
      } else {
        await createCategoryMutation.mutateAsync(categoryData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {category ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ 
              required: 'Nome é obrigatório',
              minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o nome da categoria" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            rules={{ 
              required: 'Descrição é obrigatória',
              minLength: { value: 5, message: 'Descrição deve ter pelo menos 5 caracteres' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Digite a descrição da categoria" 
                    {...field} 
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Categoria Ativa</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Categorias ativas aparecerão no site
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Salvando...' : category ? 'Atualizar' : 'Criar'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
