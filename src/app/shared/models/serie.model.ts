export class Serie {
    key: string;
    nameSerie: string;
    date: string;
    time: string;
    note: string;
    imageUrl: string;
    statusId: number;
    status: string;// get name of status foreach movie using statusId
    path: string;
  
    constructor(){
      this.nameSerie = "";
      this.date = "";
      this.time = "";
      this.note = "";
      this.imageUrl = "";
      this.statusId = null;
      this.path = "";
    }
  }