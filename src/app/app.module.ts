import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SuggestionsPage } from '../pages/suggestions/suggestions';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';

import { TabsComponent } from '../components/tabs/tabs';
import { MainHeaderComponent } from '../components/main-header/main-header';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    SuggestionsPage,
    ListPage,
    MapPage,
    TabsComponent,
    MainHeaderComponent
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
    TabsComponent,
    MainHeaderComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
