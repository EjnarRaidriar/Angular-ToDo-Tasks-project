import { Component, Signal, WritableSignal, computed, inject, signal, effect } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '../task.service';

import { Subscription } from 'rxjs';

import { FilterParams } from '../filterParams.interface';
import { TaskFilterService } from '../task-filter.service';
import { Todo } from '../todo.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {

    filteredTaskList: Signal<Todo[]> = computed(() => {
        return this.filterService.filterTasks(this.filter(), this.taskService.taskList());
    });

    filter: WritableSignal<FilterParams> = signal({
        completion: 'all',
        orderByDate: 'default',
        search: ''
    });

    router = inject(Router);
    route = inject(ActivatedRoute);
    taskService = inject(TaskService);
    filterService = inject(TaskFilterService);

    filterSubscribtion: Subscription | undefined = undefined;
    
    ngOnInit(): void {
        this.taskService.loadData();
        this.filterSubscribtion = this.route.queryParams.subscribe((params) => {
            this.filter.set({
                completion: params['completion'] || 'all',
                orderByDate: params['orderByDate'] || 'default',
                search: params['search'] || ''
            })
        })
    }

    ngOnDestroy(): void {
        this.filterSubscribtion!.unsubscribe();
    }

    changeCompletion(id: string) {
        this.taskService.changeCompletion(id);
    }

    selectTask(id: string) {
        this.router.navigate(['/todo', id], {queryParamsHandling: 'merge'});
    }

    //TODO: read rxjs basics

    //TODO: create service that will recieve filter from url and return observable, use switchMap

    //TODO: use setTimeout()

    itemClass(id: string): string {
        if (this._isCompletedItem(id)) {
            return 'completed-item';
        }
        return 'active-item';
    }

    private _isCompletedItem(id: string): boolean {
        return this.taskService.findTaskById(id)?.isCompleted || false;
    }
}
