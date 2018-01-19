import { Component } from '@angular/core';

import { SuggestionsPage } from '../../pages/suggestions/suggestions';
import { ListPage } from '../../pages/list/list';
import { MapPage } from '../../pages/map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  tab1Root = MapPage;
  tab2Root = SuggestionsPage;
  tab3Root = ListPage;

  constructor() {

  }
}
