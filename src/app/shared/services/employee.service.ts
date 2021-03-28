import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  aflEmployees: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

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

  getEmployeeId(employeeId) {
    return this.db.object('/employees/' + employeeId).valueChanges();
  }

  update(employeeId, employee) {
    return this.db.object('/employees/' + employeeId).update(employee);
  }
}
