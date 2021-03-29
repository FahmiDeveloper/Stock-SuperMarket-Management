import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockOut } from 'src/app/shared/models/stock-out.model';
import { StockOutService } from 'src/app/shared/services/stock-out.service';

@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit, OnDestroy {
  
  stockOutProducts: StockOut[];
  filteredStockOutProducts: any[];
  subscription: Subscription;

  constructor(private stockOutService: StockOutService) {
    this.subscription = this.stockOutService.getAll()
    .subscribe(stockOutProducts => this.filteredStockOutProducts = this.stockOutProducts = stockOutProducts);
   }

  ngOnInit(): void {
  }

  delete(stockOutId) {
    if (!confirm('Are you sure you want to delete this stock out?')) return;

      this.stockOutService.delete(stockOutId);
  }

  filter(query: string) {
    this.filteredStockOutProducts = (query)
       ? this.stockOutProducts.filter(stockOutProduct => stockOutProduct.name.toLowerCase().includes(query.toLowerCase()))
       : this.stockOutProducts;
 }

 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

}
