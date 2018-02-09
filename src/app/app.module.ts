import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import { SuggestionsPage } from '../pages/suggestions/suggestions';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { EventPage } from '../pages/event/event';

import { TabsComponent } from '../components/tabs/tabs';
import { MainNavComponent } from '../components/main-nav/main-nav';
import { DaySelectorComponent } from '../components/day-selector/day-selector';
import { MapComponent } from '../components/map/map';

import { IonSegmentHotfix } from '../directives/ion-segment-hotfix';

import { DaySelectorService } from '../services/day-selector.service';
import { EventsService } from '../services/events.service';
import { ItineraryService } from '../services/itinerary.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [
    MyApp,
    SuggestionsPage,
    ListPage,
    MapPage,
    EventPage,
    TabsComponent,
    MainNavComponent,
    DaySelectorComponent,
    MapComponent,
    IonSegmentHotfix
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SuggestionsPage,
    ListPage,
    MapPage,
    EventPage,
    TabsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    DaySelectorService,
    EventsService,
    ItineraryService
  ]
})
export class AppModule {}
