import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('',[Validators.required]),
    });
  }

  loginGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())

      // Se o login funcionar
      .then(
        (data: any) => {

          console.log(data.user.displayName, data.user.uid);

          this.afs.firestore.doc(`register/${data.user.uid}`).get()
            .then((uData) => {

              // Se tem perfil
              if (uData.exists) {
                this.feedback(
                  data.user.displayName,
                  'Você já pode acessar o conteúdo restrito.',
                  '/comics/tabs/comics-list'
                );
              } else {
                this.feedback(
                  data.user.displayName,
                  'Você precisa completar seu cadastro para acessar o conteúdo restrito.',
                  '/register'
                );
              }
            });
        }
      )

      // Se o login falhar
      .catch(
        (error) => {
          console.log(error);
        }
      );
  }

  // 5) Feeback e saida da página
  async feedback(userName: string, message: string, routerLink: string) {
    const alert = await this.alertCtrl.create({
      header: `Olá ${userName}!`,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate([routerLink]);
        }
      }]
    });

    await alert.present();
  }

  async signInWithEmailPassword() {
    const loading = await this.loadingCtrl.create();
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
     firebase.auth().signInWithEmailAndPassword(email, password)
       .then(() => {
         loading.dismiss().then(() => {
         this.presentAlert();

         });
       }).catch(error => {
         console.log(error.code);
         if ( error.code === 'auth/user-not-found') {
          loading.dismiss().then(() => {
            this.userInvalid();
        });
        } else {
          if ( error.code === 'auth/wrong-password') {
            loading.dismiss().then(() => {
              this.userInvalid();
          });
          }
        }
      });
       await loading.present();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Olá!',
      message: 'Bem-vindo(a) de volta.',
      buttons: [{
        text: 'Ok',
        handler: () => {


          this.loginForm.reset();


          this.router.navigate(['/comics/tabs/comics-list']);
        }
      }]
    });

    await alert.present();
  }
  async userInvalid() {
    const alert = await this.alertCtrl.create({
      header: 'Ops.',
      message: 'E-mail ou senha inválidos.',
      buttons: [{
        text: 'OK',
        handler: () => {
        }
      }]
    });

    await alert.present();
  }
}
