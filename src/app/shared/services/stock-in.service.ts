import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockIn } from '../models/stock-in.model';

@Injectable({
  providedIn: 'root'
})
export class StockInService {

  aflStockInProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

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

  getStockInId(stockInId: string): AngularFireObject<StockIn> {
    return this.db.object('/stockIn/' + stockInId);
  }

  update(stockInId, stockin) {
    return this.db.object('/stockIn/' + stockInId).update(stockin);
  }

  delete(stockInId) {
    return this.db.object('/stockIn/' + stockInId).remove();
  }

  countLengthStockIn(): Observable<number> {
    return this.db.list('/stockIn').valueChanges().pipe(map(response => response.length));
  }

  countLengthProductsInStockIn(productId: string): Observable<number> {
    return this.db.list('/stockIn')
      .valueChanges()
      .pipe(map((response: StockIn[]) => response.filter(element => element.productId == productId).length));
  }
}
