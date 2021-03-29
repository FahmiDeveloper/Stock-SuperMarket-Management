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

  delete(stockOutId) {
    if (!confirm('Are you sure you want to delete this stock out?')) return;

      this.stockOutService.delete(stockOutId);
  }

}
