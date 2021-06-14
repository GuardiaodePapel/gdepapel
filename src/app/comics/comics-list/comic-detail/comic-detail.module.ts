import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComicDetailPageRoutingModule } from './comic-detail-routing.module';

import { ComicDetailPage } from './comic-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComicDetailPageRoutingModule
  ],
  declarations: [ComicDetailPage]
})
export class ComicDetailPageModule {}
