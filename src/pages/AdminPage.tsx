
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Eye } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';
import { Article } from '@/types';
import ArticleForm from '@/components/ArticleForm';

const AdminPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { articles, isLoading } = useArticles();

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedArticle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando artigos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administração de Artigos</h1>
          <p className="text-muted-foreground">Gerencie seus artigos aqui</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar artigos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente buscar com termos diferentes.' : 'Comece criando seu primeiro artigo.'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Artigo
              </Button>
            )}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {article.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>Categoria: {article.category}</p>
                    <p>Data: {formatDate(article.publishDate)}</p>
                  </div>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
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

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(article)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ArticleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        article={selectedArticle}
      />
    </div>
  );
};

export default AdminPage;
