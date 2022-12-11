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
  numRefAnime: number;
  currentEpisode: number;
  totalEpisodes: number;
  season: number;
  priority: number;
  type: string;
  isFirst: boolean;

  constructor(){
    this.nameAnime = '';
    this.date = '';
    this.time = '';
    this.note = '';
    this.imageUrl = '';
    this.statusId = null;
    this.path = '';
  }
  
}

export interface StatusAnimes {
  id: number,
  status: string
}