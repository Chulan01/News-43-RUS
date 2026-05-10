import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomValidators } from '../../core/services/custom-validators';
import { NewsService } from '../../core/services/news.service';
import { Article } from '../../core/models/article.model';
import { CanComponentDeactivate } from '../../core/guards/can-deactivate.guard';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-card">
        <h2>{{ isEditMode ? 'Редактировать новость' : 'Создать новость' }}</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Заголовок *</label>
            <input 
              id="title"
              type="text" 
              formControlName="title" 
              placeholder="Введите заголовок новости"
              class="form-input"
            />
            <div *ngIf="form.get('title')?.touched && form.get('title')?.errors" class="error-message">
              <span *ngIf="form.get('title')?.errors?.['required']">Заголовок обязателен</span>
              <span *ngIf="form.get('title')?.errors?.['minlength']">
                Минимальная длина: {{ form.get('title')?.errors?.['minlength']?.requiredLength }} символов
              </span>
              <span *ngIf="form.get('title')?.errors?.['maxlength']">
                Максимальная длина: {{ form.get('title')?.errors?.['maxlength']?.requiredLength }} символов
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Описание</label>
            <textarea 
              id="description"
              formControlName="description" 
              placeholder="Введите описание новости"
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="content">Содержание</label>
            <textarea 
              id="content"
              formControlName="content" 
              placeholder="Введите полный текст новости"
              class="form-input"
              rows="6"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="url">URL *</label>
            <input 
              id="url"
              type="text" 
              formControlName="url" 
              placeholder="https://example.com/article"
              class="form-input"
            />
            <div *ngIf="form.get('url')?.touched && form.get('url')?.errors" class="error-message">
              <span *ngIf="form.get('url')?.errors?.['required']">URL обязателен</span>
              <span *ngIf="form.get('url')?.errors?.['invalidUrl']">Введите корректный URL</span>
            </div>
          </div>

          <div class="form-group">
            <label for="urlToImage">URL изображения</label>
            <input 
              id="urlToImage"
              type="text" 
              formControlName="urlToImage" 
              placeholder="https://example.com/image.jpg"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="author">Автор</label>
            <input 
              id="author"
              type="text" 
              formControlName="author" 
              placeholder="Имя автора"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="sourceName">Источник *</label>
            <input 
              id="sourceName"
              type="text" 
              formControlName="sourceName" 
              placeholder="Название источника"
              class="form-input"
            />
            <div *ngIf="form.get('sourceName')?.touched && form.get('sourceName')?.errors" class="error-message">
              <span *ngIf="form.get('sourceName')?.errors?.['required']">Источник обязателен</span>
            </div>
          </div>

          <div class="form-group">
            <label for="category">Категория</label>
            <select formControlName="category" class="form-input">
              <option value="">Выберите категорию</option>
              <option value="политика">Политика</option>
              <option value="экономика">Экономика</option>
              <option value="технологии">Технологии</option>
              <option value="спорт">Спорт</option>
              <option value="мир">Мир</option>
              <option value="общество">Общество</option>
            </select>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="form.invalid"
            >
              {{ isEditMode ? 'Обновить' : 'Создать' }}
            </button>
            <a routerLink="/news" class="btn btn-secondary">Отмена</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .form-card {
      background-color: var(--bg-secondary);
      border-radius: 8px;
      padding: 2rem;
    }

    h2 {
      color: var(--text-primary);
      margin: 0 0 2rem 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .error-message {
      color: var(--error-color);
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
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
      flex: 1;
      text-align: center;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-color-hover);
    }

    .btn-primary:disabled {
      background-color: var(--bg-tertiary);
      color: var(--text-secondary);
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background-color: var(--border-color);
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1rem;
      }

      .form-card {
        padding: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class NewsFormComponent implements OnInit, CanComponentDeactivate {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: [''],
      content: [''],
      url: ['', [Validators.required, CustomValidators.urlValidator()]],
      urlToImage: [''],
      author: [''],
      sourceName: ['', Validators.required],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        // Load article for editing (implement based on your storage)
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const article: Article = {
        id: `custom-${Date.now()}`,
        title: formValue.title,
        description: formValue.description,
        content: formValue.content,
        url: formValue.url,
        urlToImage: formValue.urlToImage,
        publishedAt: new Date().toISOString(),
        source: {
          name: formValue.sourceName
        },
        author: formValue.author,
        category: formValue.category || undefined,
        isFavorite: false
      };

      this.newsService.addCustomArticle(article);
      this.router.navigate(['/news']);
    }
  }

  canDeactivate(): boolean {
    return !this.form.dirty || confirm('У вас есть несохранённые изменения. Вы уверены, что хотите уйти?');
  }
}
