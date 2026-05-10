import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="logo">
          <h1>News 43 RUS</h1>
        </div>
        
        <nav class="nav">
          <a 
            routerLink="/news" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: false }"
            class="nav-link"
          >
            Новости
          </a>
          <a 
            routerLink="/favorites" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            Избранное
          </a>
          <a 
            routerLink="/news/new" 
            class="nav-link btn-create"
            title="Создать новость"
          >
            ➕ Создать новость
          </a>
        </nav>

        <button 
          class="theme-toggle" 
          (click)="toggleTheme()"
          [title]="'Текущая тема: ' + (themeService.theme() === 'light' ? 'Светлая' : 'Тёмная')"
          aria-label="Переключить тему"
        >
          {{ themeService.theme() === 'light' ? '🌙' : '☀️' }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-primary);
    }

    .nav {
      display: flex;
      gap: 2rem;
      flex: 1;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }

    .nav-link:hover {
      color: var(--text-primary);
      background-color: var(--bg-tertiary);
    }

    .nav-link.active {
      color: var(--primary-color);
      border-bottom: 2px solid var(--primary-color);
    }

    .nav-link.btn-create {
      background-color: var(--primary-color);
      color: white;
      border-radius: 4px;
      font-weight: 600;
    }

    .nav-link.btn-create:hover {
      background-color: var(--primary-color-hover);
      color: white;
    }

    .theme-toggle {
      background: none;
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      background-color: var(--bg-tertiary);
    }

    @media (max-width: 768px) {
      .container {
        flex-wrap: wrap;
        gap: 1rem;
      }

      .nav {
        gap: 1rem;
        width: 100%;
        order: 3;
      }

      .logo h1 {
        font-size: 1.2rem;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
