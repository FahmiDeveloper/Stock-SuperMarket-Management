import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  aflistProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

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

  getProductId(productId) {
    return this.db.object('/products/' + productId).valueChanges();
  }

  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }

}
