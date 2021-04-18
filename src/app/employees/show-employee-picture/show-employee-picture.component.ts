import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { EmployeeService } from 'src/app/shared/services/employee.service';

import { Employee } from 'src/app/shared/models/employee.model';

@Component({
  selector: 'show-employee-picture',
  templateUrl: './show-employee-picture.component.html',
  styleUrls: ['./show-employee-picture.component.scss']
})
export class ShowEmployeePictureComponent implements OnInit {

  @Input() employee: Employee = new Employee();

  pictureEmployee: string;
  basePath = '/PicturesEmployees';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  constructor(
    public modalService: NgbModal, 
    private fireStorage: AngularFireStorage, 
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
  }

  showEmployeeImage(contentEmployeePicture) {
    this.modalService.open(contentEmployeePicture, { size: 'lg', centered: true });
    this.pictureEmployee = this.employee.imageUrl;
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.pictureEmployee = this.employee.imageUrl = url;
        this.employeeService.update(this.employee.key, this.employee);
        this.modalService.dismissAll();
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.pictureEmployee = '';
    }
  }
}
