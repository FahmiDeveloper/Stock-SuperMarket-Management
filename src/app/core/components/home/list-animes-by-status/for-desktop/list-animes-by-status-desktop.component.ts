
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
    selector: 'list-animes-by-status-desktop',
    templateUrl: './list-animes-by-status-desktop.component.html',
    styleUrls: ['./list-animes-by-status-desktop.scss']
})

export class ListAnimesByStatusForDesktopComponent implements OnChanges {

    @Input() listAnimes: Anime[];
    @Input() currentStatusForAnime: number;

    dataSource = new MatTableDataSource<Anime>();
    displayedColumns: string[] = ['picture', 'details'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {

        if (this.currentStatusForAnime == 1) {
            this.dataSource.data = this.listAnimes.filter(anime => anime.statusId == 1);
        } else if (this.currentStatusForAnime == 2) {
            this.dataSource.data = this.listAnimes.filter(anime => anime.statusId == 2);
        } else if (this.currentStatusForAnime == 3) {
            this.dataSource.data = this.listAnimes.filter(anime => anime.statusId == 3);
        } else if (this.currentStatusForAnime == 4) {
            this.dataSource.data = this.listAnimes.filter(anime => anime.statusId == 4);
        } else {
            this.dataSource.data = this.listAnimes.filter(anime => anime.statusId == 5);
        }
        this.dataSource.paginator = this.paginator;

    }

    copyNameAnime(nameAnime: string){
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = nameAnime;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    onContextMenu(event: MouseEvent, anime: Anime) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'anime': anime };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

}