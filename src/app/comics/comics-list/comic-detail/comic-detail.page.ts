/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicService } from '../../comic.service';

@Component({
  selector: 'app-comic-detail',
  templateUrl: './comic-detail.page.html',
  styleUrls: ['./comic-detail.page.scss'],
})
export class ComicDetailPage implements OnInit {
  editForm: FormGroup;
  id: any;
  constructor(
    public auth: AngularFireAuth,
    private comicService: ComicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public form: FormBuilder
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.comicService.getComic(this.id).subscribe((data) => {
      this.editForm = this.form.group({
        titulo: [data['titulo']],
        autor: [data['autor']],
        editora: [data['editora']],
        dataLan: [data['datalan']],
        edicao: [data['edicao']],
        totaledicao: [data['totaledicao']],
        formato: [data['formato']],
        agenda: [data['agenda']],
       status: [data['status']],
        uid: [data['uid']],
      });
    });
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      titulo: new FormControl(null,{}),
      autor: new FormControl(null,{}),
      editora: new FormControl(null,{}),
      dataLan: new FormControl(null,{}),
      edicao: new FormControl(null,{}),
      totaledicao: new FormControl(null,{}),
      formato: new FormControl(null,{}),
      agenda: new FormControl(null,{}),
      status: new FormControl(null,{}),
      imageUrl: new FormControl(null),
      uid: new FormControl(null),
    });

    if (this.editForm) {

      this.auth.onAuthStateChanged(
        (userData) => {
          if (userData) {

            this.editForm.controls.uid.setValue(userData.uid.trim());
          }
        }
      );
    }
  }
  onEditComic(){
    this.comicService.update(this.id, this.editForm.value);
  }

}
