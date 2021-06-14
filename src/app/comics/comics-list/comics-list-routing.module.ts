import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComicsListPage } from './comics-list.page';

const routes: Routes = [
  {
    path: '',
    component: ComicsListPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComicsListPageRoutingModule {}
