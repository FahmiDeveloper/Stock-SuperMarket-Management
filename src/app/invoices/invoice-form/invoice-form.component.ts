import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';

import { Invoice } from 'src/app/shared/models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {

  invoiceId;
  invoice: Invoice = new Invoice();
  suppliers$;

  constructor(
    private invoiceService: InvoiceService, 
    private router: Router, 
    private route: ActivatedRoute,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.getInvoiceData();
    if (!this.invoiceId) {
      this.generateCode();
    }
    this.loadListSuppliers();
  }

  getInvoiceData() {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if (this.invoiceId) {
        this.invoiceService
        .getInvoiceId(this.invoiceId)
        .valueChanges()
        .pipe(take(1))
        .subscribe(invoice => {
        this.invoice = invoice;
      });
    } else {
      this.invoice.date = moment().format('YYYY-MM-DD');
      this.invoice.time = moment().format('HH:mm');
    }
  }

  generateCode(){
    this.invoiceService
      .getAll()
      .subscribe((invoices: Invoice[]) => {
          if (invoices.length > 0) {
            for (let i = 0; i < invoices.length; i++) {
              if(invoices[i].code) {
                const code = invoices[i].code.split('Invoice_')[1].split('_');
                let newCode = (Number(code[0]) + 1).toString();
                this.invoice.code = "Invoice_" + newCode + "_" + moment().year();
              }
            }      
        } else {
          this.invoice.code = "Invoice_" + "1" + "_" + moment().year();
        }  
    });
  }

  loadListSuppliers() {
    this.suppliers$ = this.supplierService.getAll();
  }

  save(invoice) {
    if (this.invoiceId) {
      this.invoiceService.update(this.invoiceId, invoice);
      Swal.fire(
        'Invoice data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      this.invoiceService.create(invoice);
      Swal.fire(
        'New invoice added successfully',
        '',
        'success'
      )
    }
    this.router.navigate(['/invoices']);
  }

  cancel() {
    this.router.navigate(['/invoices']);
  }
}
