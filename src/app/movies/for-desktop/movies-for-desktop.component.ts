import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';

import { MovieFormDesktopComponent } from './movie-form-desktop/movie-form-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MovieService } from '../../shared/services/movie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Movie, StatusMovies } from '../../shared/models/movie.model';
import { TypesFiles } from 'src/app/shared/models/file-upload.model';

@Component({
  selector: 'movies-for-desktop',
  templateUrl: './movies-for-desktop.component.html',
  styleUrls: ['./movies-for-desktop.scss']
})

export class MoviesForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Movie>();
  dataSourceCopie = new MatTableDataSource<Movie>();
  displayedColumns: string[] = ['picture', 'details'];
  allMovies: Movie[] = [];
  listPartsByCurrentName: Movie[] = [];

  movieToDelete: Movie = new Movie();

  queryName: string = '';
  queryNote: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  modalRefDeleteMovie: any;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'},
    {id: 6, status: 'Parts'}
  ];

  typesFiles: TypesFiles[] = [
    {id: 1, title: 'Pictures', type: 'Picture', icon: '/assets/pictures/picture-file.jpg'},
    {id: 2, title: 'Pdf', type: 'Pdf', icon: '/assets/pictures/pdf-file.jpg'},
    {id: 3, title: 'Excel', type: 'Excel', icon: '/assets/pictures/excel-file.png'}, 
    {id: 4, title: 'Text doc', type: 'Text document', icon: '/assets/pictures/txt-file.PNG'},
    {id: 5, title: 'Zip', type: 'Zip', icon: '/assets/pictures/zip-file.PNG'},
    {id: 6, title: 'Links', type: 'Links', icon: '/assets/pictures/links.png'},
    {id: 7, title: 'Word', type: 'Word', icon: '/assets/pictures/word-file.jpg'}
  ];

  constructor(
    private movieService: MovieService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.getAllMovies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
            .getCurrentUser()
            .then(user=>{
              if(user) {
                let connectedUserFromList: FirebaseUserModel = new FirebaseUserModel();

                this.subscriptionForGetAllUsers = this.usersListService
                .getAll()
                .subscribe((users: FirebaseUserModel[]) => { 
                  connectedUserFromList = users.find(element => element.email == user.email);

                  this.usersListService
                  .get(connectedUserFromList.key)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.dataUserConnected = dataUser;
                  });
                });
              }
          });   
        }
    })
  }

  getAllMovies() {
    this.subscriptionForGetAllMovies = this.movieService
    .getAll()
    .subscribe(movies => {
      this.dataSourceCopie.data = movies.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);

      if (this.queryName) {
        this.dataSource.data = movies.filter(movie => (movie.nameMovie.toLowerCase().includes(this.queryName.toLowerCase()) && (movie.isFirst == true)));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else if (this.statusId) {
        if (this.statusId == 6) this.dataSource.data = movies.filter(movie => (movie.part) && (movie.isFirst == true));

        else this.dataSource.data = movies.filter(movie => (movie.statusId == this.statusId) && (movie.isFirst == true) && (!movie.part));
           
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else this.allMovies = movies.filter(movie => movie.isFirst == true).sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);

      this.getStatusMovie();
    });
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

  newMovie() {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '800px', data: {movie: {}}});
    dialogRef.componentInstance.arrayMovies = this.dataSourceCopie.data;
    dialogRef.componentInstance.allMovies = this.allMovies;
  }

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '800px'});
    dialogRef.componentInstance.movie = movie;
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
    this.movieService.delete(this.movieToDelete.key);
  }

  close() {
    this.modalRefDeleteMovie.close();
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

  sortByRefMovieDesc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
    this.sortByDesc = true;
  }

  sortByRefMovieAsc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefMovie - n2.numRefMovie);
    this.sortByDesc = false;
  }

  onContextMenu(event: MouseEvent, movie: Movie) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'movie': movie };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  viewParts(currentMovie: Movie, contentPartsList) {
    this.currentName = currentMovie.nameMovie
    this.listPartsByCurrentName = this.allMovies.filter(movie => (movie.nameMovie.toLowerCase() == (currentMovie.nameMovie.toLowerCase())));

    this.dialogService.open(contentPartsList, {
      width: '40vw',
      height:'70vh',
      maxWidth: '100vw'
    }); 
  }

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}