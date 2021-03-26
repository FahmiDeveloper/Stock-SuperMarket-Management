import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private db: AngularFireDatabase) { }

  create(invoice) {
    return this.db.list('/invoices').push(invoice);
  }
}
