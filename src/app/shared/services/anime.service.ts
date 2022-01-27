import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Anime } from '../models/anime.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  aflistAnimes: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getAll() {
    this.aflistAnimes = this.db.list('/animes', anime => anime.orderByChild('key'));
    return this.aflistAnimes
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(anime) {
    return this.db.list('/animes').push(anime);
  }

  getAnimeId(animeId: string): AngularFireObject<Anime> {
    return this.db.object('/animes/' + animeId);
  }

  update(animeId, anime) {
    return this.db.object('/animes/' + animeId).update(anime);
  }

  delete(animeId) {
    return this.db.object('/animes/' + animeId).remove();
  }

  countLengthAnimes(): Observable<number> {
    return this.db.list('/animes').valueChanges().pipe(map(response => response.length));
  }

  countLengthAnimesForEachCategory(categoryId: string): Observable<number> {
    return this.db.list('/animes')
      .valueChanges()
      .pipe(map((response: Anime[]) => response.filter(element => element.categoryId == categoryId).length));
  }

  checkIfMovieNameExistInTable(animeName: string): Observable<number> {
    return this.db.list('/animes')
      .valueChanges()
      .pipe(map((response: Anime[]) => response.filter(element => element.nameAnime == animeName).length));
  }
}