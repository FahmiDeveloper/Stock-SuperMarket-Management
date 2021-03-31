import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Category } from '../shared/models/category.model';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: Category[];
  filteredCategories: any[];
  subscription: Subscription;

  constructor(private categoryService: CategoryService, protected modalService: NgbModal) { 
    this.subscription = this.categoryService.getAll()
    .subscribe(categories => this.filteredCategories = this.categories = categories);
  }

  ngOnInit(): void {
  }

  delete(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;

      this.categoryService.delete(categoryId);
  }

  filter(query: string) {
    this.filteredCategories = (query)
       ? this.categories.filter(category => category.name.toLowerCase().includes(query.toLowerCase()))
       : this.categories;
 }

 openListProducts(category: Category) {
  // const modelref = this.modalService.open(ListProductsComponent as Component, { size: 'lg', centered: true });

  // modelref.componentInstance.category = category;
  // modelref.componentInstance.modelref = modelref;
}


 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

}
