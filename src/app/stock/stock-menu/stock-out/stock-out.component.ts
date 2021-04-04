import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockOut } from 'src/app/shared/models/stock-out.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockOutService } from 'src/app/shared/services/stock-out.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit, OnDestroy {
  
  stockOutProducts: StockOut[];
  filteredStockOutProducts: StockOut[];
  subscription: Subscription;
  subscriptionForGetProductName: Subscription;

  p: number = 1;

  constructor(private stockOutService: StockOutService, private productService: ProductService) {
    this.subscription = this.stockOutService.getAll()
    .subscribe(stockOutProducts => {
      this.filteredStockOutProducts = this.stockOutProducts = stockOutProducts;
      this.getProductName();
    });
   }

  ngOnInit(): void {
  }

  delete(stockOutId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this stock out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.stockOutService.delete(stockOutId);
        Swal.fire(
          'Stock out has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  filter(query: string) {
    this.filteredStockOutProducts = (query)
       ? this.stockOutProducts.filter(stockOutProduct => stockOutProduct.productName.toLowerCase().includes(query.toLowerCase()))
       : this.stockOutProducts;
 }

 getProductName() {
  this.filteredStockOutProducts.forEach(element=>{
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
