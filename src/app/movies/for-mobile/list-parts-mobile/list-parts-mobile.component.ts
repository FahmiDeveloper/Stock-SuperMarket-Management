
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
    selector: 'list-parts-mobile',
    templateUrl: './list-parts-mobile.component.html',
    styleUrls: ['./list-parts-mobile.scss']
})

export class ListPartsForMobileComponent {

  @Input() listPartsByParentFilmKey: Movie[];
  @Output() partMovieSelected = new EventEmitter();

  sendDetailsMovie(movie: Movie) {
    this.partMovieSelected.emit(movie);
  }

}