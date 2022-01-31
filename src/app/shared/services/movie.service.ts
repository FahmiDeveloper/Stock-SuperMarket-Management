import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  aflistMovies: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getAll() {
    this.aflistMovies = this.db.list('/movies', movie => movie.orderByChild('key'));
    return this.aflistMovies
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(movie) {
    return this.db.list('/movies').push(movie);
  }

  getMovieId(movieId: string): AngularFireObject<Movie> {
    return this.db.object('/movies/' + movieId);
  }

  update(movieId, movie) {
    return this.db.object('/movies/' + movieId).update(movie);
  }

  delete(movieId) {
    return this.db.object('/movies/' + movieId).remove();
  }

  countLengthMovies(): Observable<number> {
    return this.db.list('/movies').valueChanges().pipe(map(response => response.length));
  }

  countLengthMoviesForEachCategory(categoryId: string): Observable<number> {
    return this.db.list('/movies')
      .valueChanges()
      .pipe(map((response: Movie[]) => response.filter(element => element.categoryId == categoryId).length));
  }
}