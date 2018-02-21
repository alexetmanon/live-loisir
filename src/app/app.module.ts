import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { IonicStorageModule } from '@ionic/storage';

import { NowPage } from '../pages/now/now';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { EventPage } from '../pages/event/event';
import { ItineraryPage } from '../pages/itinerary/itinerary';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { ItineraryMapPage } from '../pages/itinerary-map/itinerary-map';

import { TabsComponent } from '../components/tabs/tabs';
import { MainNavComponent } from '../components/main-nav/main-nav';
import { DaySelectorComponent } from '../components/day-selector/day-selector';
import { MapComponent } from '../components/map/map';
import { EventCardComponent } from '../components/event-card/event-card';

import { IonSegmentHotfix } from '../directives/ion-segment-hotfix';

import { DaySelectorService } from '../services/day-selector.service';
import { EventsService } from '../services/events.service';
import { ItineraryService } from '../services/itinerary.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// register french locale
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    MyApp,
    NowPage,
    ListPage,
    MapPage,
    EventPage,
    ItineraryPage,
    TabsComponent,
    MainNavComponent,
    DaySelectorComponent,
    MapComponent,
    IonSegmentHotfix,
    EventCardComponent,
    OnboardingPage,
    ItineraryMapPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NowPage,
    ListPage,
    MapPage,
    EventPage,
    TabsComponent,
    ItineraryPage,
    OnboardingPage,
    ItineraryMapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
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
