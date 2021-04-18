import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockOut } from '../models/stock-out.model';

@Injectable({
  providedIn: 'root'
})
export class StockOutService {

  aflStockOutProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

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

  getStockOutId(stockOutId: string): AngularFireObject<StockOut> {
    return this.db.object('/stockOut/' + stockOutId);
  }

  update(stockOutId, stockout) {
    return this.db.object('/stockOut/' + stockOutId).update(stockout);
  }

  delete(stockOutId) {
    return this.db.object('/stockOut/' + stockOutId).remove();
  }

  countLengthStockOut(): Observable<number> {
    return this.db.list('/stockOut').valueChanges().pipe(map(response => response.length));
  }

  countLengthProductsInStockOut(productId: string): Observable<number> {
    return this.db.list('/stockOut')
      .valueChanges()
      .pipe(map((response: StockOut[]) => response.filter(element => element.productId == productId).length));
  }
}
