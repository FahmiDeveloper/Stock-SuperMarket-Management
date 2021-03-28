import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees$;

  constructor(private employeeService: EmployeeService) { 
    this.employees$ = this.employeeService.getAll();
  }

  ngOnInit(): void {
  }

}
