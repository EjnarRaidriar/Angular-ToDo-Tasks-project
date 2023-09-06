import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';


@Component({
  selector: 'app-task-filter',
  templateUrl: './task-menu.component.html',
  styleUrls: ['./task-menu.component.css']
})
export class TaskMenuComponent {

    router = inject(Router);
    route = inject(ActivatedRoute);
    taskService = inject(TaskService);

    changeCompletion(completionFilter: string) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { completion: completionFilter },
                queryParamsHandling: 'merge'
            }
        )
    }

    changeOrderByDate(orderByDate: string) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { orderByDate: orderByDate },
                queryParamsHandling: 'merge'
            }
        )
    }

    inputSearch(search: string) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { search: search },
                queryParamsHandling: 'merge'
            }
        )
    }

    selectTask(id: string) {
        this.taskService.selectTask(id);
    }

}
