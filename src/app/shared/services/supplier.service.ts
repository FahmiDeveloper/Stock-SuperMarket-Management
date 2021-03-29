import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  aflSuppliers: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    this.aflSuppliers = this.db.list('/suppliers', supplier => supplier.orderByChild('key'));
    return this.aflSuppliers
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(supplier) {
    return this.db.list('/suppliers').push(supplier);
  }

  getSupplierId(supplierId) {
    return this.db.object('/suppliers/' + supplierId).valueChanges();
  }

  update(supplierId, supplier) {
    return this.db.object('/suppliers/' + supplierId).update(supplier);
  }

  delete(supplierId) {
    return this.db.object('/suppliers/' + supplierId).remove();
  }
}
