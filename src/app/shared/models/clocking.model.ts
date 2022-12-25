export class Clocking {
  key: string;
  dateClocking: string;
  timeClocking: string;
  clockingNbr: number;
  note: string;
  numRefClocking: number;
  day: string; 
  workOnSunday: boolean;
  takeVacation: boolean;
  takeOneHour: boolean;
  workHalfDay: boolean;
  restVacationDays: number;
}

export interface MonthsList {
  monthNbr: string;
  monthName: string;
}

export interface SubjectList {
  id: number;
  subjectName: string;
}