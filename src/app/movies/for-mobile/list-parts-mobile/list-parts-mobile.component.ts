
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
    selector: 'list-parts-mobile',
    templateUrl: './list-parts-mobile.component.html',
    styleUrls: ['./list-parts-mobile.scss']
})

export class ListPartsForMobileComponent implements OnChanges {

  @Input() listPartsByCurrentName: Movie[];
  @Output() partMovieSelected = new EventEmitter();

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    if (this.listPartsByCurrentName.length) {
      if (this.listPartsByCurrentName.length == 1) {
        this.listPartsByCurrentName.forEach(part => {
          if (part.fullNameMovie) {
            part.nameMovieToShow = (part.fullNameMovie.length > 30) ? part.fullNameMovie.substring(0, 30) + '...' : part.fullNameMovie;
          } else {
            part.nameMovieToShow = (part.nameMovie.length > 30) ? part.nameMovie.substring(0, 30) + '...' : part.nameMovie;
          }
        })
      } else {
        this.listPartsByCurrentName.forEach(part => {
          if (part.fullNameMovie) {
            part.nameMovieToShow = (part.fullNameMovie.length > 10) ? part.fullNameMovie.substring(0, 10) + '...' : part.fullNameMovie;
          } else {
            part.nameMovieToShow = (part.nameMovie.length > 10) ? part.nameMovie.substring(0, 10) + '...' : part.nameMovie;
          }
        })
      }
    }   
  }

  sendDetailsMovie(movie: Movie) {
    this.partMovieSelected.emit(movie);
  }

}