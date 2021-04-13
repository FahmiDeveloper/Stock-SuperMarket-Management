import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockOut } from 'src/app/shared/models/stock-out.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockOutService } from 'src/app/shared/services/stock-out.service';
import { UserService } from 'src/app/shared/services/user.service';
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
    this.getRolesUser();
    this.loadAllProductsOutStock();
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

  loadAllProductsOutStock() {
    this.subscription = this.stockOutService.getAll()
    .subscribe(stockOutProducts => {
      this.filteredStockOutProducts = this.stockOutProducts = stockOutProducts;
      this.getProductName();
    });
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

 filterByDate() {
  this.filteredStockOutProducts = (this.queryDate)
    ? this.stockOutProducts.filter(invoice => invoice.date.includes(this.queryDate))
    : this.stockOutProducts;
}

clear() {
  this.queryDate = "";
  this.loadAllProductsOutStock();
}

 ngOnDestroy() {
   this.subscription.unsubscribe();
   this.subscriptionForGetProductName.unsubscribe();

 }

}
