
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
    selector: 'list-parts-desktop',
    templateUrl: './list-parts-desktop.component.html',
    styleUrls: ['./list-parts-desktop.scss']
})

export class ListPartsForDesktopComponent {

  @Input() listPartsByParentFilmKey: Movie[];
  @Output() partMovieSelected = new EventEmitter();

  sendDetailsMovie(movie: Movie) {
    this.partMovieSelected.emit(movie);
  }

}