import { Component, OnDestroy, OnInit } from '@angular/core';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Product } from '../shared/models/product.model';
import { FirebaseUserModel } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { CategoryService } from '../shared/services/category.service';
import { ProductService } from '../shared/services/product.service';
import { UserService } from '../shared/services/user.service';

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

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService,
    public userService: UserService,
    public authService: AuthService
    ) {
    this.subscriptionForGetAllProducts = this.productService.getAll()
    .subscribe(products => {
      this.filteredProducts = this.products = products;
      this.getCategoryName();
    });
    this.categories$ = this.categoryService.getAll();
   }

  ngOnInit(): void {
    this.getRolesUser();
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

  getCategoryName() {
    this.filteredProducts.forEach(element=>{
      this.subscriptionForGetCategoryName =  this.categoryService
      .getCategoryId(String(element.categoryId))
      .valueChanges()
      .subscribe(category => {   
        if(category.name) element.nameCategory = category.name;
      });
    })
  }

  filetrByCategory() {
    this.filteredProducts = (this.categoryId)
        ? this.products.filter(element=>element.categoryId==this.categoryId)
        : this.products;
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

  ngOnDestroy() {
    this.subscriptionForGetAllProducts.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }

}
