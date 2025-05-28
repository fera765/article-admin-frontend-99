
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCategories } from '@/hooks/useCategories';
import { apiClient } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { Article } from '@/types';
import TextEditor from './TextEditor';
import ImageUpload from './ImageUpload';
import ImprovedTagsInput from './ImprovedTagsInput';
import AuthorSelect from './AuthorSelect';
import DateTimePicker from './DateTimePicker';
import ArticleFormSection from './ArticleFormSection';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArticleFormProps {
  article?: Article | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || [];

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

  const { watch } = form;
  const formValues = watch();

  const isFormValid = formValues.title && formValues.summary && formValues.content && formValues.category && formValues.author;

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      const articleData = {
        ...data,
        publishDate: data.publishDate ? data.publishDate.toISOString() : new Date().toISOString(),
      };

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">
            {article ? 'Editar Artigo' : 'Novo Artigo'}
          </h2>
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Basic Information */}
              <ArticleFormSection title="Informações Básicas">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Digite um resumo do artigo" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ArticleFormSection>

              {/* Content */}
              <ArticleFormSection title="Conteúdo do Artigo">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Digite o conteúdo completo do artigo usando Markdown..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ArticleFormSection>

              {/* Metadata */}
              <ArticleFormSection title="Categoria e Autor">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
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
              </ArticleFormSection>

              {/* Media */}
              <ArticleFormSection title="Imagem e Tags">
                <div className="space-y-4">
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
                          <ImprovedTagsInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ArticleFormSection>

              {/* Publishing Settings */}
              <ArticleFormSection title="Configurações de Publicação">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <p className="text-sm text-muted-foreground">
                            Artigo em destaque
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
                </div>
              </ArticleFormSection>

            </form>
          </Form>
        </div>
      </ScrollArea>

      {/* Footer with Actions */}
      <div className="flex-shrink-0 border-t p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading || !isFormValid} 
            className="bg-red-600 hover:bg-red-700 order-2 sm:order-1"
          >
            {loading ? 'Salvando...' : article ? 'Atualizar Artigo' : 'Criar Artigo'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="order-1 sm:order-2"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
