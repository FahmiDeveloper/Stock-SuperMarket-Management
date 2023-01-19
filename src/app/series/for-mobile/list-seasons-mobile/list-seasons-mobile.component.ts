
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'list-seasons-mobile',
    templateUrl: './list-seasons-mobile.component.html',
    styleUrls: ['./list-seasons-mobile.scss']
})

export class ListSeasonsForMobileComponent implements OnChanges {

  @Input() listSeriesByCurrentName: Serie[];
  @Output() seasonSerieSelected = new EventEmitter();

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    // if (this.listSeriesByCurrentName.length) {
    //   if (this.listSeriesByCurrentName.length == 1) {
    //     this.listSeriesByCurrentName.forEach(season => {
    //       if (season.fullNameSerie) {
    //         season.nameSerieToShow = (season.fullNameSerie.length > 30) ? season.fullNameSerie.substring(0, 30) + '...' : season.fullNameSerie;
    //       } else {
    //         season.nameSerieToShow = (season.nameSerie.length > 30) ? season.nameSerie.substring(0, 30) + '...' : season.nameSerie;
    //       }
    //     })
    //   } else {
    //     this.listSeriesByCurrentName.forEach(season => {
    //       if (season.fullNameSerie) {
    //         season.nameSerieToShow = (season.fullNameSerie.length > 10) ? season.fullNameSerie.substring(0, 10) + '...' : season.fullNameSerie;
    //       } else {
    //         season.nameSerieToShow = (season.nameSerie.length > 10) ? season.nameSerie.substring(0, 10) + '...' : season.nameSerie;
    //       }
    //     })
    //   }
    // }  
  }

  sendDetailsSerie(serie: Serie) {
      this.seasonSerieSelected.emit(serie);
  }

}