import { Component, OnInit } from '@angular/core';
import { StockInService } from 'src/app/shared/services/stock-in.service';

@Component({
  selector: 'app-stock-in-form',
  templateUrl: './stock-in-form.component.html',
  styleUrls: ['./stock-in-form.component.scss']
})
export class StockInFormComponent implements OnInit {

  constructor(private stockInService: StockInService) { }

  ngOnInit(): void {
  }

  save(stockIn) {
    this.stockInService.create(stockIn);
  }

}
