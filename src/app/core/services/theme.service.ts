import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<'light' | 'dark'>(this.getInitialTheme());
  theme = computed(() => this.themeSignal());

  private readonly THEME_KEY = 'theme';

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  private getInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return this.getSystemTheme();
  }

  private getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggleTheme(): void {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }
}
