
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MovieFormDesktopComponent } from '../movie-form-desktop/movie-form-desktop.component';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-parts-desktop',
    templateUrl: './list-parts-desktop.component.html',
    styleUrls: ['./list-parts-desktop.scss']
})

export class ListPartsForDesktopComponent implements OnChanges {

    @Input() listPartsByCurrentName: Movie[];
    @Input() currentName: string;
    @Input() dataUserConnected: FirebaseUserModel;
    @Input() allMovies: Movie[];

    dataSource = new MatTableDataSource<Movie>();
    displayedColumns: string[] = ['picture', 'details'];

    movieToDelete: Movie = new Movie();
    modalRefDeleteMovie: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };

    statusMovies: StatusMovies[] = [
        {id: 1, status: 'Wait to sort'}, 
        {id: 2, status: 'Not downloaded yet'}, 
        {id: 3, status: 'Watched'}, 
        {id: 4, status: 'Downloaded but not watched yet'},
        {id: 5, status: 'To search about it'}
      ];

    constructor(public dialogService: MatDialog, private movieService: MovieService) {}
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {
        this.dataSource.data = this.listPartsByCurrentName.sort((n1, n2) => n1.priority - n2.priority);
        this.getStatusMovie();
        this.dataSource.paginator = this.paginator;
    }

    getStatusMovie() {
      this.dataSource.data.forEach(element=>{
        this.statusMovies.forEach(statusMovie => {
          if (statusMovie.id == element.statusId) {
            element.status = statusMovie.status;
            element.note = element.note ? element.note : '-';
          }
        })
      })
    }

    copyNameMovie(nameMovie: string){
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = nameMovie;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }

    onContextMenu(event: MouseEvent, movie: Movie) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'movie': movie };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }

    editMovie(movie: Movie) {
      const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '800px'});
      dialogRef.componentInstance.movie = movie;
      dialogRef.componentInstance.allMovies = this.allMovies;
      dialogRef.componentInstance.fromModalPartsList = true;
    }

    openDeleteMovieModal(movie: Movie, contentDeleteMovie) {
      this.movieToDelete = movie;
      this.modalRefDeleteMovie =  this.dialogService.open(contentDeleteMovie, {
        width: '30vw',
        height:'35vh',
        maxWidth: '100vw'
      }); 
    }

    confirmDelete() {
      const indexOfitem = this.dataSource.data.findIndex(res => res.key ===this.movieToDelete.key);
      if (indexOfitem > -1) {
          for (let i = 0; i < this.dataSource.data.length; i++) {
              if (this.dataSource.data[i].priority > this.movieToDelete.priority)
              this.dataSource.data[i].priority = this.dataSource.data[i].priority - 1;
              this.movieService.update(this.dataSource.data[i].key, this.dataSource.data[i]);
          }
          this.dataSource.data.splice(indexOfitem, 1);
          this.movieService.delete(this.movieToDelete.key);  
      }     
    }

    close() {
      this.modalRefDeleteMovie.close();
    }

}