import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  aflCategories: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getAll(){
    this.aflCategories = this.db.list('/categories', category => category.orderByChild('key'));
    return this.aflCategories
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  create(category) {
    return this.db.list('/categories').push(category);
  }

  getCategoryId(categoryId: string): AngularFireObject<Category> {
    return this.db.object('/categories/' + categoryId);
  }

  update(categoryId, category) {
    return this.db.object('/categories/' + categoryId).update(category);
  }

  delete(categoryId) {
    return this.db.object('/categories/' + categoryId).remove();
  }

  countLengthCategories(): Observable<number> {
    return this.db.list('/categories').valueChanges().pipe(map(response => response.length));
  }
}
