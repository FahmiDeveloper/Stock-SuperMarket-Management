import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class StockOutService {

  constructor(private db: AngularFireDatabase) { }

  create(stockOut) {
    return this.db.list('/stockOut').push(stockOut);
  }
}
