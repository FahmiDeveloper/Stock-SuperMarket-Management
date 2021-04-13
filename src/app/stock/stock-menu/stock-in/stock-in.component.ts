import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockIn } from 'src/app/shared/models/stock-in.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockInService } from 'src/app/shared/services/stock-in.service';
import { UserService } from 'src/app/shared/services/user.service';
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
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  queryDate: string = "";

  constructor(
    private stockInService: StockInService, 
    private productService: ProductService,
    public userService: UserService,
    public authService: AuthService
    ) {}

  ngOnInit() {
    this.getRolesUser();
    this.loadAllProductsInStock();
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService.isConnected.subscribe(res=>{
      if(res) {
        this.userService.getCurrentUser().then(user=>{
          if(user) {
            this.userService.get(user.uid).valueChanges().subscribe(dataUser=>{
              this.user = dataUser;
            });
          }
        });   
      }
    })
  }

  loadAllProductsInStock() {
    this.subscription = this.stockInService.getAll()
    .subscribe(stockInProducts => {
      this.filteredStockInProducts = this.stockInProducts = stockInProducts;
      this.getProductName();
    });
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

filterByDate() {
  this.filteredStockInProducts = (this.queryDate)
    ? this.stockInProducts.filter(invoice => invoice.date.includes(this.queryDate))
    : this.stockInProducts;
}

clear() {
  this.queryDate = "";
  this.loadAllProductsInStock();
}

 ngOnDestroy() {
   this.subscription.unsubscribe();
   this.subscriptionForGetProductName.unsubscribe();
 }

}
