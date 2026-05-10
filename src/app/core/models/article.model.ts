export interface Article {
  id: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  author?: string;
  category?: string;
  isFavorite: boolean;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface NewsApiError {
  status: string;
  code: string;
  message: string;
}

export type NewsCategory =
  | 'политика'
  | 'экономика'
  | 'технологии'
  | 'спорт'
  | 'мир'
  | 'общество'
  | 'здоровье'
  | 'наука';

export interface NewsFilters {
  category?: NewsCategory;
  source?: string;
  sortBy?: 'publishedAt' | 'relevancy';
}

export interface NewsState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: NewsFilters;
  totalResults: number;
}
