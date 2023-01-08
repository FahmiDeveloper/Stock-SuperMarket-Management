import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'list-seasons-desktop',
    templateUrl: './list-seasons-desktop.component.html',
    styleUrls: ['./list-seasons-desktop.scss']
})

export class ListSeasonsForDesktopComponent implements OnChanges {

  @Input() listSeriesByCurrentName: Serie[];
  @Input() isPortrait: boolean;
  @Input() isTablet: boolean;

  @Output() seasonSerieSelected = new EventEmitter();

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    if (this.listSeriesByCurrentName.length) {
      if (this.isTablet) {
        if (this.isPortrait) {
          if (this.listSeriesByCurrentName.length == 2) {
            this.listSeriesByCurrentName.forEach(season => {
              if (season.fullNameSerie) {
                season.nameSerieToShow = (season.fullNameSerie.length > 38) ? season.fullNameSerie.substring(0, 38) + '...' : season.fullNameSerie;
              } else {
                season.nameSerieToShow = (season.nameSerie.length > 38) ? season.nameSerie.substring(0, 38) + '...' : season.nameSerie;
              }
            })
          } else {
            this.listSeriesByCurrentName.forEach(season => {
              if (season.fullNameSerie) {
                season.nameSerieToShow = (season.fullNameSerie.length > 22) ? season.fullNameSerie.substring(0, 22) + '...' : season.fullNameSerie;
              } else {
                season.nameSerieToShow = (season.nameSerie.length > 22) ? season.nameSerie.substring(0, 22) + '...' : season.nameSerie;
              }
            })
          }
        } else {
          if (this.listSeriesByCurrentName.length == 2) {
            this.listSeriesByCurrentName.forEach(season => {
              if (season.fullNameSerie) {
                season.nameSerieToShow = (season.fullNameSerie.length > 38) ? season.fullNameSerie.substring(0, 38) + '...' : season.fullNameSerie;
              } else {
                season.nameSerieToShow = (season.nameSerie.length > 38) ? season.nameSerie.substring(0, 38) + '...' : season.nameSerie;
              }
            })
          } else {
            this.listSeriesByCurrentName.forEach(season => {
              if (season.fullNameSerie) {
                season.nameSerieToShow = (season.fullNameSerie.length > 32) ? season.fullNameSerie.substring(0, 32) + '...' : season.fullNameSerie;
              } else {
                season.nameSerieToShow = (season.nameSerie.length > 32) ? season.nameSerie.substring(0, 32) + '...' : season.nameSerie;
              }
            })
          }
        }    
      } else {
        this.listSeriesByCurrentName.forEach(season => {
          if (season.fullNameSerie) {
            season.nameSerieToShow = (season.fullNameSerie.length > 39) ? season.fullNameSerie.substring(0, 39) + '...' : season.fullNameSerie;
          } else {
            season.nameSerieToShow = (season.nameSerie.length > 39) ? season.nameSerie.substring(0, 39) + '...' : season.nameSerie;
          }
        })
      }
    } 
  }

  sendDetailsSerie(serie: Serie) {
      this.seasonSerieSelected.emit(serie);
  }

}