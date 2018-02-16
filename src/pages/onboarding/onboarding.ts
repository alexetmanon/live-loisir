import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  constructor(
    private navController: NavController
  ) {}

  close() {
    this.navController.pop();
  }
}
