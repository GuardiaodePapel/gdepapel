import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewComicPageRoutingModule } from './new-comic-routing.module';

import { NewComicPage } from './new-comic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewComicPageRoutingModule
  ],
  declarations: [NewComicPage]
})
export class NewComicPageModule {}
