import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CategoryService } from 'src/app/shared/services/category.service';

import { Category } from 'src/app/shared/models/category.model';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  categoryId;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService, 
    private router: Router, 
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.getCategoryData();
  }

  getCategoryData() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.categoryService
        .getCategoryId(this.categoryId)
        .valueChanges()
        .pipe(take(1))
        .subscribe(category => {
          this.category = category;
        });
    } else {
      this.category.date = moment().format('YYYY-MM-DD');
      this.category.time = moment().format('HH:mm');
    }
  }

  save(category) {
    if (this.categoryId) {
      this.categoryService.update(this.categoryId, category);
      Swal.fire(
        'Category data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      this.categoryService.create(category);
      Swal.fire(
        'New category added successfully',
        '',
        'success'
      )
    }
    this.router.navigate(['/categories']);
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}



