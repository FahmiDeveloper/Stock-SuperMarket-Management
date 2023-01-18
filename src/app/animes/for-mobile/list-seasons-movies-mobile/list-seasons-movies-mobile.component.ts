import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
    selector: 'list-seasons-movies-mobile',
    templateUrl: './list-seasons-movies-mobile.component.html',
    styleUrls: ['./list-seasons-movies-mobile.scss']
})

export class ListSeasonsMoviesForMobileComponent {

  @Input() listSeasonsByParentAnimeKey: Anime[];
  @Output() seasonAnimeSelected = new EventEmitter();

  sendDetailsAnime(anime: Anime) {
    this.seasonAnimeSelected.emit(anime);
  }

}