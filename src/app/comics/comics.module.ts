import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComicsPageRoutingModule } from './comics-routing.module';

import { ComicsPage } from './comics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComicsPageRoutingModule
  ],
  declarations: [ComicsPage]
})
export class ComicsPageModule {}
