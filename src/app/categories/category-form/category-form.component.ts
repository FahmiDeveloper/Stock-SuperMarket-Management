import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  save(category) {
    this.categoryService.create(category);
  }


}
