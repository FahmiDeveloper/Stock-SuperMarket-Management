import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/shared/services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {

  constructor(private invoiceService: InvoiceService, private router: Router) { }

  ngOnInit(): void {
  }

  save(invoice) {
    this.invoiceService.create(invoice);
    this.router.navigate(['/invoices']);
  }

}
