import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
  }

  save(category) {
    this.categoryService.create(category);
    this.router.navigate(['/categories']);
  }


}
