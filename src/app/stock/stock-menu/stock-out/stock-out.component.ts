import { Component, OnInit } from '@angular/core';
import { StockOutService } from 'src/app/shared/services/stock-out.service';

@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit {
  
  stockOutProducts$;

  constructor(private stockOutService: StockOutService) {
    this.stockOutProducts$ = this.stockOutService.getAll();
   }

  ngOnInit(): void {
  }

}
