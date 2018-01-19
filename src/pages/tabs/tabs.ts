import { Component } from '@angular/core';

import { SuggestionsPage } from '../suggestions/suggestions';
import { ListPage } from '../list/list';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = SuggestionsPage;
  tab3Root = ListPage;

  constructor() {

  }
}
