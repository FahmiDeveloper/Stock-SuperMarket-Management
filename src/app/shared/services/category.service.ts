import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  aflCategories: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { }

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

  getCategoryId(categoryId) {
    return this.db.object('/categories/' + categoryId).valueChanges();
  }

  
}
