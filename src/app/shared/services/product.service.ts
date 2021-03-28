import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // listProducts: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list('/products').valueChanges(); 
  }

  // getAll() {
  //   this.listProducts = this.db.list('/products');
  //   return this.listProducts
  //    .snapshotChanges()
  //    .pipe(map(changes => changes.reverse()
  //    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  // }
}
