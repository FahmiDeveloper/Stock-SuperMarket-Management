export class Anime {
    key: string;
    nameAnime: string;
    date: string;
    time: string;
    note: string;
    imageUrl: string;
    statusId: number;
    status: string;// get name of status foreach anime using statusId
    path: string;
  
    constructor(){
      this.nameAnime = "";
      this.date = "";
      this.time = "";
      this.note = "";
      this.imageUrl = "";
      this.statusId = null;
      this.path = "";
    }
  }