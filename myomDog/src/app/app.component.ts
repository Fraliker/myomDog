import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  constructor(platform: Platform,
    af: AngularFireAuth,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public authService: AuthService,
    public alertCtrl: AlertController) {

    this.authService.fireAuth.subscribe(
      (auth) => {
        if(auth == null) {
          console.log("Not Logged in.");
          this.rootPage = TabsPage;
        }
        else {
          console.log("Successfully Logged in.");
          this.authService.email = auth.auth.email;
          this.rootPage = LoginPage;
        }
      }
    );

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
