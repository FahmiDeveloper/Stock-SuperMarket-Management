import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { InvoiceService } from 'src/app/shared/services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {

  invoiceId;
  invoice = {};

  constructor(private invoiceService: InvoiceService, private router: Router, private route: ActivatedRoute) {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if (this.invoiceId) {
      this.invoiceService.getInvoiceId(this.invoiceId).pipe(take(1)).subscribe(invoice => {
      this.invoice = invoice;
    });
  }
   }

  ngOnInit(): void {
  }

  save(invoice) {
    if (this.invoiceId) this.invoiceService.update(this.invoiceId, invoice);
    else this.invoiceService.create(invoice);
    this.router.navigate(['/invoices']);
  }

}
