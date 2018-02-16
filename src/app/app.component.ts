import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsComponent } from '../components/tabs/tabs';
import { OnboardingPage } from '../pages/onboarding/onboarding';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') navController;

  rootPage:any = TabsComponent;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngAfterViewInit() {
    this.navController.push(OnboardingPage);
  }
}
