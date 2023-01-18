export class Anime {

  key: string;
  nameAnime: string;
  date: string;
  note: string;
  imageUrl: string;
  statusId: number;
  path: string;
  numRefAnime: number;
  currentEpisode: number;
  totalEpisodes: number;
  season: number;
  priority: number;
  type: string;
  isFirst: boolean;
  parentAnimeKey: string;
  notLiked: boolean;

  constructor(){
    this.nameAnime = '';
    this.date = '';
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