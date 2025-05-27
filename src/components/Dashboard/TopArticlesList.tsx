
import React from 'react';
import { Eye, Heart, Bookmark } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  views?: number;
  likes?: number;
  bookmarks?: number;
}

interface TopArticlesListProps {
  title: string;
  articles: Article[];
  type: 'views' | 'likes' | 'bookmarks';
  loading?: boolean;
}

const TopArticlesList: React.FC<TopArticlesListProps> = ({ 
  title, 
  articles, 
  type, 
  loading = false 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'views': return Eye;
      case 'likes': return Heart;
      case 'bookmarks': return Bookmark;
    }
  };

  const getValue = (article: Article) => {
    switch (type) {
      case 'views': return article.views || 0;
      case 'likes': return article.likes || 0;
      case 'bookmarks': return article.bookmarks || 0;
    }
  };

  const Icon = getIcon();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Icon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <Icon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum artigo encontrado</p>
        ) : (
          articles.map((article, index) => (
            <div 
              key={article.id} 
              className="flex justify-between items-start p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-gray-400 mr-2">
                    #{index + 1}
                  </span>
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {article.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-600">
                  {article.author} • {article.category}
                </p>
              </div>
              
              <div className="flex items-center ml-4">
                <Icon className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm font-semibold text-gray-900">
                  {getValue(article).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopArticlesList;
