import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Anime } from 'src/app/shared/models/anime.model';
import { AnimeService } from 'src/app/shared/services/anime.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewOrEditAnimeComponent } from './new-or-edit-anime/new-or-edit-anime.component';

@Component({
  selector: 'app-version-grid-animes',
  templateUrl: './version-grid-animes.component.html',
  styleUrls: ['./version-grid-animes.component.scss']
})
export class VersionGridAnimesComponent implements OnInit {

  animes: Anime[];
  filteredAnimes: Anime[];

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  isGrid: boolean = false;

  queryDate: string = "";

  constructor(
    private animeService: AnimeService, 
    public userService: UserService,
    public authService: AuthService,
    protected modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllAnimes();
    this.getRolesUser();
    this.isGrid = true;
  }

  getAllAnimes() {
    this.subscriptionForGetAllAnimes = this.animeService
      .getAll()
      .subscribe(movies => {
        this.filteredAnimes = this.animes = movies;
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
      ? this.animes.filter(product => product.date.includes(this.queryDate))
      : this.animes;
  }

  clear() {
    this.queryDate = "";
    this.getAllAnimes();
  }

  newAnime() {
    const modalRef = this.modalService.open(NewOrEditAnimeComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editAnime(anime?: Anime) {
    const modalRef = this.modalService.open(NewOrEditAnimeComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.anime = anime;
  }	

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
  }

}
