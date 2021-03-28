import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class StockInService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('/stockIn').valueChanges(); 
  }

  create(stockIn) {
    return this.db.list('/stockIn').push(stockIn);
  }
}
