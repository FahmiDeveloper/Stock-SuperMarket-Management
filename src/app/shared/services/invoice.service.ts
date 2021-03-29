import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  aflInvoices: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    this.aflInvoices = this.db.list('/invoices', invoice => invoice.orderByChild('key'));
    return this.aflInvoices
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(invoice) {
    return this.db.list('/invoices').push(invoice);
  }

  getInvoiceId(invoiceId) {
    return this.db.object('/invoices/' + invoiceId).valueChanges();
  }

  update(invoiceId, invoice) {
    return this.db.object('/invoices/' + invoiceId).update(invoice);
  }

  delete(invoiceId) {
    return this.db.object('/invoices/' + invoiceId).remove();
  }
}
