import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/services/auth.service';
import { CategoryService } from '../shared/services/category.service';
import { ProductService } from '../shared/services/product.service';
import { UserService } from '../shared/services/user.service';

import { Product } from '../shared/models/product.model';
import { FirebaseUserModel } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { StockInService } from '../shared/services/stock-in.service';
import { StockOutService } from '../shared/services/stock-out.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  filteredProducts: Product[];

  subscriptionForGetAllProducts: Subscription;
  subscriptionForGetCategoryName: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  categories$;
  categoryId: string;

  queryDate: string = "";

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService,
    public userService: UserService,
    public authService: AuthService,
    private stockInService: StockInService,
    private stockOutService: StockOutService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.getRolesUser();
    this.loadListCategories();
  }

  getAllProducts() {
    this.subscriptionForGetAllProducts = this.productService
      .getAll()
      .subscribe(products => {
        this.filteredProducts = this.products = products;
        this.getCategoryName();
    });
  }

  getCategoryName() {
    this.filteredProducts.forEach(element=>{
      this.subscriptionForGetCategoryName =  this.categoryService
      .getCategoryId(String(element.categoryId))
      .valueChanges()
      .subscribe(category => {   
        if(category) element.nameCategory = category.name;
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

  loadListCategories() {
    this.categories$ = this.categoryService.getAll();
  }

  delete(productId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.checkIfProductExistInStockIn(productId);
      }
    })
  }

  checkIfProductExistInStockIn(productId: string) {
    this.stockInService
      .countLengthProductsInStockIn(productId)
      .pipe(take(1))
      .subscribe((resStockIn: number) => {
        let nbrProductInStockIn = resStockIn;
        if(nbrProductInStockIn > 0) {
          Swal.fire(
            'You should delete this product from stock in',
            '',
            'warning'
          ).then((result) => {
            if (result.value) {
              this.router.navigate(['/stock-in']);
            }
          })
        } else {
          this.checkIfProductExistInStockOut(productId);
        }
    });
  }

  checkIfProductExistInStockOut(productId: string) {
    this.stockOutService
      .countLengthProductsInStockOut(productId)
      .pipe(take(1))
      .subscribe((resStockOut: number) => {
        let nbrProductInStockOut = resStockOut;
        if(nbrProductInStockOut > 0) {
          Swal.fire(
            'You should delete this product from stock out',
            '',
            'warning'
          ).then((result) => {
            if (result.value) {
              this.router.navigate(['/stock-out']);
            }
          })
        } else {
            this.productService.delete(productId);
            Swal.fire(
              'Product has been deleted successfully',
              '',
              'success'
            )
        }
    })
  }

  filter(query: string) {
     this.filteredProducts = (query)
        ? this.products.filter(product => product.nameProduct.toLowerCase().includes(query.toLowerCase()))
        : this.products;
  }

  filetrByCategory() {
    this.filteredProducts = (this.categoryId)
        ? this.products.filter(element=>element.categoryId==this.categoryId)
        : this.products;
  }

  filterByDate() {
    this.filteredProducts = (this.queryDate)
      ? this.products.filter(product => product.date.includes(this.queryDate))
      : this.products;
  }

  clear() {
    this.queryDate = "";
    this.getAllProducts();
  }

  ngOnDestroy() {
    this.subscriptionForGetAllProducts.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }
}
