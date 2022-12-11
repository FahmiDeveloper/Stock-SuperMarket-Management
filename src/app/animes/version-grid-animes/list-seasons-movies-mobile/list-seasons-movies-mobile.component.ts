
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowAnimePictureComponent } from 'src/app/animes/show-anime-picture/show-anime-picture.component';
import { NewOrEditAnimeComponent } from '../new-or-edit-anime/new-or-edit-anime.component';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-seasons-movies-mobile',
    templateUrl: './list-seasons-movies-mobile.component.html',
    styleUrls: ['./list-seasons-movies-mobile.scss']
})

export class ListSeasonsMoviesForMobileComponent implements OnChanges {

    @Input() listAnimesByCurrentName: Anime[];
    @Input() currentName: string;
    @Input() dataUserConnected: FirebaseUserModel;
    @Input() allAnimes: Anime[];

    dataSource = new MatTableDataSource<Anime>();
    displayedColumns: string[] = ['picture', 'type', 'status', 'season', 'note', 'star'];

    animeToDelete: Anime = new Anime();
    modalRefDeleteAnime: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    statusAnimes: StatusAnimes[] = [
        {id: 1, status: 'Wait to sort'}, 
        {id: 2, status: 'Not downloaded yet'}, 
        {id: 3, status: 'Watched'}, 
        {id: 4, status: 'Downloaded but not watched yet'},
        {id: 5, status: 'To search about it'}
    ];

    constructor(public dialogService: MatDialog, private animeService: AnimeService) {}
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {
        this.dataSource.data = this.listAnimesByCurrentName.sort((n1, n2) => n1.priority - n2.priority);
        this.getStatusAnime();
        this.dataSource.paginator = this.paginator;
    }

    getStatusAnime() {
        this.dataSource.data.forEach(element=>{
          this.statusAnimes.forEach(statusAnime => {
            if (statusAnime.id == element.statusId) {
              element.status = statusAnime.status;
              element.note = element.note ? element.note : '-';
            }
          })
        })
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

    zoomPicture(anime: Anime) {
        const dialogRef = this.dialogService.open(ShowAnimePictureComponent, {
          width: '98vw',
          height:'77vh',
          maxWidth: '100vw'
        });
        dialogRef.componentInstance.animeForModal = anime;
        dialogRef.componentInstance.dialogRef = dialogRef;
    }

    editAnime(anime?: Anime) {
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
        const indexOfitem = this.dataSource.data.findIndex(res => res.key ===this.animeToDelete.key);
        if (indexOfitem > -1) {
            for (let i = 0; i < this.dataSource.data.length; i++) {
                if (this.dataSource.data[i].priority > this.animeToDelete.priority)
                this.dataSource.data[i].priority = this.dataSource.data[i].priority - 1;
                this.animeService.update(this.dataSource.data[i].key, this.dataSource.data[i]);
            }
            this.dataSource.data.splice(indexOfitem, 1);
            this.animeService.delete(this.animeToDelete.key);  
        }     
    }

    close() {
       this.modalRefDeleteAnime.close();
    }

}