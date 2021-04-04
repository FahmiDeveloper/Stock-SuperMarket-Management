import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockIn } from 'src/app/shared/models/stock-in.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockInService } from 'src/app/shared/services/stock-in.service';
import Swal from 'sweetalert2';

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

  p: number = 1;

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
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this stock in!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.stockInService.delete(stockInId);
        Swal.fire(
          'Stock in has been deleted successfully',
          '',
          'success'
        )
      }
    })
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
