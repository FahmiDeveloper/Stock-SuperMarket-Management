import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from '../shared/models/employee.model';
import { EmployeeService } from '../shared/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  employees: Employee[];
  filteredEmployees: any[];
  subscription: Subscription;

  p: number = 1;

  constructor(private employeeService: EmployeeService) { 
    this.subscription = this.employeeService.getAll()
    .subscribe(employees => this.filteredEmployees = this.employees = employees);
  }

  ngOnInit(): void {
  }

  delete(employeeId) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

      this.employeeService.delete(employeeId);
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
