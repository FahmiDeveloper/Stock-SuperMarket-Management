import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Clocking, SubjectList } from 'src/app/shared/models/clocking.model';

@Component({
    selector: 'clockings-list-mobile',
    templateUrl: './list-clockings-mobile.component.html',
    styleUrls: ['./list-clockings-mobile.scss']
})

export class ListClockingsForMobileComponent {

    @Input() clockingsList: Clocking[];

    dataSource = new MatTableDataSource<Clocking>();
    displayedColumns: string[] = ['date', 'day', 'time', 'clockingNbr', 'note'];

    subjectSelectedId: number;

    subjectList: SubjectList[] = [
        {id: 1, subjectName: 'Work on sunday'},
        {id: 2, subjectName: 'Take vacation'},
        {id: 3, subjectName: 'Take one hour'},
        {id: 4, subjectName: 'Work half day'} 
    ];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {
        this.dataSource.data = this.clockingsList;

        if (this.dataSource.data.length > 0) {
            this.dataSource.data.forEach(clocking => {
              this.getDayFromDateClocking(clocking);
            })
        }

        this.dataSource.paginator = this.paginator;
    }

    getDayFromDateClocking(clocking: Clocking) {
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
        const d = new Date(clocking.dateClocking);
        clocking.day = weekday[d.getDay()];
    }

    filterBySubject() {
        if (this.subjectSelectedId == 1) {
            this.dataSource.data = this.clockingsList.filter(clocking => clocking.workOnSunday == true);
        } 
        else if (this.subjectSelectedId == 2) {
            this.dataSource.data = this.clockingsList.filter(clocking => clocking.takeVacation == true);
        }
        else if (this.subjectSelectedId == 3) {
            this.dataSource.data = this.clockingsList.filter(clocking => clocking.takeOneHour == true);
        }
        else if (this.subjectSelectedId == 4) {
            this.dataSource.data = this.clockingsList.filter(clocking => clocking.workHalfDay == true);
        }
        else {this.dataSource.data = this.clockingsList;}
    }

}