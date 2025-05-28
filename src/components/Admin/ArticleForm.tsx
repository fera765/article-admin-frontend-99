
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCategories } from '@/hooks/useCategories';
import { useEditors } from '@/hooks/useEditors';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { Article } from '@/types';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import TagsInput from './TagsInput';
import AuthorSelect from './AuthorSelect';
import DateTimePicker from './DateTimePicker';

interface ArticleFormProps {
  article?: Article | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);
  
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: editorsData = [], isLoading: editorsLoading, error: editorsError } = useEditors();
  
  const categories = categoriesData?.categories || [];

  console.log('ArticleForm render - Categories:', categories.length, 'Editors:', editorsData.length);
  console.log('Loading states - Categories:', categoriesLoading, 'Editors:', editorsLoading);
  console.log('Errors - Categories:', categoriesError, 'Editors:', editorsError);

  const form = useForm({
    defaultValues: {
      title: article?.title || '',
      summary: article?.summary || '',
      content: article?.content || '',
      category: article?.category || '',
      author: article?.author || '',
      imageUrl: article?.imageUrl || '',
      tags: article?.tags || [],
      status: article?.status || 'draft',
      isDetach: article?.isDetach || false,
      publishDate: article?.publishDate ? new Date(article.publishDate) : new Date(),
    },
  });

  const { watch, setValue } = form;
  const formValues = watch();

  // Wait for dependencies to load before showing form
  useEffect(() => {
    console.log('Checking form readiness...');
    if (!categoriesLoading && !editorsLoading) {
      console.log('Dependencies loaded, form ready');
      setFormReady(true);
    }
  }, [categoriesLoading, editorsLoading]);

  // Helper function to check if content has meaningful text
  const hasValidContent = (content: string) => {
    if (!content) return false;
    // Remove HTML tags and check if there's actual text content
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };

  // Verificar se campos obrigatórios estão preenchidos
  const isFormValid = 
    formValues.title && 
    formValues.summary && 
    hasValidContent(formValues.content) && 
    formValues.category && 
    formValues.author;

  const onSubmit = async (data: any) => {
    // Validate content before submission
    if (!hasValidContent(data.content)) {
      toast({
        title: 'Conteúdo obrigatório',
        description: 'O campo de conteúdo não pode estar vazio.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const articleData = {
        ...data,
        publishDate: data.publishDate ? data.publishDate.toISOString() : new Date().toISOString(),
      };

      console.log('Submitting article data:', articleData);

      if (article) {
        await apiClient.updateArticle(article.id, articleData);
        toast({
          title: 'Artigo atualizado com sucesso!',
          description: 'As alterações foram salvas.',
        });
      } else {
        await apiClient.createArticle(articleData);
        toast({
          title: 'Artigo criado com sucesso!',
          description: 'O novo artigo foi adicionado.',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: 'Erro ao salvar artigo',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while dependencies are loading
  if (!formReady) {
    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando formulário...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there are critical errors
  if (categoriesError || editorsError) {
    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar dados necessários</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            rules={{ required: 'O título é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título do artigo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            rules={{ required: 'O resumo é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resumo *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Digite um resumo do artigo" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            rules={{ 
              required: 'O conteúdo é obrigatório',
              validate: (value) => hasValidContent(value) || 'O conteúdo não pode estar vazio'
            }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Digite o conteúdo completo do artigo"
                    label="Conteúdo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              rules={{ required: 'A categoria é obrigatória' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              rules={{ required: 'O autor é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AuthorSelect
                      value={field.value}
                      onChange={field.onChange}
                      label="Autor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    label="Imagem de Capa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publishDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDetach"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Destacar</FormLabel>
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
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={loading || !isFormValid} 
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Salvando...' : article ? 'Atualizar' : 'Criar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleForm;
