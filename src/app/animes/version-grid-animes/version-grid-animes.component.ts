import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie } from 'src/app/shared/models/movie.model';
import { MovieService } from 'src/app/shared/services/movie.service';
import { Anime } from 'src/app/shared/models/anime.model';
import { AnimeService } from 'src/app/shared/services/anime.service';

@Component({
  selector: 'app-version-grid-animes',
  templateUrl: './version-grid-animes.component.html',
  styleUrls: ['./version-grid-animes.component.scss']
})
export class VersionGridAnimesComponent implements OnInit {

  animes: Anime[];
  filteredAnimes: Anime[];

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForGetCategoryName: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  categories$;
  categoryId: string;

  isGrid: boolean = false;

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
    this.isGrid = true;
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
        if(category.name) element.nameCategory = category.name;
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

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }

}
