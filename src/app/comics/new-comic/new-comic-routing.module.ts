import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewComicPage } from './new-comic.page';

const routes: Routes = [
  {
    path: '',
    component: NewComicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewComicPageRoutingModule {}
