import { Component, Signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterParams, Completion, OrderByDate } from '../filterParams.interface';
import { TaskService } from '../task.service';


@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: ['./task-menu.component.css']
})
export class TaskMenuComponent {

    router = inject(Router);
    route = inject(ActivatedRoute);
    taskService = inject(TaskService);

    filter: Signal<FilterParams> = computed(() => {
        return this.taskService.activeFilters();
    });

    ngOnInit() {
        let newFilter: FilterParams = {
            completion: this.route.snapshot.queryParams['completion'] || 'all',
            orderByDate: this.route.snapshot.queryParams['orderByDate'] || 'default',
            search: this.route.snapshot.queryParams['search'] || ''
        }
        this.taskService.setFilter(newFilter);
    }

    setCompletionFilter(completionFilter: Completion['value']) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { completion: completionFilter },
                queryParamsHandling: 'merge'
            }
        )
        this.newFilter(completionFilter, undefined, undefined);
    }

    setOrderByDateFilter(orderByDate: OrderByDate['value']) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { orderByDate: orderByDate },
                queryParamsHandling: 'merge'
            }
        );
        this.newFilter(undefined, orderByDate, undefined);
    }

    inputSearch(search: string) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { search: search.toLowerCase() },
                queryParamsHandling: 'merge'
            }
        )
        this.newFilter(undefined, undefined, search.toLowerCase());
    }

    newFilter(newCompletion?: 'all'| 'completed'|'active',
            newOrderByDate?: 'default' | 'asc' | 'desc',
            newSearch?: string) {
        if (newCompletion) {
            const newFilter: FilterParams = {
                completion: newCompletion,
                orderByDate: this.filter().orderByDate,
                search: this.filter().search
            }
            this.taskService.setFilter(newFilter);
            return;
        }
        if (newOrderByDate) {
            const newFilter: FilterParams = {
                completion: this.filter().completion,
                orderByDate: newOrderByDate,
                search: this.filter().search
            }
            this.taskService.setFilter(newFilter);
            return;
        }
        if (newSearch) {
            const newFilter: FilterParams = {
                completion: this.filter().completion,
                orderByDate: this.filter().orderByDate,
                search: newSearch
            }
            this.taskService.setFilter(newFilter);
            return;
        }
        this.taskService.setFilter({completion: "all", orderByDate: "default", search: ""});
    }

    isSelecetedOrder(filter: "default" | "asc" | "desc"): boolean {
        return this.filter().orderByDate === filter;
    }

    isSelectedCompletion(filter: "all" | "active" | "completed"): boolean {
        return this.filter().completion === filter;
    }

    resetFilters() {
        this.router.navigate([], {relativeTo: this.route})
        this.newFilter();
    }

    newTask() {
        this.router.navigate(
            ["todo/new-task"],
            {
                // relativeTo: this.route,
                queryParamsHandling: 'merge'
            }
        )
    }

}
