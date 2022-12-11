
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowAnimePictureComponent } from 'src/app/animes/show-anime-picture/show-anime-picture.component';
import { NewOrEditAnimeComponent } from 'src/app/animes/version-grid-animes/new-or-edit-anime/new-or-edit-anime.component';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime } from 'src/app/shared/models/anime.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-animes-by-status-mobile',
    templateUrl: './list-animes-by-status-mobile.component.html',
    styleUrls: ['./list-animes-by-status-mobile.scss']
})

export class ListAnimesByStatusForMobileComponent implements OnChanges {

    @Input() listAnimes: Anime[];
    @Input() currentStatusForAnime: number;
    @Input() dataUserConnected: FirebaseUserModel;

    dataSource = new MatTableDataSource<Anime>();
    displayedColumns: string[] = ['picture', 'name', 'type', 'season', 'note', 'star'];

    animeToDelete: Anime = new Anime();

    sortByDesc: boolean = true;
    queryName: string = '';
    modalRefDeleteAnime: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(public dialogService: MatDialog, private animeService: AnimeService) {}
    
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

    sortByRefAnimeDesc() {
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
        this.sortByDesc = true;
    }
    
    sortByRefAnimeAsc() {
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefAnime - n2.numRefAnime);
        this.sortByDesc = false;
    }

    filterAnimes() {
        if (this.currentStatusForAnime == 1) {
            if (this.queryName) {
                this.filterAnimesByNameAndStatus(this.queryName, 1);
            } else {
                this.filterAnimesByNameAndStatus('', 1);
            }
        } else if (this.currentStatusForAnime == 2) {
            if (this.queryName) {
                this.filterAnimesByNameAndStatus(this.queryName, 2);
            } else {
                this.filterAnimesByNameAndStatus('', 2);
            }
        } else if (this.currentStatusForAnime == 3) {
            if (this.queryName) {
                this.filterAnimesByNameAndStatus(this.queryName, 3);
            } else {
                this.filterAnimesByNameAndStatus('', 3);
            }
        }  else if (this.currentStatusForAnime == 4) {
            if (this.queryName) {
                this.filterAnimesByNameAndStatus(this.queryName, 4);
            } else {
                this.filterAnimesByNameAndStatus('', 4);
            }
        } else {
            if (this.queryName) {
                this.filterAnimesByNameAndStatus(this.queryName, 5);
            } else {
                this.filterAnimesByNameAndStatus('', 5);
            }
        }       
    }

    filterAnimesByNameAndStatus(queryName: string, statusAnime: number) {
        if (queryName) {
            this.dataSource.data = this.listAnimes.filter(anime => (anime.nameAnime.toLowerCase().includes(queryName.toLowerCase())) && (anime.statusId == statusAnime));
        } else {
            this.dataSource.data = this.listAnimes.filter(anime => anime.statusId == statusAnime);
        }
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.priority - n2.priority);
    }

    editAnime(anime: Anime) {
        const dialogRef = this.dialogService.open(NewOrEditAnimeComponent, {
            width: '98vw',
            height:'73vh',
            maxWidth: '100vw'
        });
        dialogRef.componentInstance.anime = anime;
    }

    openDeleteAnimeModal(anime: Anime, contentDeleteAnime) {
        this.animeToDelete = anime;
        this.modalRefDeleteAnime =  this.dialogService.open(contentDeleteAnime, {
            width: '98vw',
            height:'50vh',
            maxWidth: '100vw'
        }); 
    }
    
    confirmDelete() {
        this.animeService.delete(this.animeToDelete.key);
    }
    
    close() {
        this.modalRefDeleteAnime.close();
    }

}