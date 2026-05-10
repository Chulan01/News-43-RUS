import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { Article } from '../../core/models/article.model';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe, TimeAgoPipe],
  template: `
    <div class="favorites-container">
      <h2>Избранные новости</h2>

      <div *ngIf="favorites.length === 0" class="empty">
        <p>У вас нет избранных новостей</p>
        <a routerLink="/news" class="btn btn-primary">Перейти к новостям</a>
      </div>

      <div class="articles-grid" *ngIf="favorites.length > 0">
        <article 
          *ngFor="let article of favorites" 
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
                (click)="removeFavorite($event, article)" 
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
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    h2 {
      color: var(--text-primary);
      margin-bottom: 2rem;
    }

    .empty {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
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
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
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

    @media (max-width: 768px) {
      .articles-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: Article[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.favorites = this.newsService.getFavorites();
  }

  removeFavorite(event: Event, article: Article): void {
    event.preventDefault();
    event.stopPropagation();
    this.newsService.toggleFavorite(article);
    this.loadFavorites();
  }
}
