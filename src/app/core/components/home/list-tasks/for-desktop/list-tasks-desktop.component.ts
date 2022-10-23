import { Component, Input } from '@angular/core';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'list-tasks-desktop',
    templateUrl: './list-tasks-desktop.component.html',
    styleUrls: ['./list-tasks-desktop.scss']
})

export class ListTasksForDesktopComponent {

    @Input() tasksListByStatus: Task[];
    @Input() tasksByStatus: number;
    @Input() isMobile: boolean;

}