import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../core/services/news.service';
import { NewsFilters, Article } from '../../core/models/article.model';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TruncatePipe, TimeAgoPipe],
  template: `
    <div class="news-list-container">
      <div class="filters-section">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Поиск новостей..." 
            (keyup)="onSearch($event)"
            class="search-input"
          />
        </div>

        <div class="filters">
          <div class="filter-group">
            <label>Категория:</label>
            <select (change)="onCategoryChange($event)" class="filter-select">
              <option value="">Все категории</option>
              <option value="политика">Политика</option>
              <option value="экономика">Экономика</option>
              <option value="технологии">Технологии</option>
              <option value="спорт">Спорт</option>
              <option value="мир">Мир</option>
              <option value="общество">Общество</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Сортировка:</label>
            <select (change)="onSortChange($event)" class="filter-select">
              <option value="publishedAt">По дате</option>
              <option value="relevancy">По релевантности</option>
            </select>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- Loading State -->
        <div *ngIf="newsService.loading()" class="loading">
          <p>Загрузка новостей...</p>
          <div class="spinner"></div>
        </div>

        <!-- Error State -->
        <div *ngIf="newsService.error() && !newsService.loading()" class="error">
          <p>{{ newsService.error() }}</p>
          <button (click)="retry()" class="btn btn-primary">Повторить</button>
        </div>

        <!-- Empty State -->
        <div *ngIf="newsService.articles().length === 0 && !newsService.loading() && !newsService.error()" class="empty">
          <p>Новости не найдены</p>
        </div>

        <!-- Articles Grid -->
        <div class="articles-grid" *ngIf="newsService.articles().length > 0">
          <article 
            *ngFor="let article of newsService.articles()" 
            class="article-card"
            [routerLink]="['/news', article.id]"
          >
            <div class="article-image" *ngIf="article.urlToImage">
              <img [src]="article.urlToImage" [alt]="article.title" loading="lazy">
            </div>

            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              
              <p class="article-description">
                {{ article.description | truncate: 150 }}
              </p>

              <div class="article-meta">
                <span class="source">{{ article.source.name }}</span>
                <span class="date">{{ article.publishedAt | timeAgo }}</span>
              </div>

              <div class="article-actions">
                <button 
                  (click)="toggleFavorite($event, article)" 
                  class="btn-favorite"
                  [class.favorite]="article.isFavorite"
                  title="Добавить в избранное"
                >
                  {{ article.isFavorite ? '❤️' : '🤍' }}
                </button>
                <button
                  *ngIf="isCustom(article)"
                  (click)="deleteCustomArticle($event, article)"
                  class="btn btn-danger"
                >
                  Удалить
                </button>
                <a [href]="article.url" target="_blank" class="btn btn-small">
                  Читать
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .news-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .filters-section {
      margin-bottom: 2rem;
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 500;
      color: var(--text-secondary);
    }

    .filter-select {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      cursor: pointer;
    }

    .content {
      min-height: 400px;
    }

    .loading, .error, .empty {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      border: 4px solid var(--bg-tertiary);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      color: var(--error-color);
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--primary-color-hover);
    }

    .btn-small {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-small:hover {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-danger {
      background-color: var(--error-color);
      color: white;
    }

    .btn-danger:hover {
      background-color: #d32f2f;
    }

    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .article-card {
      background-color: var(--bg-secondary);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
      text-decoration: none;
      color: inherit;
    }

    .article-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .article-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: var(--bg-tertiary);
    }

    .article-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .article-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .article-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .article-description {
      margin: 0.5rem 0 1rem 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      flex: 1;
    }

    .article-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      border-top: 1px solid var(--border-color);
      padding-top: 0.5rem;
    }

    .article-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-favorite {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
    }

    .btn-favorite.favorite {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .articles-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NewsListComponent implements OnInit {
  constructor(public newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.loadNews();
  }

  onSearch(event: any): void {
    const query = event.target.value;
    this.newsService.setSearchQuery(query);
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.newsService.setFilters({
      ...this.newsService.filters(),
      category: category || undefined
    });
  }

  onSortChange(event: any): void {
    const sortBy = event.target.value as 'publishedAt' | 'relevancy';
    this.newsService.setFilters({
      ...this.newsService.filters(),
      sortBy
    });
  }

  isCustom(article: Article): boolean {
    return this.newsService.isCustomArticle(article);
  }

  deleteCustomArticle(event: Event, article: Article): void {
    event.preventDefault();
    event.stopPropagation();
    this.newsService.deleteCustomArticle(article.id);
  }

  toggleFavorite(event: Event, article: Article): void {
    event.preventDefault();
    event.stopPropagation();
    this.newsService.toggleFavorite(article);
  }

  retry(): void {
    this.newsService.loadNews();
  }
}
