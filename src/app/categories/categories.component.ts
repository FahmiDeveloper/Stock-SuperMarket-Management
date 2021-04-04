import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Category } from '../shared/models/category.model';
import { CategoryService } from '../shared/services/category.service';
import { ListProductsComponent } from './list-products/list-products.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: Category[];
  filteredCategories: any[];
  subscription: Subscription;

  p: number = 1;

  constructor(private categoryService: CategoryService, protected modalService: NgbModal) { 
    this.subscription = this.categoryService.getAll()
    .subscribe(categories => this.filteredCategories = this.categories = categories);
  }

  ngOnInit(): void {
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
        this.categoryService.delete(categoryId);
        Swal.fire(
          'Category has been deleted successfully',
          '',
          'success'
        )
      }
    })
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
