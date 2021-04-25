import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  categories$;

  basePath = '/PicturesProducts';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  productId;
  product: Product = new Product();

  constructor(
    private categoryService: CategoryService, 
    private productService: ProductService, 
    private fireStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.getProductData();
    this.loadListCategories();
  }

  getProductData() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService
        .getProductId(this.productId)
        .valueChanges()
        .pipe(take(1))
        .subscribe(product => {
          this.product = product;
      });
    } else {
      this.product.date = moment().format('YYYY-MM-DD');
      this.product.time = moment().format('HH:mm');
    }
  }

  loadListCategories() {
    this.categories$ = this.categoryService.getAll();
  }

  save(product) {
    this.productService
      .checkIfProductNameExistInTable(product.nameProduct)
      .pipe(take(1))
      .subscribe((res: number) => {
          if(res) {
            Swal.fire(
              'Product name already exist!',
              '',
              'warning'
            )
          } else {
            this.createOrUpdateProduct(product);
          }
    })
  }

  createOrUpdateProduct(product) {
    if (this.productId) {
        this.productService.update(this.productId, product);
        Swal.fire(
          'Product data has been Updated successfully',
          '',
          'success'
        )
      }
      else {
        this.productService.create(product);
        Swal.fire(
          'New product added successfully',
          '',
          'success'
        )
      }
      this.router.navigate(['/products']);
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {this.product.imageUrl = url; });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.product.imageUrl = '';
    }
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
