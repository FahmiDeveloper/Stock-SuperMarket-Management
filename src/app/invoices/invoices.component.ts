import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Invoice } from '../shared/models/invoice.model';
import { InvoiceService } from '../shared/services/invoice.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {

  invoices: Invoice[];
  filteredInvoices: any[];
  subscription: Subscription;

  constructor(private invoiceService: InvoiceService) {
    this.subscription = this.invoiceService.getAll()
    .subscribe(invoices => this.filteredInvoices = this.invoices = invoices);;;
   }

  ngOnInit(): void {
  }

  delete(invoiceId) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

      this.invoiceService.delete(invoiceId);
  }

  filter(query: string) {
    this.filteredInvoices = (query)
       ? this.invoices.filter(invoice => invoice.code.toLowerCase().includes(query.toLowerCase()))
       : this.invoices;
 }

 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

}
