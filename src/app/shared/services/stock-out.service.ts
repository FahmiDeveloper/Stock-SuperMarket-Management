import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockOutService {

  aflStockOutProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    this.aflStockOutProducts = this.db.list('/stockOut', stockout => stockout.orderByChild('key'));
    return this.aflStockOutProducts
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(stockOut) {
    return this.db.list('/stockOut').push(stockOut);
  }

  getStockOutId(stockOutId) {
    return this.db.object('/stockOut/' + stockOutId).valueChanges();
  }

  update(stockOutId, stockout) {
    return this.db.object('/stockOut/' + stockOutId).update(stockout);
  }
}
