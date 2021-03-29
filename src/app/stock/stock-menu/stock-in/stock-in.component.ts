import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockInService } from 'src/app/shared/services/stock-in.service';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit, OnDestroy {
  
  stockInProducts: any[];
  filteredStockInProducts: any[];
  subscription: Subscription;

  constructor(private stockInService: StockInService) { 
    this.subscription = this.stockInService.getAll().subscribe(stockInProducts => this.filteredStockInProducts = this.stockInProducts = stockInProducts);
  }

  ngOnInit(): void {
  }

  delete(stockInId) {
    if (!confirm('Are you sure you want to delete this stock in?')) return;

      this.stockInService.delete(stockInId);
  }

  filter(query: string) {
    this.filteredStockInProducts = (query)
       ? this.stockInProducts.filter(stockInProduct => stockInProduct.name.toLowerCase().includes(query.toLowerCase()))
       : this.stockInProducts;
 }

 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

}
