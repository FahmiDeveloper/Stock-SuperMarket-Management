import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockIn } from 'src/app/shared/models/stock-in.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockInService } from 'src/app/shared/services/stock-in.service';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit, OnDestroy {
  
  stockInProducts: StockIn[];
  filteredStockInProducts: StockIn[];
  subscription: Subscription;
  subscriptionForGetProductName: Subscription;

  constructor(private stockInService: StockInService, private productService: ProductService) { 
    this.subscription = this.stockInService.getAll()
    .subscribe(stockInProducts => {
      this.filteredStockInProducts = this.stockInProducts = stockInProducts;
      this.getProductName();
    });
  }

  ngOnInit(): void {
  }

  delete(stockInId) {
    if (!confirm('Are you sure you want to delete this stock in?')) return;

      this.stockInService.delete(stockInId);
  }

  filter(query: string) {
    this.filteredStockInProducts = (query)
       ? this.stockInProducts.filter(stockInProduct => stockInProduct.productName.toLowerCase().includes(query.toLowerCase()))
       : this.stockInProducts;
 }

 getProductName() {
  this.filteredStockInProducts.forEach(element=>{
    this.subscriptionForGetProductName =  this.productService
    .getProductId(element.productId)
    .valueChanges()
    .subscribe(product => {   
      if(product.nameProduct) element.productName = product.nameProduct;
    });
  })
 }

 ngOnDestroy() {
   this.subscription.unsubscribe();
   this.subscriptionForGetProductName.unsubscribe();
 }

}
