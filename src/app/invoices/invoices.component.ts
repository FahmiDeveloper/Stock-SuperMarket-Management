import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../shared/services/invoice.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  invoices$;

  constructor(private invoiceService: InvoiceService) {
    this.invoices$ = this.invoiceService.getAll();
   }

  ngOnInit(): void {
  }

}
