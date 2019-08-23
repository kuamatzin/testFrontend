import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private auth: AuthService, private navCtrl: NavController, private storage: Storage, private alertController: AlertController) { }

  goToRegister() {
    this.router.navigate(['/create-account'])
  }

  async register(form) {
    const [error, result] = await <any>this.auth.login(form.value)
    if (error) return this.alert("Invalid credentials")

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
