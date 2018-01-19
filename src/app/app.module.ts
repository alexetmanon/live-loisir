import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SuggestionsPage } from '../pages/suggestions/suggestions';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';

import { TabsComponent } from '../components/tabs/tabs';
import { MainNavComponent } from '../components/main-nav/main-nav';
import { DaySelectorComponent } from '../components/day-selector/day-selector';

import { DaySelectorService } from '../services/day-selector.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    SuggestionsPage,
    ListPage,
    MapPage,
    TabsComponent,
    MainNavComponent,
    DaySelectorComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SuggestionsPage,
    ListPage,
    MapPage,
    TabsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    DaySelectorService
  ]
})
export class AppModule {}
