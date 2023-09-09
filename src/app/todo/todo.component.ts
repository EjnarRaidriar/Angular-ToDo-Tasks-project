import { Component, Signal, computed, effect, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '../task.service';

import { Subscription } from 'rxjs';

import { FilterParams } from '../filterParams.interface';
import { Todo } from '../todo.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
    
    selectedTask: Signal<Todo | undefined> = computed(() => {
        return this.taskService.selectedTask()});

    taskList: Signal<Todo[]> = computed(() => {
        return this.taskService.taskList()});


    // TODO: change it to signal and include filter singal and list signal
    filteredTaskList: Todo[] = [];

    filter: FilterParams = {
        completion: 'all',
        orderByDate: 'default',
        search: ''
    };

    router = inject(Router);
    route = inject(ActivatedRoute);
    taskService = inject(TaskService);

    filterSubscribtion: Subscription | undefined = undefined;
    
    ngOnInit(): void {
        this.taskService.loadData();
        this.filterSubscribtion = this.route.queryParams.subscribe((params) => {
            this.filter = {
                completion: params['completion'] || 'all',
                orderByDate: params['orderByDate'] || 'default',
                search: params['search'] || ''
            }
            this._filterTasks();
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
        this.taskService.selectTask(id);
    }

    private _filterTasks() {
        let filteredTasks = this.taskList();
        filteredTasks = this._filterSearch(filteredTasks);
        filteredTasks = this._filterCompletion(filteredTasks);
        filteredTasks = this._filterByDate(filteredTasks);
        filteredTasks = this._orderCompletion(filteredTasks);
        this.filteredTaskList = filteredTasks;
    }

    private _filterSearch(list: Todo[]): Todo[] {
        return list.filter(task => task.title.toLowerCase().includes(this.filter.search));
    }

    private _filterCompletion(list: Todo[]): Todo[] {
        if (this.filter.completion === 'active') {
            return list.filter((task) => !task.isCompleted);
        }
        if (this.filter.completion === 'completed') {
            return list.filter((task) => task.isCompleted);
        }
        return list;
    }

    private _orderCompletion(list: Todo[]): Todo[] {
        let activeTasks = list.filter((task) => !task.isCompleted);
        let completedTasks = list.filter((task) => task.isCompleted);
        return activeTasks.concat(completedTasks);
    }

    private _filterByDate(list: Todo[]): Todo[] {
        let datedTasks = list.filter((task) => task.dueDate !== undefined);
        let undatedTasks = list.filter((task) => task.dueDate === undefined);
        if (this.filter.orderByDate === 'asc') {
            datedTasks.sort((a, b) => {
                if (a.dueDate! > b.dueDate!) {
                    return 1;
                } else if (a.dueDate! < b.dueDate!) {
                    return -1;
                }
                return 0;
            })
        } else if (this.filter.orderByDate === 'desc') {
            datedTasks.sort((a, b) => {
                if (a.dueDate! < b.dueDate!) {
                    return 1;
                } else if (a.dueDate! > b.dueDate!) {
                    return -1;
                }
                return 0;
            })
        }
        return datedTasks.concat(undatedTasks);
    }

    //TODO: read rxjs basics

    //TODO: create service that will recieve filter from url and return observable, use switchMap

    //TODO: use setTimeout()

    itemClass(id: string): string {
        if (this._isSelectedItem(id) && this._isCompletedItem(id)) {
            return 'selected-item completed-item';
        }
        if (this._isSelectedItem(id)) {
            return 'selected-item';
        }
        if (this._isCompletedItem(id)) {
            return 'completed-item';
        }
        return 'active-item';
    }

    private _isSelectedItem(id: string): boolean {
        return this.selectedTask()?.id === id;
    }

    private _isCompletedItem(id: string): boolean {
        return this.taskService.findTaskById(id)?.isCompleted || false;
    }
}
