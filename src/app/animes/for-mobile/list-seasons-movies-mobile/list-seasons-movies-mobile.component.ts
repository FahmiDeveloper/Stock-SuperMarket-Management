import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
    selector: 'list-seasons-movies-mobile',
    templateUrl: './list-seasons-movies-mobile.component.html',
    styleUrls: ['./list-seasons-movies-mobile.scss']
})

export class ListSeasonsMoviesForMobileComponent implements OnChanges {

  @Input() listAnimesByCurrentName: Anime[];
  @Output() seasonAnimeSelected = new EventEmitter();

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    // if (this.listAnimesByCurrentName.length) {
    //   if (this.listAnimesByCurrentName.length == 1) {
    //     this.listAnimesByCurrentName.forEach(season => {
    //       if (season.fullNameAnime) {
    //         season.nameAnimeToShow = (season.fullNameAnime.length > 30) ? season.fullNameAnime.substring(0, 30) + '...' : season.fullNameAnime;
    //       } else {
    //         season.nameAnimeToShow = (season.nameAnime.length > 30) ? season.nameAnime.substring(0, 30) + '...' : season.nameAnime;
    //       }
    //     })
    //   } else {
    //     this.listAnimesByCurrentName.forEach(season => {
    //       if (season.fullNameAnime) {
    //         season.nameAnimeToShow = (season.fullNameAnime.length > 10) ? season.fullNameAnime.substring(0, 10) + '...' : season.fullNameAnime;
    //       } else {
    //         season.nameAnimeToShow = (season.nameAnime.length > 10) ? season.nameAnime.substring(0, 10) + '...' : season.nameAnime;
    //       }
    //     })
    //   }
    // }
  }

  sendDetailsAnime(anime: Anime) {
      this.seasonAnimeSelected.emit(anime);
  }

}