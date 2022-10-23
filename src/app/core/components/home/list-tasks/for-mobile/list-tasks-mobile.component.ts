import { Component, Input, OnChanges } from '@angular/core';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'list-tasks-mobile',
    templateUrl: './list-tasks-mobile.component.html',
    styleUrls: ['./list-tasks-mobile.scss']
})

export class ListTasksForMobileComponent {

    @Input() tasksListByStatus: Task[];
    @Input() tasksByStatus: number;
    @Input() isMobile: boolean;

}