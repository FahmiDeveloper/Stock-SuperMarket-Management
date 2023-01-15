export class Movie {

  key: string;
  nameMovie: string;
  date: string;
  note: string;
  imageUrl: string;
  statusId: number;
  path: string;
  numRefMovie: number;
  year: number;
  part: number;
  priority: number;
  isFirst: boolean;
  parentFilmKey: string;

  constructor(){
    this.nameMovie = '';
    this.date = '';
    this.note = '';
    this.imageUrl = '';
    this.statusId = null;
    this.path = '';
    this.year = null;
  }
  
}

export interface StatusMovies {
  id: number,
  status: string
}