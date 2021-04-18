import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  aflEmployees: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getAll() {
    this.aflEmployees = this.db.list('/employees', employee => employee.orderByChild('key'));
    return this.aflEmployees
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(employee) {
    return this.db.list('/employees').push(employee);
  }

  getEmployeeId(employeeId: string): AngularFireObject<Employee> {
    return this.db.object('/employees/' + employeeId);
  }

  update(employeeId, employee) {
    return this.db.object('/employees/' + employeeId).update(employee);
  }

  delete(employeeId) {
    return this.db.object('/employees/' + employeeId).remove();
  }

  countLengthEmployees(): Observable<number> {
    return this.db.list('/employees').valueChanges().pipe(map(response => response.length));
  }
}
