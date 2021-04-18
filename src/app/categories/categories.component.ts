import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ListProductsComponent } from './list-products/list-products.component';

import { AuthService } from '../shared/services/auth.service';
import { CategoryService } from '../shared/services/category.service';
import { UserService } from '../shared/services/user.service';

import { Category } from '../shared/models/category.model';
import { FirebaseUserModel } from '../shared/models/user.model';
import { ProductService } from '../shared/services/product.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: Category[];
  filteredCategories: any[];

  subscription: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  constructor(
    private categoryService: CategoryService, 
    protected modalService: NgbModal,
    public userService: UserService,
    public authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllCategories();
    this.getRolesUser();
  }

  getAllCategories() {
    this.subscription = this.categoryService
      .getAll()
      .subscribe(categories => {
        this.filteredCategories = this.categories = categories;
        this.getNbrProductsForEachCategory();
    });
  }

  getNbrProductsForEachCategory() {
    this.filteredCategories.forEach(element => {
      element.nbrProductsForEachCateogry = this.productService.countLengthProductsForEachCategory(element.key);
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

  delete(categoryId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.checkIfCategoryhasProducts(categoryId);
      }
    })
  }

  checkIfCategoryhasProducts(categoryId: string) {
    this.productService
      .countLengthProductsForEachCategory(categoryId)
      .pipe(take(1))
      .subscribe((res: number) => {
        let nbrProducts = res;
        if(nbrProducts > 0) {
          Swal.fire(
            'You should delete first the products for this category',
            '',
            'warning'
          ).then((result) => {
            if (result.value) {
              this.router.navigate(['/products']);
            }
          })
        } else {
          this.categoryService.delete(categoryId);
          Swal.fire(
            'Category has been deleted successfully',
            '',
            'success'
          )
        }
    });
  }

  filter(query: string) {
    this.filteredCategories = (query)
       ? this.categories.filter(category => category.name.toLowerCase().includes(query.toLowerCase()))
       : this.categories;
  }

  openListProducts(category: Category) {
    const modelref = this.modalService.open(ListProductsComponent as Component, { size: 'lg', centered: true });

    modelref.componentInstance.category = category;
    modelref.componentInstance.modelref = modelref;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
