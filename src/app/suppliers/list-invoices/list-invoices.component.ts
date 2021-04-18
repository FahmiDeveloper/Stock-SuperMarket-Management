import { Component, OnInit } from '@angular/core';

import { InvoiceService } from 'src/app/shared/services/invoice.service';

import { Invoice } from 'src/app/shared/models/invoice.model';
import { Supplier } from 'src/app/shared/models/supplier.model';

@Component({
  selector: 'app-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})

export class ListInvoicesComponent implements OnInit {

  supplier: Supplier = new Supplier();
  listInvoices: Invoice[];
  modelref: any;
  
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.loadAllInvoices();
  }

  loadAllInvoices() {
    this.invoiceService
      .getAll()
      .subscribe((invoices: Invoice[]) => {
          this.getListInvoicesForSupplier(invoices);
    });
  }

  getListInvoicesForSupplier(invoices: Invoice[]) {
    this.listInvoices = [];
    this.listInvoices = invoices.filter(element=>element.supplierId==this.supplier.key);
  }

  closeModal() {
    this.modelref.close();
  }
}
