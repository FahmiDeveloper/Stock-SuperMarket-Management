import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/services/auth.service';
import { EmployeeService } from '../shared/services/employee.service';
import { UserService } from '../shared/services/user.service';

import { Employee } from '../shared/models/employee.model';
import { FirebaseUserModel } from '../shared/models/user.model';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  employees: Employee[];
  filteredEmployees: any[];

  subscription: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  constructor(
    private employeeService: EmployeeService,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllEmployees();
    this.getRolesUser();
  }

  getAllEmployees() {
    this.subscription = this.employeeService
      .getAll()
      .subscribe(employees => this.filteredEmployees = this.employees = employees);
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService.
      isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
          .getCurrentUser()
          .then(user=>{
            if(user) {
              this.userService
              .get(user.uid)
              .valueChanges()
              .subscribe(dataUser=>{
                this.user = dataUser;
              });
            }
          });   
        }
    })
  }

  delete(employeeId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this employee!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.employeeService.delete(employeeId);
        Swal.fire(
          'Employee has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  filter(query: string) {
    this.filteredEmployees = (query)
       ? this.employees.filter(employee => employee.name.toLowerCase().includes(query.toLowerCase()))
       : this.employees;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
