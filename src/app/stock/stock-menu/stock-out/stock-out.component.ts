import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockOutService } from 'src/app/shared/services/stock-out.service';
import { UserService } from 'src/app/shared/services/user.service';

import { StockOut } from 'src/app/shared/models/stock-out.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

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
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  queryDate: string = "";

  constructor(
    private stockOutService: StockOutService, 
    private productService: ProductService,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllProductsOutStock();
    this.getRolesUser();
  }

  getAllProductsOutStock() {
    this.subscription = this.stockOutService
      .getAll()
      .subscribe(stockOutProducts => {
        this.filteredStockOutProducts = this.stockOutProducts = stockOutProducts;
        this.getProductName();
    });
  }

  getProductName() {
    this.filteredStockOutProducts.forEach(element=>{
      this.subscriptionForGetProductName =  this.productService
        .getProductId(element.productId)
        .valueChanges()
        .subscribe(product => {   
          if(product) element.productName = product.nameProduct;
        });
      })
   }

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
            .getCurrentUser()
            .then(user=>{
              if(user) {
                this.userService
                  .get(user.uid)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.user = dataUser;
                });
              }
          });   
        }
    })
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

  filterByDate() {
    this.filteredStockOutProducts = (this.queryDate)
      ? this.stockOutProducts.filter(invoice => invoice.date.includes(this.queryDate))
      : this.stockOutProducts;
  }

  clear() {
    this.queryDate = "";
    this.getAllProductsOutStock();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionForGetProductName.unsubscribe();
  }
}
