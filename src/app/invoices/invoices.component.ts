import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
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

  suppliers$;
  supplierId: string;

  constructor(private invoiceService: InvoiceService, private supplierService: SupplierService) {
    this.subscription = this.invoiceService.getAll()
    .subscribe(invoices => {
      this.filteredInvoices = this.invoices = invoices;
      this.getSupplierName();
    });
    this.suppliers$ = this.supplierService.getAll();
   }

  ngOnInit(): void {
  }

  delete(invoiceId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this invoice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.invoiceService.delete(invoiceId);
        Swal.fire(
          'Invoice has been deleted successfully',
          '',
          'success'
        )
      }
    })
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

 filetrBySupplier() {
  this.filteredInvoices = (this.supplierId)
      ? this.invoices.filter(element=>element.supplierId==this.supplierId)
      : this.invoices;
}

 ngOnDestroy() {
   this.subscription.unsubscribe();
   this.subscriptionForGetSupplierName.unsubscribe();
 }

}
