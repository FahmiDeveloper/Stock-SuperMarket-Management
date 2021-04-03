import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Invoice } from '../shared/models/invoice.model';
import { InvoiceService } from '../shared/services/invoice.service';
import { SupplierService } from '../shared/services/supplier.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {

  invoices: Invoice[];
  filteredInvoices: Invoice[];
  subscription: Subscription;
  subscriptionForGetSupplierName: Subscription;

  p: number = 1;

  constructor(private invoiceService: InvoiceService, private supplierService: SupplierService) {
    this.subscription = this.invoiceService.getAll()
    .subscribe(invoices => {
      this.filteredInvoices = this.invoices = invoices;
      this.getSupplierName();
    });
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

 getSupplierName() {
  this.filteredInvoices.forEach(element=>{
    this.subscriptionForGetSupplierName =  this.supplierService
    .getSupplierId(String(element.supplierId))
    .valueChanges()
    .subscribe(supplier => {   
      if(supplier.name) element.nameSupplier = supplier.name;
    });
  })
 }

 ngOnDestroy() {
   this.subscription.unsubscribe();
   this.subscriptionForGetSupplierName.unsubscribe();
 }

}
