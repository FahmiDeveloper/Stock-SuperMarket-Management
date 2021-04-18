import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  aflInvoices: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

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

  getInvoiceId(invoiceId: string): AngularFireObject<Invoice> {
    return this.db.object('/invoices/' + invoiceId);
  }

  update(invoiceId, invoice) {
    return this.db.object('/invoices/' + invoiceId).update(invoice);
  }

  delete(invoiceId) {
    return this.db.object('/invoices/' + invoiceId).remove();
  }

  countLengthInvoices(): Observable<number> {
    return this.db.list('/invoices').valueChanges().pipe(map(response => response.length));
  }

  countLengthInvoicesForEachSupplier(supplierId: string): Observable<number> {
    return this.db.list('/invoices')
      .valueChanges()
      .pipe(map((response: Invoice[]) => response.filter(element => element.supplierId == supplierId).length));
  }
}
