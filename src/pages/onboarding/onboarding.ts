import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  constructor(
    private navController: NavController,
    private storage: Storage
  ) {}

  close() {
    this.storage.set('onboarding', 'done');
    this.navController.pop();
  }
}
