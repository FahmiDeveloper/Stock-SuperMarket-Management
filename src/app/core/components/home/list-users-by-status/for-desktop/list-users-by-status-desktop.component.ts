import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-users-by-status-desktop',
    templateUrl: './list-users-by-status-desktop.component.html',
    styleUrls: ['./list-users-by-status-desktop.scss']
})

export class ListUsersByStatusForDesktopComponent {

    @Input() usersListByStatus: FirebaseUserModel[];
    @Input() usersByStatus: number;

    dataSource = new MatTableDataSource<FirebaseUserModel>();
    displayedColumns: string[] = ['picture', 'details'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {

        this.dataSource.data = this.usersListByStatus;
        this.dataSource.paginator = this.paginator;

    }

}