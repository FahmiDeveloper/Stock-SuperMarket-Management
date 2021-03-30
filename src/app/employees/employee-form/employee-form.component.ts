import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Employee } from 'src/app/shared/models/employee.model';
import { EmployeeService } from 'src/app/shared/services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

  basePath = '/PicturesEmployees';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  cinPhoneNumberPattern = "^((\\+91-?)|0)?[0-9]{8}$";

  employeeId;
  employee: Employee = new Employee();

  constructor(
    private employeeService: EmployeeService,
    private fireStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute
    ) {
        this.employeeId = this.route.snapshot.paramMap.get('id');
        if (this.employeeId) {
          this.employeeService.getEmployeeId(this.employeeId).valueChanges().pipe(take(1)).subscribe(employee => {
          this.employee = employee;
        });
      } else {
        this.employee.date = moment().format('YYYY-MM-DD');
        this.employee.time = moment().format('HH:mm');
      }
    }

  ngOnInit(): void {
  }

  save(employee) {
    if (this.employeeId) this.employeeService.update(this.employeeId, employee);
    else this.employeeService.create(employee);
    this.router.navigate(['/employees']);
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
       const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
       this.task =  this.fireStorage.upload(filePath, file);    // upload task
 
       // this.progress = this.snapTask.percentageChanges();
       this.progressValue = this.task.percentageChanges();
 
       (await this.task).ref.getDownloadURL().then(url => {this.employee.imageUrl = url; });  // <<< url is found here
 
     } else {  
       alert('No images selected');
       this.employee.imageUrl = '';
      }
   }

}
