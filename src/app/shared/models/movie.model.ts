export class Movie {
    key: string;
    nameMovie: string;
    date: string;
    time: string;
    note: string;
    imageUrl: string;
    statusId: number;
    status: string;// get name of status foreach movie using statusId
    path: string;
  
    constructor(){
      this.nameMovie = "";
      this.date = "";
      this.time = "";
      this.note = "";
      this.imageUrl = "";
      this.statusId = null;
      this.path = "";
    }
  }