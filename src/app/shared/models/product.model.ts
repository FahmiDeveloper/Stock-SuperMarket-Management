export class Product {
  key: string;
  nameProduct: string;
  price: number;
  date: string;
  time: string;
  categoryId: string;
  nameCategory: string;// get name of category foreach product using categoryId
  note: string;
  imageUrl: string;

  constructor(){
    this.nameProduct = "";
    this.price = null;
    this.date = "";
    this.time = "";
    this.categoryId = "";
    this.nameCategory = "";
    this.note = "";
    this.imageUrl = "";
  }
}