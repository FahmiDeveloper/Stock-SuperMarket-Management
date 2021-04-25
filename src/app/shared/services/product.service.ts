import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  aflistProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getAll() {
    this.aflistProducts = this.db.list('/products', product => product.orderByChild('key'));
    return this.aflistProducts
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(product) {
    return this.db.list('/products').push(product);
  }

  getProductId(productId: string): AngularFireObject<Product> {
    return this.db.object('/products/' + productId);
  }

  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }

  countLengthProducts(): Observable<number> {
    return this.db.list('/products').valueChanges().pipe(map(response => response.length));
  }

  countLengthProductsForEachCategory(categoryId: string): Observable<number> {
    return this.db.list('/products')
      .valueChanges()
      .pipe(map((response: Product[]) => response.filter(element => element.categoryId == categoryId).length));
  }

  checkIfProductNameExistInTable(productName: string): Observable<number> {
    return this.db.list('/products')
      .valueChanges()
      .pipe(map((response: Product[]) => response.filter(element => element.nameProduct == productName).length));
  }
}
