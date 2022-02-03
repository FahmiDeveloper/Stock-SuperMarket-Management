export class Movie {
    key: string;
    nameMovie: string;
    date: string;
    time: string;
    categoryId: string;
    nameCategory: string;// get name of category foreach product using categoryId
    note: string;
    imageUrl: string;
    statusId: number;
    status: string;// get name of status foreach movie using statusId
  
    constructor(){
      this.nameMovie = "";
      this.date = "";
      this.time = "";
      this.categoryId = "";
      this.nameCategory = "";
      this.note = "";
      this.imageUrl = "";
      this.statusId = null;
    }
  }