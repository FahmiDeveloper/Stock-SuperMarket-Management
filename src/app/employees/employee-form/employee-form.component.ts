import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
  }

  save(employee) {
    this.employeeService.create(employee);
  }

}
