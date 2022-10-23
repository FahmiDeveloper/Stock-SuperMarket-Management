
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowAnimePictureComponent } from 'src/app/animes/show-anime-picture/show-anime-picture.component';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
    selector: 'list-animes-by-status-mobile',
    templateUrl: './list-animes-by-status-mobile.component.html',
    styleUrls: ['./list-animes-by-status-mobile.scss']
})

export class ListAnimesByStatusForMobileComponent implements OnChanges {

    @Input() listAnimes: Anime[];
    @Input() currentStatusForAnime: number;

    dataSource = new MatTableDataSource<Anime>();
    displayedColumns: string[] = ['picture', 'name', 'note', 'star'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(public dialogService: MatDialog) {}
    
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

    zoomPicture(anime: Anime) {
        const dialogRef = this.dialogService.open(ShowAnimePictureComponent, {
          width: '98vw',
          height:'77vh',
          maxWidth: '100vw'
        });
        dialogRef.componentInstance.animeForModal = anime;
        dialogRef.componentInstance.dialogRef = dialogRef;
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

}