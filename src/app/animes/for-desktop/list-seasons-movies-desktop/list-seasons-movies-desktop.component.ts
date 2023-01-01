import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
    selector: 'list-seasons-movies-desktop',
    templateUrl: './list-seasons-movies-desktop.component.html',
    styleUrls: ['./list-seasons-movies-desktop.scss']
})

export class ListSeasonsMoviesForDesktopComponent {

    @Input() listAnimesByCurrentName: Anime[];
    @Output() seasonAnimeSelected = new EventEmitter();

    sendDetailsAnime(anime: Anime) {
        this.seasonAnimeSelected.emit(anime);
    }
    
}