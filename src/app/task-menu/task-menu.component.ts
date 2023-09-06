import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterParams } from '../filterParams.interface';
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

    filter: FilterParams = {
        completion: 'all',
        orderByDate: 'default',
        search: ''
    }

    ngOnInit() {
        this.filter = {
            completion: this.route.snapshot.queryParams['completion'] || 'all',
            orderByDate: this.route.snapshot.queryParams['orderByDate'] || 'default',
            search: this.route.snapshot.queryParams['search'] || ''
        }
    }

    changeCompletionFilter(completionFilter: string) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { completion: completionFilter },
                queryParamsHandling: 'merge'
            }
        )
    }

    changeOrderByDateFilter(orderByDate: string) {
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

    checkCompletion(completionFilter: string): boolean {
        if (this.filter.completion == completionFilter) {
            return true;
        }
        return false;
    }

    checkOrderByDate(orderByDate: string): boolean {
        if (this.filter.orderByDate == orderByDate) {
            return true;
        }
        return false;
    }

    selectTask(id: string) {
        this.taskService.selectTask(id);
    }

}
