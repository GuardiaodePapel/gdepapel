import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ComicService } from '../comic.service';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

export class Comic{
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
  selector: 'app-new-comic',
  templateUrl: './new-comic.page.html',
  styleUrls: ['./new-comic.page.scss'],
})
export class NewComicPage implements OnInit {

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;

  comicForm: FormGroup;

  constructor(
    public afs: AngularFirestore,
    public alert: AlertController,
    public router: Router,
    public auth: AngularFireAuth,
    private storage: AngularFireStorage,
    public comicService: ComicService
    ) { }

  ionViewWillEnter() {

    this.auth.onAuthStateChanged(
      (userData) => {
        if (userData) {
          this.afs.firestore.doc(`register/${userData.uid}`).get();
        }
      }
    );
  }
  ngOnInit() {
    this.comicForm = new FormGroup({
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

    if (this.comicForm) {
      this.imgSrc = 'assets/defcomic.jpg';
      this.selectedImage = null;
      this.auth.onAuthStateChanged(
        (userData) => {
          if (userData) {

            this.comicForm.controls.uid.setValue(userData.uid.trim());
          }
        }
      );
    }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = 'assets/defprofile.png';
      this.selectedImage = null;
    }
  }

  onCreateComic( formValue) {
    if (!this.comicForm.valid) {
      return;
    }
    this.isSubmitted = true;
    if (this.comicForm.valid) {
      const filePath = `hqs/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            formValue['imageUrl'] = url;

            this.comicService.create(this.comicForm.value)
      .then(() => {
        this.comicForm.reset();
        this.router.navigate(['/comics/tabs/comics-list']);
      }).catch((err) => {
        console.log(err);
      });
          });
                })
      ).subscribe();
    }

  }
  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Oba!',
      message: 'Cadastro realizado com sucesso!',
      buttons: [{
        text: 'Ok',
        handler: () => {

          // Reset do formulário
          this.comicForm.reset();

          // Vai para perfil
          this.router.navigate(['comics/tabs/comics-list']);
        }
      }]
    });

    await alert.present();
  }

}
