import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/services/auth.service';
import { CategoryService } from '../shared/services/category.service';
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
  subscriptionForGetCategoryName: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  categories$;
  categoryId: string;

  queryDate: string = "";

  constructor(
    private animeService: AnimeService, 
    private categoryService: CategoryService,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllAnimes();
    this.getRolesUser();
    this.loadListCategories();
  }

  getAllAnimes() {
    this.subscriptionForGetAllAnimes = this.animeService
      .getAll()
      .subscribe(movies => {
        this.filteredAnimes = this.animes = movies;
        this.getCategoryName();
    });
  }

  getCategoryName() {
    this.filteredAnimes.forEach(element=>{
      this.subscriptionForGetCategoryName =  this.categoryService
      .getCategoryId(String(element.categoryId))
      .valueChanges()
      .subscribe(category => {   
        if(category) element.nameCategory = category.name;
      });
    })
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

  loadListCategories() {
    this.categories$ = this.categoryService.getAll();
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

  filetrByCategory() {
    this.filteredAnimes = (this.categoryId)
        ? this.animes.filter(element=>element.categoryId==this.categoryId)
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

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }

}
