
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  status: 'published' | 'draft';
  publishDate: string;
  imageUrl: string;
  tags: string[];
  isDetach: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  likes: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
}

export interface ViewStats {
  id: string;
  articleId: string;
  count: number;
  likes: number;
  bookmarks: number;
  comments: number;
  lastUpdated: string;
}

export interface Settings {
  id: string;
  seo: {
    siteTitle: string;
    siteDescription: string;
    siteKeywords: string;
    siteFavicon: string;
    siteImage: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  tracking: {
    googleAnalytics: string;
    facebookPixel: string;
    tiktokPixel: string;
    customHeadCode: string;
    customBodyCode: string;
  };
  stockTicker: {
    enabled: boolean;
    autoRefreshInterval: number;
    maxStocksToShow: number;
    symbols: Array<{
      symbol: string;
      name: string;
      enabled: boolean;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface Like {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
}
