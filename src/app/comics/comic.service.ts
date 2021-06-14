import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

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
}

@Injectable({
  providedIn: 'root'
})
export class ComicService {
  ngFirestore: any;

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) { }

  create(comic: Comic) {
    return this.afs.collection('Quadrinhos').add(comic);
  }

  getComics() {
    return this.afs.collection('Quadrinhos').snapshotChanges();
  }

  getComic(id) {
    return this.afs.collection('Quadrinhos').doc(id).valueChanges();
  }

  update(id, comic: Comic) {
    this.afs.collection('Quadrinhos').doc(id).update(comic)
      .then(() => {
        this.router.navigate(['comics/tabs/comics-list']);
      }).catch(error => console.log(error));;
  }

  delete(id: string) {
    this.ngFirestore.doc(`Quadrinhos/${id}`).delete();
  }
}
