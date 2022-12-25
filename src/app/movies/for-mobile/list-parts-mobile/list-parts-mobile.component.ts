
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowMoviePictureComponent } from '../../show-movie-picture/show-movie-picture.component';
import { MovieFormMobileComponent } from '../movie-form-mobile/movie-form-mobile.component';

import { MovieService } from 'src/app/shared/services/movie.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';


@Component({
    selector: 'list-parts-mobile',
    templateUrl: './list-parts-mobile.component.html',
    styleUrls: ['./list-parts-mobile.scss']
})

export class ListPartsForMobileComponent implements OnChanges {

    @Input() listPartsByCurrentName: Movie[];
    @Input() currentName: string;
    @Input() dataUserConnected: FirebaseUserModel;
    @Input() allMovies: Movie[];

    dataSource = new MatTableDataSource<Movie>();
    displayedColumns: string[] = ['picture', 'fullName', 'status', 'part', 'note', 'star'];

    movieToDelete: Movie = new Movie();
    modalRefDeleteMovie: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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

    zoomPicture(movie: Movie) {
      const dialogRef = this.dialogService.open(ShowMoviePictureComponent, {
        width: '98vw',
        height:'77vh',
        maxWidth: '100vw'
      });
      dialogRef.componentInstance.movieForModal = movie;
      dialogRef.componentInstance.dialogRef = dialogRef;
    }

    editMovie(movie?: Movie) {
      const dialogRef = this.dialogService.open(MovieFormMobileComponent, {
        width: '98vw',
        height:'73vh',
        maxWidth: '100vw'
      });
      dialogRef.componentInstance.movie = movie;
    }

    openDeleteMovieModal(movie: Movie, contentDeleteMovie) {
      this.movieToDelete = movie;
      this.modalRefDeleteMovie =  this.dialogService.open(contentDeleteMovie, {
        width: '98vw',
        height:'50vh',
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