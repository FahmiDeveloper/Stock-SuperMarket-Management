import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AnimeFormComponent } from './anime-form/anime-form.component';

import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { AnimeService } from '../shared/services/anime.service';

import { FirebaseUserModel } from '../shared/models/user.model';
import { Anime } from '../shared/models/anime.model';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})

export class AnimesComponent implements OnInit, OnDestroy {

  filteredAnimes: Anime[];
  p: number = 1;
  // queryDate: string = "";
  queryName: string = "";
  queryNote: string = "";
  statusId: number;

  user: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private animeService: AnimeService, 
    public userService: UserService,
    public authService: AuthService,
    protected modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllAnimes();
    this.getRolesUser();
  }

  getAllAnimes() {
    this.subscriptionForGetAllAnimes = this.animeService
    .getAll()
    .subscribe(animes => {
      if (this.queryName) 
      this.filteredAnimes = animes.filter(anime => anime.nameAnime.toLowerCase().includes(this.queryName.toLowerCase()));
      
      else if (this.queryNote) 
      this.filteredAnimes = animes.filter(anime => anime.note.toLowerCase().includes(this.queryNote.toLowerCase()));
      
      // else if (this.queryDate) 
      // this.filteredAnimes = animes.filter(anime => anime.date.includes(this.queryDate));
      
      else if (this.statusId) 
      this.filteredAnimes = animes.filter(anime => anime.statusId == this.statusId);   
      
      else this.filteredAnimes = animes;

      this.getStatusAnime();
    });
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
                this.userService
                  .get(user.uid)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.user = dataUser;
                });
              }
          });   
        }
    })
  }

  delete(animeId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this anime!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.animeService.delete(animeId);
        Swal.fire(
          'Anime has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  clear() {
    // this.queryDate = "";
    this.queryName = "";
    this.statusId = null;
    this.getAllAnimes();
  }

  getStatusAnime() {
    this.filteredAnimes.forEach(element=>{
      this.statusAnimes.forEach(statusAnime => {
        if (statusAnime.id == element.statusId) {
          element.status = statusAnime.status;
          element.note = element.note ? element.note : '-';
        }
      })
    })
  }

  newAnime() {
    const modalRef = this.modalService.open(AnimeFormComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editAnime(anime?: Anime) {
    const modalRef = this.modalService.open(AnimeFormComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.anime = anime;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForUser.unsubscribe();
  }
}

export interface StatusAnimes {
  id: number,
  status: string
}
