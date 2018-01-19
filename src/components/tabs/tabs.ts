import { Component } from '@angular/core';

import { SuggestionsPage } from '../../pages/suggestions/suggestions';
import { ListPage } from '../../pages/list/list';
import { MapPage } from '../../pages/map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  selectedTabIndex = 0;

  // tabs
  map = MapPage;
  list = ListPage;
  suggestions = SuggestionsPage;

  constructor() {

  }

  onChange(tab: any) {
    this.selectedTabIndex = tab.index;
  }

  tabColor() {
    switch(this.selectedTabIndex) {
      case 0:
        return 'map-color';
      case 1:
        return 'list-color';
      case 2:
        return 'suggestions-color';
      default:
        return '';
    }
  }
}
