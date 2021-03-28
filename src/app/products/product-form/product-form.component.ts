import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  categories$;

  basePath = '/PicturesProducts';
  imageUrl = '';                      
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  productId;
  product = {};

  constructor(
    private categoryService: CategoryService, 
    private productService: ProductService, 
    private fireStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.categories$ = this.categoryService.getAll();

    this.productId = this.route.snapshot.paramMap.get('id');
        if (this.productId) {
          this.productService.getProductId(this.productId).pipe(take(1)).subscribe(product => {
          this.product = product;
        });
      }
  }

  ngOnInit(): void {
  }

  save(product) {
    this.productService.create(product);
    this.router.navigate(['/products']);
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
       const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
       this.task =  this.fireStorage.upload(filePath, file);    // upload task
 
       // this.progress = this.snapTask.percentageChanges();
       this.progressValue = this.task.percentageChanges();
 
       (await this.task).ref.getDownloadURL().then(url => {this.imageUrl = url; });  // <<< url is found here
 
     } else {  
       alert('No images selected');
       this.imageUrl = '';
      }
   }

}
