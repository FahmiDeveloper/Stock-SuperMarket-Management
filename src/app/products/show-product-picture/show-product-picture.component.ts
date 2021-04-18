import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { ProductService } from 'src/app/shared/services/product.service';

import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'show-product-picture',
  templateUrl: './show-product-picture.component.html',
  styleUrls: ['./show-product-picture.component.scss']
})
export class ShowProductPictureComponent implements OnInit {

  @Input() product: Product = new Product();
  @Input() isGrid: boolean;

  pictureProduct: string;
  basePath = '/PicturesProducts';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  constructor(
    public modalService: NgbModal, 
    private fireStorage: AngularFireStorage, 
    private productService: ProductService
  ) {}

  ngOnInit() {
  }

  showProductImage(contentProductPicture) {
    this.modalService.open(contentProductPicture, { size: 'lg', centered: true });
    this.pictureProduct = this.product.imageUrl;
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.pictureProduct = this.product.imageUrl = url;
        this.productService.update(this.product.key, this.product);
        this.modalService.dismissAll();
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.pictureProduct = '';
    }
   }
}
