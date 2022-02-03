import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

import { FirebaseUserModel } from '../shared/models/user.model';

import { Anime } from '../shared/models/anime.model';
import { AnimeService } from '../shared/services/anime.service';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})
export class AnimesComponent implements OnInit, OnDestroy {

  animes: Anime[];
  filteredAnimes: Anime[];

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  queryDate: string = "";

  statusId: number;

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
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllAnimes();
    this.getRolesUser();
  }

  getAllAnimes() {
    this.subscriptionForGetAllAnimes = this.animeService
      .getAll()
      .subscribe(movies => {
        this.filteredAnimes = this.animes = movies;
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

  filter(query: string) {
     this.filteredAnimes = (query)
        ? this.animes.filter(anime => anime.nameAnime.toLowerCase().includes(query.toLowerCase()))
        : this.animes;
  }

  filterByDate() {
    this.filteredAnimes = (this.queryDate)
      ? this.animes.filter(anime => anime.date.includes(this.queryDate))
      : this.animes;
  }

  clear() {
    this.queryDate = "";
    this.getAllAnimes();
  }

  getStatusAnime() {
    this.filteredAnimes.forEach(element=>{

      this.statusAnimes.forEach(statusAnime => {
        if (statusAnime.id == element.statusId) {
             element.status = statusAnime.status;
        }
      })
    })
  }

  filetrByStatus() {
    this.filteredAnimes = (this.statusId)
      ? this.animes.filter(anime => anime.statusId == this.statusId)
      : this.animes;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
  }

}

export interface StatusAnimes {
  id: number,
  status: string
}
