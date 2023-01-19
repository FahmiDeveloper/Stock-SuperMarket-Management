import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'list-seasons-mobile',
    templateUrl: './list-seasons-mobile.component.html',
    styleUrls: ['./list-seasons-mobile.scss']
})

export class ListSeasonsForMobileComponent {

  @Input() listSeasonsByParentSerieKey: Serie[];
  @Output() seasonSerieSelected = new EventEmitter();

  sendDetailsSerie(serie: Serie) {
      this.seasonSerieSelected.emit(serie);
  }

}