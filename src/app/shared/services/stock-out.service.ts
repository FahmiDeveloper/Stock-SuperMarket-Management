import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class StockOutService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('/stockOut').valueChanges(); 
  }

  create(stockOut) {
    return this.db.list('/stockOut').push(stockOut);
  }
}
