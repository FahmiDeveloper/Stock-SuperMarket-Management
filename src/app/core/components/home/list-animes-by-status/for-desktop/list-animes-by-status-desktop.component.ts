
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AnimeFormComponent } from 'src/app/animes';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime } from 'src/app/shared/models/anime.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-animes-by-status-desktop',
    templateUrl: './list-animes-by-status-desktop.component.html',
    styleUrls: ['./list-animes-by-status-desktop.scss']
})

export class ListAnimesByStatusForDesktopComponent implements OnChanges {

    @Input() listAnimes: Anime[];
    @Input() currentStatusForAnime: number;
    @Input() dataUserConnected: FirebaseUserModel;

    dataSource = new MatTableDataSource<Anime>();
    displayedColumns: string[] = ['picture', 'details'];

    animeToDelete: Anime = new Anime();

    sortByDesc: boolean = true;
    queryName: string = '';
    modalRefDeleteAnime: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };

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
        const dialogRef = this.dialogService.open(AnimeFormComponent, {width: '800px'});
        dialogRef.componentInstance.anime = anime;
    }

    openDeleteAnimeModal(anime: Anime, contentDeleteAnime) {
        this.animeToDelete = anime;
        this.modalRefDeleteAnime =  this.dialogService.open(contentDeleteAnime, {
          width: '30vw',
          height:'35vh',
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