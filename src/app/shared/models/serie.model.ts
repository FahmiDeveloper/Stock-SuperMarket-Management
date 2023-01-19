export class Serie {

  key: string;
  nameSerie: string;
  date: string;
  note: string;
  imageUrl: string;
  statusId: number;
  path: string;
  numRefSerie: number;
  currentEpisode: number;
  totalEpisodes: number;
  season: number;
  priority: number;
  isFirst: boolean;
  year: number;
  parentAnimeKey: string;
  notLiked: boolean;

  constructor(){
    this.nameSerie = '';
    this.date = '';
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