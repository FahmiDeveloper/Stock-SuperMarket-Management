import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Serie } from '../models/serie.model';

@Injectable({
  providedIn: 'root'
})
export class SerieService {

  aflistSeries: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getAll() {
    this.aflistSeries = this.db.list('/series', serie => serie.orderByChild('key'));
    return this.aflistSeries
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(serie) {
    return this.db.list('/series').push(serie);
  }

  update(serieId, serie) {
    return this.db.object('/series/' + serieId).update(serie);
  }

  delete(serieId) {
    return this.db.object('/series/' + serieId).remove();
  }
}