
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { useArticles, CreateArticleData } from '@/hooks/useArticles';
import { Article } from '@/types';
import MarkdownEditor from './MarkdownEditor';
import TagInput from './TagInput';
import { useToast } from '@/hooks/use-toast';

interface ArticleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
}

interface FormData {
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  status: 'published' | 'draft';
}

const ArticleForm: React.FC<ArticleFormProps> = ({ open, onOpenChange, article }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const { toast } = useToast();
  const { createArticle, updateArticle, isCreating, isUpdating } = useArticles();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      summary: '',
      category: '',
      imageUrl: '',
      status: 'draft'
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getActiveCategories(),
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (article) {
      setValue('title', article.title);
      setValue('summary', article.summary);
      setValue('category', article.category);
      setValue('imageUrl', article.imageUrl || '');
      setValue('status', article.status);
      setContent(article.content);
      setTags(article.tags || []);
    } else {
      reset();
      setContent('');
      setTags([]);
    }
  }, [article, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo do artigo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!data.category) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    const articleData: CreateArticleData = {
      title: data.title,
      content: content,
      summary: data.summary,
      category: data.category,
      author: "editor-id", // This should come from auth context
      status: data.status,
      publishDate: new Date().toISOString(),
      imageUrl: data.imageUrl || "/uploads/default.jpg",
      tags: tags,
      isDetach: true
    };

    console.log('Submitting article data:', articleData);

    if (article) {
      updateArticle({ id: article.id, data: articleData });
    } else {
      createArticle(articleData);
    }

    onOpenChange(false);
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...register('title', { required: 'Título é obrigatório' })}
            placeholder="Digite o título do artigo"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="summary">Resumo *</Label>
          <Input
            id="summary"
            {...register('summary', { required: 'Resumo é obrigatório' })}
            placeholder="Breve descrição do artigo"
          />
          {errors.summary && (
            <p className="text-sm text-red-500 mt-1">{errors.summary.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={watch('category')} onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={watch('status')} onValueChange={(value) => setValue('status', value as 'published' | 'draft')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <Label>Tags</Label>
          <TagInput tags={tags} onTagsChange={setTags} />
        </div>

        <div>
          <Label>Conteúdo *</Label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Escreva o conteúdo do seu artigo em Markdown..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? 'Salvando...' : (article ? 'Atualizar' : 'Criar Artigo')}
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>
              {article ? 'Editar Artigo' : 'Novo Artigo'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <FormContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 'Editar Artigo' : 'Novo Artigo'}
          </DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default ArticleForm;
