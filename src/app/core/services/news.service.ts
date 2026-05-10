import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Article, NewsFilters, NewsCategory } from '../models/article.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom, from } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { stripHtmlTags } from './text-utils';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private articlesSignal = signal<Article[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private searchQuerySignal = signal('');
  private filtersSignal = signal<NewsFilters>({});
  private totalResultsSignal = signal(0);
  private currentPageSignal = signal(1);
  private customArticlesSignal = signal<Article[]>([]);
  private readonly CUSTOM_ARTICLES_KEY = 'customArticles';
  private readonly categoryApiMap: Record<NewsCategory, string> = {
    политика: 'general',
    экономика: 'business',
    технологии: 'technology',
    спорт: 'sports',
    мир: 'general',
    общество: 'general',
    здоровье: 'health',
    наука: 'science'
  };

  articles = computed(() => this.articlesSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  searchQuery = computed(() => this.searchQuerySignal());
  filters = computed(() => this.filtersSignal());
  totalResults = computed(() => this.totalResultsSignal());
  currentPage = computed(() => this.currentPageSignal());
  customArticles = computed(() => this.customArticlesSignal());

  // Search debounce
  private searchSubject = new Subject<string>();
  private lastSearchQuery = '';
  private readonly DEBOUNCE_TIME = 350;

  constructor(private http: HttpClient) {
    this.initSearchDebounce();
    this.loadCustomArticles();
    this.loadFavorites();
  }

  private initSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        switchMap(query => {
          if (this.lastSearchQuery !== query) {
            this.lastSearchQuery = query;
            this.searchQuerySignal.set(query);
            this.currentPageSignal.set(1);
            return from(this.performSearch());
          }
          return of(null);
        }),
        catchError(error => {
          console.error('Search error:', error);
          this.errorSignal.set('Ошибка при поиске. Попробуйте позже.');
          return of(null);
        })
      )
      .subscribe();
  }

  private async performSearch(): Promise<any> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await this.fetchNews();
      
      let articles = response.articles.map((article: any) => {
        const { content, ...rest } = article;
        const title = stripHtmlTags(article.title || '');
        const description = stripHtmlTags(article.description || '');

        return {
          ...rest,
          id: this.generateArticleId(article),
          title,
          description,
          isFavorite: this.isFavorite(article.url)
        };
      });

      articles = this.mergeWithCustomArticles(articles);
      articles = this.applySort(articles);
      this.articlesSignal.set(articles);
      this.totalResultsSignal.set(response.totalResults);
    } catch (error) {
      this.errorSignal.set('Ошибка при загрузке новостей. Попробуйте позже.');
      console.error('News loading error:', error);
    } finally {
      this.loadingSignal.set(false);
    }
    
    return null;
  }

  setSearchQuery(query: string): void {
    this.searchSubject.next(query);
  }

  addCustomArticle(article: Article): void {
    const existing = this.customArticlesSignal();
    this.customArticlesSignal.set([...existing, article]);
    this.saveCustomArticles();
    this.loadNews();
  }

  isCustomArticle(article: Article): boolean {
    return this.customArticlesSignal().some(custom => custom.id === article.id);
  }

  deleteCustomArticle(articleId: string): void {
    const existing = this.customArticlesSignal();
    this.customArticlesSignal.set(existing.filter(article => article.id !== articleId));
    this.saveCustomArticles();
    this.loadNews();
  }

  setFilters(filters: NewsFilters): void {
    this.filtersSignal.set(filters);
    this.currentPageSignal.set(1);
    this.loadNews();
  }

  async loadNews(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const response = await this.fetchNews();
      
      let articles = response.articles.map((article: any) => {
        const { content, ...rest } = article;
        const title = stripHtmlTags(article.title || '');
        const description = stripHtmlTags(article.description || '');

        return {
          ...rest,
          id: this.generateArticleId(article),
          title,
          description,
          isFavorite: this.isFavorite(article.url)
        };
      });

      articles = this.mergeWithCustomArticles(articles);
      articles = this.applySort(articles);
      this.articlesSignal.set(articles);
      this.totalResultsSignal.set(response.totalResults);
    } catch (error) {
      this.errorSignal.set('Ошибка при загрузке новостей. Попробуйте позже.');
      console.error('News loading error:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private mergeWithCustomArticles(apiArticles: Article[]): Article[] {
    const query = this.searchQuerySignal();
    const filters = this.filtersSignal();
    const customArticles = this.filterCustomArticles(query, filters);

    const filteredApi = apiArticles.filter(apiArticle =>
      !customArticles.some(customArticle =>
        customArticle.id === apiArticle.id || customArticle.url === apiArticle.url
      )
    );

    return [...customArticles, ...filteredApi];
  }

  private filterCustomArticles(query: string, filters: NewsFilters): Article[] {
    const customArticles = this.customArticlesSignal();
    const normalizedQuery = query?.trim().toLowerCase();

    return customArticles.filter(article => {
      if (filters.category && article.category !== filters.category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const fields = [article.title, article.description, article.content, article.author, article.source.name];
      return fields.some(field => field?.toLowerCase().includes(normalizedQuery));
    });
  }

  private loadCustomArticles(): void {
    const stored = localStorage.getItem(this.CUSTOM_ARTICLES_KEY);
    if (stored) {
      this.customArticlesSignal.set(JSON.parse(stored));
    }
  }

  private saveCustomArticles(): void {
    localStorage.setItem(this.CUSTOM_ARTICLES_KEY, JSON.stringify(this.customArticlesSignal()));
  }

  private getApiCategory(category?: NewsCategory): string | undefined {
    if (!category) {
      return undefined;
    }

    return this.categoryApiMap[category];
  }

  private async fetchNews(): Promise<any> {
    const query = this.searchQuerySignal();
    const filters = this.filtersSignal();
    const apiCategory = this.getApiCategory(filters.category);

    let params = new HttpParams()
      .set('apiKey', environment.newsApiKey)
      .set('pageSize', '20')
      .set('page', this.currentPageSignal().toString())
      .set('language', 'ru');

    if (query && !apiCategory) {
      params = params.set('q', query);
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }

      return firstValueFrom(
        this.http.get<any>(
          `${environment.newsApiBaseUrl}/everything`,
          { params }
        )
      );
    }

    if (query) {
      params = params.set('q', query);
    }

    params = params.set('country', 'ru');

    if (apiCategory) {
      params = params.set('category', apiCategory);
    }

    return firstValueFrom(
      this.http.get<any>(
        `${environment.newsApiBaseUrl}/top-headlines`,
        { params }
      )
    );
  }

  getArticleById(id: string): Article | undefined {
    return this.articlesSignal().find(article => article.id === id)
      || this.customArticlesSignal().find(article => article.id === id);
  }

  toggleFavorite(article: Article): void {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(fav => fav.url === article.url);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(article);
    }

    localStorage.setItem('favoriteArticles', JSON.stringify(favorites));
    this.updateArticleFavoriteStatus(article.url, index === -1);
  }

  private updateArticleFavoriteStatus(url: string, isFavorite: boolean): void {
    const articles = this.articlesSignal().map(article =>
      article.url === url ? { ...article, isFavorite } : article
    );
    this.articlesSignal.set(articles);

    this.customArticlesSignal.set(
      this.customArticlesSignal().map(article =>
        article.url === url ? { ...article, isFavorite } : article
      )
    );
  }

  getFavorites(): Article[] {
    const stored = localStorage.getItem('favoriteArticles');
    return stored ? JSON.parse(stored) : [];
  }

  private isFavorite(url: string): boolean {
    return this.getFavorites().some(article => article.url === url);
  }

  private loadFavorites(): void {
    const favorites = this.getFavorites();
    this.updateFavoritesStatus(favorites);
  }

  private updateFavoritesStatus(favorites: Article[]): void {
    const articles = this.articlesSignal().map(article => ({
      ...article,
      isFavorite: favorites.some(fav => fav.url === article.url)
    }));
    this.articlesSignal.set(articles);
  }

  private generateArticleId(article: any): string {
    return article.id || `${article.source.name}-${new Date(article.publishedAt).getTime()}`;
  }

  private applySort(articles: Article[]): Article[] {
    const sortBy = this.filtersSignal().sortBy;

    if (!sortBy || sortBy === 'publishedAt') {
      return [...articles].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    return [...articles].sort(
      (a, b) => {
        const scoreA = (a.title?.length || 0) + (a.description?.length || 0);
        const scoreB = (b.title?.length || 0) + (b.description?.length || 0);
        return scoreB - scoreA;
      }
    );
  }

  loadNextPage(): void {
    if (this.currentPageSignal() * 20 < this.totalResultsSignal()) {
      this.currentPageSignal.update(page => page + 1);
      this.loadNews();
    }
  }

  resetState(): void {
    this.articlesSignal.set([]);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
    this.searchQuerySignal.set('');
    this.filtersSignal.set({});
    this.totalResultsSignal.set(0);
    this.currentPageSignal.set(1);
  }
}
