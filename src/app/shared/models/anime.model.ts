export class Anime {
    key: string;
    nameAnime: string;
    date: string;
    time: string;
    categoryId: string;
    nameCategory: string;// get name of category foreach product using categoryId
    note: string;
    imageUrl: string;
  
    constructor(){
      this.nameAnime = "";
      this.date = "";
      this.time = "";
      this.categoryId = "";
      this.nameCategory = "";
      this.note = "";
      this.imageUrl = "";
    }
  }