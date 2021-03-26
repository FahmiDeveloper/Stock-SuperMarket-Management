import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/shared/services/invoice.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
  }

  save(invoice) {
    this.invoiceService.create(invoice);
  }

}
