import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'list-seasons-desktop',
    templateUrl: './list-seasons-desktop.component.html',
    styleUrls: ['./list-seasons-desktop.scss']
})

export class ListSeasonsForDesktopComponent {

    @Input() listSeriesByCurrentName: Serie[];
    @Output() seasonSerieSelected = new EventEmitter();

    sendDetailsSerie(serie: Serie) {
        this.seasonSerieSelected.emit(serie);
    }

}