import { Observable } from "rxjs";

export class Category {
    key: string;
    name: string;
    date: string;
    time: string;
    note: string;
    nbrProductsForEachCateogry: Observable<number>;

    constructor(){
      this.name = "";
      this.date = "";
      this.time = "";
      this.note = "";
    }
  }