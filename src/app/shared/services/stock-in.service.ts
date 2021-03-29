import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockInService {

  aflStockInProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    this.aflStockInProducts = this.db.list('/stockIn', stockin => stockin.orderByChild('key'));
    return this.aflStockInProducts
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(stockIn) {
    return this.db.list('/stockIn').push(stockIn);
  }

  getStockInId(stockInId) {
    return this.db.object('/stockIn/' + stockInId).valueChanges();
  }

  update(stockInId, stockin) {
    return this.db.object('/stockIn/' + stockInId).update(stockin);
  }

  delete(stockInId) {
    return this.db.object('/stockIn/' + stockInId).remove();
  }
}
