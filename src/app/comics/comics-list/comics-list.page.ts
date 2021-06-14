/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComicService } from '../comic.service';

export class Comic{
  $key: string;
  titulo: string;
  autor: string;
  editora: string;
  dataLan: string;
  edicao: string;
  totaledicao: string;
  formato: string;
  agenda: string;
  status: string;
  imageUrl: string;
  uid: string;
  id: string;
}

@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.page.html',
  styleUrls: ['./comics-list.page.scss'],
})
export class ComicsListPage implements OnInit {
  comics: Comic[];

  constructor(private comicService: ComicService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.comicService.getComics().subscribe((res) => {
      this.comics = res.map((c) => {
        return {
          id: c.payload.doc.id,
          ...c.payload.doc.data() as Comic
        };
      });
    });
  }

  remove(id) {
    console.log(id);
    if (window.confirm('Are you sure?')) {
      this.comicService.delete(id);
    }
  }

}
