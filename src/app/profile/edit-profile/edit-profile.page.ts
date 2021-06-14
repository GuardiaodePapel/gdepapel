import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public registerForm: FormGroup;
  public id: string;

  // (*) Dados do usuário no database
  public userData: any;
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;

  constructor(

    // 2) Injeta dependências
    public form: FormBuilder,
    public afs: AngularFirestore,

    // Alert Controller
    public alert: AlertController,

    // Usuário autenticado
    public auth: AngularFireAuth,

    // (*) Manipula rotas
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage,
  ) {

    // (*) Obtém o id do usuário a ser exibido
    this.id = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit() {
    this.registerFormCreate();

    // (*) Preenche os campos a partir do database
    if (this.registerForm) {
      this.imgSrc = 'assets/defprofile.png';
      this.selectedImage = null;

      // Obtém cadastro do usuário do database
      this.afs.firestore.doc(`register/${this.id}`).get()
        .then((uData) => {

          // Se tem perfil
          if (uData.exists) {

            // Filtra dados do usuário no database
            this.userData = uData.data();

            // Insere dados do databse no formulário
            this.registerForm.controls.nome.setValue(this.userData.nome);
            this.registerForm.controls.email.setValue(this.userData.email);
            this.registerForm.controls.dataNas.setValue(this.userData.dataNas);
            this.registerForm.controls.uid.setValue(this.userData.uid);
          }
        });
    }
  }

  registerFormCreate(){
    this.registerForm = new FormGroup({
      nome: new FormControl(''),
      email: new FormControl(''),
      dataNas: new FormControl(''),
      imageUrl: new FormControl(''),
      uid: new FormControl('')
    });
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

  onCreateReg(formValue){

    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const filePath = `images/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            formValue['imageUrl'] = url;
            this.afs.collection('register').doc(this.registerForm.value.uid).set(this.registerForm.value)
      .then(
        () => {
          this.presentAlert();
        }
      )
      .catch(
        (error) => {
          alert('Erro ao cadastrar.' + error);
        }
      );
          });
                })
      ).subscribe();
    }
}

// Feedback
// Exibe feedback
async presentAlert() {
  const alert = await this.alert.create({
    header: 'Oba!',
    message: 'Cadastro realizado com sucesso!',
    buttons: [{
      text: 'Ok',
      handler: () => {

        // Reset do formulário
        this.registerForm.reset();

        // Vai para perfil
        this.router.navigate(['/profile']);
      }
    }]
  });

  await alert.present();
}
}
