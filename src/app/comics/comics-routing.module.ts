import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComicsPage } from './comics.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: ComicsPage,
    children:
    [
      {
        path: 'comics-list',
        children:
        [
          {
            path: '',
            loadChildren: () => import('./comics-list/comics-list.module').then(  m => m.ComicsListPageModule)
          },
          {
            path: 'comic-detail/:id',
            loadChildren: () => import('./comics-list/comic-detail/comic-detail.module').then( m => m.ComicDetailPageModule)
          },
          {
            path: 'edit-comic/:id',
            loadChildren: () => import('./comics-list/edit-comic/edit-comic.module').then( m => m.EditComicPageModule)
          }
        ]
      },
      {
        path: 'new-comic',
        children:
        [
          {
            path: '',
            loadChildren: () => import('./new-comic/new-comic.module').then( m => m.NewComicPageModule)
          }
        ]
      },
      {
        path:'',
        redirectTo: '/comics/tabs/comics-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path:'',
    redirectTo: '/comics/tabs/comics-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComicsPageRoutingModule {}
