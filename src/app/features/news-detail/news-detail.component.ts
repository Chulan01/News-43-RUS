import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { Article } from '../../core/models/article.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  template: `
    <div class="detail-container">
      <div *ngIf="article; else notFound" class="article-detail">
        <button (click)="goBack()" class="btn-back">← Назад</button>

        <div class="article-header">
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <span class="source">{{ article.source.name }}</span>
            <span class="date">{{ article.publishedAt | timeAgo }}</span>
            <span *ngIf="article.author" class="author">{{ article.author }}</span>
          </div>
        </div>

        <div class="article-image" *ngIf="article.urlToImage">
          <img [src]="article.urlToImage" [alt]="article.title">
        </div>

        <div class="article-body">
          <p *ngIf="article.description" class="description">{{ article.description }}</p>
        </div>

        <div class="article-actions">
          <button 
            (click)="toggleFavorite()" 
            class="btn btn-favorite"
            [class.favorite]="article.isFavorite"
          >
            {{ article.isFavorite ? '❤️ В избранном' : '🤍 Добавить в избранное' }}
          </button>
          <a [href]="article.url" target="_blank" class="btn btn-primary">
            Читать оригинал →
          </a>
        </div>
      </div>

      <ng-template #notFound>
        <div class="not-found">
          <h2>Новость не найдена</h2>
          <p>К сожалению, эта новость больше недоступна.</p>
          <a routerLink="/news" class="btn btn-primary">Вернуться к новостям</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .btn-back {
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-weight: 500;
      margin-bottom: 1rem;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .btn-back:hover {
      color: var(--text-primary);
    }

    .article-detail {
      background-color: var(--bg-secondary);
      border-radius: 8px;
      padding: 2rem;
    }

    .article-header {
      margin-bottom: 2rem;
    }

    .article-header h1 {
      color: var(--text-primary);
      font-size: 2rem;
      margin: 0 0 1rem 0;
      line-height: 1.3;
    }

    .article-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      color: var(--text-secondary);
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }

    .source, .author {
      font-weight: 500;
    }

    .article-image {
      width: 100%;
      max-height: 500px;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .article-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .article-body {
      margin-bottom: 2rem;
      line-height: 1.8;
    }

    .description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin: 0 0 1rem 0;
      font-weight: 500;
    }

    .article-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      border-top: 1px solid var(--border-color);
      padding-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
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

    .btn-favorite {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-favorite:hover {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-favorite.favorite {
      background-color: var(--primary-color);
      color: white;
    }

    .not-found {
      text-align: center;
      padding: 3rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
    }

    .not-found h2 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .not-found p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 1rem;
      }

      .article-detail {
        padding: 1rem;
      }

      .article-header h1 {
        font-size: 1.5rem;
      }

      .article-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class NewsDetailComponent implements OnInit {
  article: Article | undefined;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      // First try to find in loaded articles
      this.article = this.newsService.getArticleById(id);
      
      // If not found, you could load from localStorage (favorites)
      if (!this.article) {
        const favorites = this.newsService.getFavorites();
        this.article = favorites.find(a => a.id === id);
      }
    });
  }

  toggleFavorite(): void {
    if (this.article) {
      this.newsService.toggleFavorite(this.article);
      this.article = {
        ...this.article,
        isFavorite: !this.article.isFavorite
      };
    }
  }

  goBack(): void {
    window.history.back();
  }
}
