import { Component, Input } from '@angular/core';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'task-data',
    templateUrl: './task-data.component.html',
    styleUrls: ['./task-data.scss']
})

export class TaskDataComponent {

  @Input() task: Task | null = null;
  @Input() isMobile: boolean;

}