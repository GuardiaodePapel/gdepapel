import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditComicPage } from './edit-comic.page';

const routes: Routes = [
  {
    path: '',
    component: EditComicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditComicPageRoutingModule {}
