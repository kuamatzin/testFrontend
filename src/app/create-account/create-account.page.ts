import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  constructor(private router: Router, private auth: AuthService, private navCtrl: NavController, private storage: Storage, private alertController: AlertController) { }

  ngOnInit() {
  }

  goToLogin() {
    this.router.navigate(['/home'])
  }

  async register(form) {
    const [error, result] = await <any>this.auth.signUp(form.value)
    if (error) return this.alert("Something happen, try again later")

    this.storage.set('token', result.idToken)

    setTimeout(_ => this.navCtrl.navigateRoot('/tasks'), 500)
  }

  async alert(message) {
    const alert = await this.alertController.create({
      header: 'Oops',
      subHeader: '',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
