import { Routes } from '@angular/router';
import { NewsListComponent } from './features/news-list/news-list.component';
import { NewsDetailComponent } from './features/news-detail/news-detail.component';
import { NewsFormComponent } from './features/news-form/news-form.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { canDeactivateGuard } from './core/guards/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full'
  },
  {
    path: 'news',
    children: [
      {
        path: '',
        component: NewsListComponent
      },
      {
        path: 'new',
        component: NewsFormComponent,
        canDeactivate: [canDeactivateGuard]
      },
      {
        path: ':id',
        component: NewsDetailComponent
      },
      {
        path: ':id/edit',
        component: NewsFormComponent,
        canDeactivate: [canDeactivateGuard]
      }
    ]
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: '**',
    redirectTo: '/news'
  }
];
