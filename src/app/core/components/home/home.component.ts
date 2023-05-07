import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { MovieService } from 'src/app/shared/services/movie.service';
import { AnimeService } from 'src/app/shared/services/anime.service';
import { SerieService } from 'src/app/shared/services/serie.service';
import { ExpirationService } from 'src/app/shared/services/expiration.service';

import { Movie } from 'src/app/shared/models/movie.model';
import { Anime } from 'src/app/shared/models/anime.model';
import { Serie } from 'src/app/shared/models/serie.model';
import { Expiration } from 'src/app/shared/models/expiration.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isPortrait: boolean;

  nbrMoviesToCheckToday: number = 0;
  nbrAnimesToCheckToday: number = 0;
  nbrSeriesToCheckToday: number = 0;
  contentsExpiredList: Expiration[] = [];
  soonToExpireList: Expiration[] = [];

  subscriptionForGetAllMoviesToCheckToday: Subscription;
  subscriptionForGetAllAnimesToCheckToday: Subscription;
  subscriptionForGetAllSeriesToCheckToday: Subscription;
  subscriptionForGetAllSoonToExpire: Subscription;
  subscriptionForGetAllContentsExpired: Subscription;

  constructor(
    private deviceService: DeviceDetectorService,
    private bpObserable: BreakpointObserver,
    public expirationService: ExpirationService,
    private movieService: MovieService,
    private animeService: AnimeService,
    private serieService: SerieService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.isMobile = this.deviceService.isMobile();

    this.bpObserable
    .observe([
      '(orientation: portrait)',
    ])
    .subscribe(result => {
      if(result.matches){
        this.isPortrait = true;
      }
    });
    this.bpObserable
    .observe([
      '(orientation: landscape)',
    ])
    .subscribe(result => {
      if(result.matches){
        this.isPortrait = false;
      }
    });
    
    this.getAllMoviesToCheckToday();
    this.getAllAnimesToCheckToday();
    this.getAllSeriesToCheckToday();
    this.getAllSoonToExpire();
    this.getAllContentsExpired();
  }

  getAllMoviesToCheckToday() {
    this.subscriptionForGetAllMoviesToCheckToday = this.movieService
    .getAll()
    .subscribe((movies: Movie[]) => {
      this.nbrMoviesToCheckToday = movies.filter(movie => movie.statusId == 1 && movie.checkDate && movie.checkDate == moment().format('YYYY-MM-DD')).length;
    })
  }

  getAllAnimesToCheckToday() {
    this.subscriptionForGetAllAnimesToCheckToday = this.animeService
    .getAll()
    .subscribe((animes: Anime[]) => {
      this.nbrAnimesToCheckToday = animes.filter(anime => anime.statusId == 1 && anime.checkDate && anime.checkDate == moment().format('YYYY-MM-DD') &&
      (!anime.currentEpisode || (anime.currentEpisode && !anime.totalEpisodes) || (anime.currentEpisode && anime.currentEpisode && anime.currentEpisode < anime.totalEpisodes))).length;    
    })
  }

  getAllSeriesToCheckToday() {
    this.subscriptionForGetAllSeriesToCheckToday = this.serieService
    .getAll()
    .subscribe((series: Serie[]) => {
      this.nbrSeriesToCheckToday = series.filter(serie => serie.statusId == 1 && serie.checkDate && serie.checkDate == moment().format('YYYY-MM-DD') &&
      (!serie.currentEpisode || (serie.currentEpisode && !serie.totalEpisodes) || (serie.currentEpisode && serie.currentEpisode && serie.currentEpisode < serie.totalEpisodes))).length;
    })
  }

  getAllSoonToExpire() {
    this.subscriptionForGetAllSoonToExpire = this.expirationService
    .getAll()
    .subscribe((expirations: Expiration[]) => {

      this.soonToExpireList = [];

      expirations.forEach(expiration => {
        const now = new Date();
        const dateExpiration = (new Date(expiration.dateExpiration)).getTime();
        const nowTime = now.getTime();

        const diff = Math.abs(dateExpiration - nowTime);

        let diffEnDays  = Math.round(diff / (1000 * 60 * 60  * 24));

        var years = Math.floor(diffEnDays / 365);
        var months = Math.floor(diffEnDays % 365 / 30);
        var days = Math.floor(diffEnDays % 365 % 30);

        expiration.restdays = years + "Y " + months + "M " + days + "D";

        if (expiration.restdays == 0 + "Y " + 0 + "M " + 7 + "D") {
          this.soonToExpireList.push(expiration);
        }
      })
           
    });
  }

  getAllContentsExpired() {
    this.subscriptionForGetAllContentsExpired = this.expirationService
    .getAll()
    .subscribe((expirations: Expiration[]) => {

      this.contentsExpiredList = [];

      expirations.forEach(expiration => {
        let currentDate = new Date();
        let composedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let dateExpiration = new Date(expiration.dateExpiration);

        if (composedDate.getTime() > dateExpiration.getTime()) {
          this.contentsExpiredList.push(expiration);
        }
      })
           
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllMoviesToCheckToday.unsubscribe();
    this.subscriptionForGetAllAnimesToCheckToday.unsubscribe();
    this.subscriptionForGetAllSeriesToCheckToday.unsubscribe();
    this.subscriptionForGetAllSoonToExpire.unsubscribe();
    this.subscriptionForGetAllContentsExpired.unsubscribe();
  }
  
}