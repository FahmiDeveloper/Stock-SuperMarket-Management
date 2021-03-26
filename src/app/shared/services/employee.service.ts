import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private db: AngularFireDatabase) { }

  create(employee) {
    return this.db.list('/employees').push(employee);
  }
}
