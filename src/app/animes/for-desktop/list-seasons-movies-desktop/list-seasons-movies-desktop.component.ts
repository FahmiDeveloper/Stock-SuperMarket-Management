import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
    selector: 'list-seasons-movies-desktop',
    templateUrl: './list-seasons-movies-desktop.component.html',
    styleUrls: ['./list-seasons-movies-desktop.scss']
})

export class ListSeasonsMoviesForDesktopComponent implements OnChanges {

    @Input() listAnimesByCurrentName: Anime[];
    @Input() isPortrait: boolean;
    @Input() isTablet: boolean;

    @Output() seasonAnimeSelected = new EventEmitter();

    ngOnChanges(changes: import("@angular/core").SimpleChanges) {
      if (this.listAnimesByCurrentName.length) {
        if (this.isTablet) {
          if (this.isPortrait) {
            if (this.listAnimesByCurrentName.length == 2) {
              this.listAnimesByCurrentName.forEach(season => {
                if (season.fullNameAnime) {
                  season.nameAnimeToShow = (season.fullNameAnime.length > 38) ? season.fullNameAnime.substring(0, 38) + '...' : season.fullNameAnime;
                } else {
                  season.nameAnimeToShow = (season.nameAnime.length > 38) ? season.nameAnime.substring(0, 38) + '...' : season.nameAnime;
                }
              })
            } else {
              this.listAnimesByCurrentName.forEach(season => {
                if (season.fullNameAnime) {
                  season.nameAnimeToShow = (season.fullNameAnime.length > 28) ? season.fullNameAnime.substring(0, 28) + '...' : season.fullNameAnime;
                } else {
                  season.nameAnimeToShow = (season.nameAnime.length > 28) ? season.nameAnime.substring(0, 28) + '...' : season.nameAnime;
                }
              })
            }
          } else {
            if (this.listAnimesByCurrentName.length == 2) {
              this.listAnimesByCurrentName.forEach(season => {
                if (season.fullNameAnime) {
                  season.nameAnimeToShow = (season.fullNameAnime.length > 38) ? season.fullNameAnime.substring(0, 38) + '...' : season.fullNameAnime;
                } else {
                  season.nameAnimeToShow = (season.nameAnime.length > 38) ? season.nameAnime.substring(0, 38) + '...' : season.nameAnime;
                }
              })
            } else {
              this.listAnimesByCurrentName.forEach(season => {
                if (season.fullNameAnime) {
                  season.nameAnimeToShow = (season.fullNameAnime.length > 35) ? season.fullNameAnime.substring(0, 35) + '...' : season.fullNameAnime;
                } else {
                  season.nameAnimeToShow = (season.nameAnime.length > 35) ? season.nameAnime.substring(0, 35) + '...' : season.nameAnime;
                }
              })
            }
          }    
        } else {
          this.listAnimesByCurrentName.forEach(season => {
            if (season.fullNameAnime) {
              season.nameAnimeToShow = (season.fullNameAnime.length > 39) ? season.fullNameAnime.substring(0, 39) + '...' : season.fullNameAnime;
            } else {
              season.nameAnimeToShow = (season.nameAnime.length > 39) ? season.nameAnime.substring(0, 39) + '...' : season.nameAnime;
            }
          })
        }     
      }
    }

    sendDetailsAnime(anime: Anime) {
        this.seasonAnimeSelected.emit(anime);
    }
    
}