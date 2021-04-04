import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { Invoice } from 'src/app/shared/models/invoice.model';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import Swal from 'sweetalert2';

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
    ) {
    this.suppliers$ = this.supplierService.getAll();

    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if (this.invoiceId) {
      this.invoiceService.getInvoiceId(this.invoiceId).valueChanges().pipe(take(1)).subscribe(invoice => {
      this.invoice = invoice;
    });
    } else {
      this.invoice.date = moment().format('YYYY-MM-DD');
      this.invoice.time = moment().format('HH:mm');
    }
   }

  ngOnInit(): void {
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
