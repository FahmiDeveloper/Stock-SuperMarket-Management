import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories$;

  constructor(private categoryService: CategoryService) { 
    this.categories$ = this.categoryService.getAll();
  }

  ngOnInit(): void {
  }

}
