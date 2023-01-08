
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
    selector: 'list-parts-desktop',
    templateUrl: './list-parts-desktop.component.html',
    styleUrls: ['./list-parts-desktop.scss']
})

export class ListPartsForDesktopComponent implements OnChanges {

  @Input() listPartsByCurrentName: Movie[];
  @Input() isTablet: boolean;
  @Input() isPortrait: boolean;
  @Output() partMovieSelected = new EventEmitter();

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    if (this.listPartsByCurrentName.length) {
      if (this.isTablet) {
        if (this.isPortrait) {
          if (this.listPartsByCurrentName.length == 2) {
            this.listPartsByCurrentName.forEach(part => {
              if (part.fullNameMovie) {
                part.nameMovieToShow = (part.fullNameMovie.length > 38) ? part.fullNameMovie.substring(0, 38) + '...' : part.fullNameMovie;
              } else {
                part.nameMovieToShow = (part.nameMovie.length > 38) ? part.nameMovie.substring(0, 38) + '...' : part.nameMovie;
              }
            })
          } else {
            this.listPartsByCurrentName.forEach(part => {
              if (part.fullNameMovie) {
                part.nameMovieToShow = (part.fullNameMovie.length > 22) ? part.fullNameMovie.substring(0, 22) + '...' : part.fullNameMovie;
              } else {
                part.nameMovieToShow = (part.nameMovie.length > 22) ? part.nameMovie.substring(0, 22) + '...' : part.nameMovie;
              }
            })
          }
        } else {
          if (this.listPartsByCurrentName.length == 2) {
            this.listPartsByCurrentName.forEach(part => {
              if (part.fullNameMovie) {
                part.nameMovieToShow = (part.fullNameMovie.length > 38) ? part.fullNameMovie.substring(0, 38) + '...' : part.fullNameMovie;
              } else {
                part.nameMovieToShow = (part.nameMovie.length > 38) ? part.nameMovie.substring(0, 38) + '...' : part.nameMovie;
              }
            })
          } else {
            this.listPartsByCurrentName.forEach(part => {
              if (part.fullNameMovie) {
                part.nameMovieToShow = (part.fullNameMovie.length > 32) ? part.fullNameMovie.substring(0, 32) + '...' : part.fullNameMovie;
              } else {
                part.nameMovieToShow = (part.nameMovie.length > 32) ? part.nameMovie.substring(0, 32) + '...' : part.nameMovie;
              }
            })
          }
        }         
      } else {
        this.listPartsByCurrentName.forEach(part => {
          if (part.fullNameMovie) {
            part.nameMovieToShow = (part.fullNameMovie.length > 39) ? part.fullNameMovie.substring(0, 39) + '...' : part.fullNameMovie;
          } else {
            part.nameMovieToShow = (part.nameMovie.length > 39) ? part.nameMovie.substring(0, 39) + '...' : part.nameMovie;
          }
        })
      }
    }
  }

  sendDetailsMovie(movie: Movie) {
    this.partMovieSelected.emit(movie);
  }

}