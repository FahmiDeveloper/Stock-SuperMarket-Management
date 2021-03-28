import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EmployeeService } from 'src/app/shared/services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

  basePath = '/PicturesEmployees';
  imageUrl = '';                      
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  cinPhoneNumberPattern = "^((\\+91-?)|0)?[0-9]{8}$";

  id;
  employee = {};

  constructor(
    private employeeService: EmployeeService,
    private fireStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute
    ) {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
          this.employeeService.getEmployeeId(this.id).pipe(take(1)).subscribe(employee => {
          this.employee = employee;
        });
      }
    }

  ngOnInit(): void {
  }

  save(employee) {
    this.employeeService.create(employee);
    this.router.navigate(['/employees']);
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
