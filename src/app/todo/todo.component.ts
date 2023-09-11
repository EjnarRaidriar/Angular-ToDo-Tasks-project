import { Component, Signal, WritableSignal, computed, inject, signal, effect } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '../task.service';

import { Subscription } from 'rxjs';

import { FilterParams } from '../filterParams.interface';
import { TaskFilterService } from '../task-filter.service';
import { Todo } from '../todo.interface';
import { StateService } from '../state.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {

    //activeRoute

    selectedId: Signal<string> = computed(() => {
        return this.selectionService.selectedId();
    });

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
    selectionService = inject(StateService);

    filterSubscribtion: Subscription | undefined = undefined;
    selectedTaskSubscribtion: Subscription | undefined = undefined;
    
    ngOnInit(): void {
        this.taskService.loadData();
        this.filterSubscribtion = this.route.queryParams.subscribe((params) => {
            this.filter.set({
                completion: params['completion'] || 'all',
                orderByDate: params['orderByDate'] || 'default',
                search: params['search'] || ''
            })
        });
    }

    ngOnDestroy(): void {
        this.filterSubscribtion!.unsubscribe();
    }

    changeCompletion(id: string) {
        this.taskService.changeCompletion(id);
    }

    selectTask(id: string) {
        this.selectionService.selectTask(id);
        this.router.navigate(['/todo', id], {queryParamsHandling: 'merge'});
    }

    //TODO: read rxjs basics

    itemClass(id: string): string {
        if (this.selectedId() === id) {
            if (this._isCompletedItem(id)) {
                return 'selected-item completed-item';
            }
            return 'selected-item';
        }
        if (this._isCompletedItem(id)) {
            return 'completed-item';
        }
        return 'active-item';
    }

    private _isCompletedItem(id: string): boolean {
        return this.taskService.findTaskById(id)?.isCompleted || false;
    }
}
