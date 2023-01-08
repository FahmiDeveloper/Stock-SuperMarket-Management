export class Serie {

  key: string;
  nameSerie: string;
  fullNameSerie: string;
  date: string;
  time: string;
  note: string;
  imageUrl: string;
  statusId: number;
  status: string;// get name of status foreach movie using statusId
  path: string;
  numRefSerie: number;
  currentEpisode: number;
  totalEpisodes: number;
  season: number;
  priority: number;
  isFirst: boolean;
  year: number;
  nameSerieToShow: string;

  constructor(){
    this.nameSerie = '';
    this.date = '';
    this.time = '';
    this.note = '';
    this.imageUrl = '';
    this.statusId = null;
    this.path = '';
  }
  
}

export interface StatusSeries {
  id: number,
  status: string
}