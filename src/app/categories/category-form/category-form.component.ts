import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  categoryId;
  category: Category = new Category();
  subscription: Subscription;

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute) { 
    this.categoryId = this.route.snapshot.paramMap.get('id');
        if (this.categoryId) {
          this.categoryService.getCategoryId(this.categoryId).valueChanges().pipe(take(1)).subscribe(category => {   
          this.category = category;
        });
      }
  }

  ngOnInit(): void {
  }

  save(category) {
    if (this.categoryId) this.categoryService.update(this.categoryId, category);
    else this.categoryService.create(category);
    this.router.navigate(['/categories']);
  }
}



