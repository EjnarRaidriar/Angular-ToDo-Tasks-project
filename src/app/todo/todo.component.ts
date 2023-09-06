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
    
    selectedTaskId: Signal<string | null> = computed(() => {
        return this.taskService.selectedTaskId()});

    taskList: Signal<Todo[]> = computed(() => {
        return this.taskService.taskList()});

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
            this.filterTasks();
        })
    }

    ngOnDestroy(): void {
        this.filterSubscribtion!.unsubscribe();
    }

    filterTasksOnChange = effect(() => {
        this.filterTasks();
    }) 

    changeCompletion(id: string) {
        this.taskService.changeCompletion(id);
    }

    selectTask(id: string) {
        this.router.navigate(['/todo', id], {queryParamsHandling: 'merge'});
        this.taskService.selectTask(id);
    }

    listClass(id: string) {
        if (id === this.selectedTaskId()) {
            if (this.taskService.getTask(id)!.isCompleted) {
                return 'selected-item completed-item';
            }
            return 'selected-item';
        } else if (this.taskService.getTask(id)!.isCompleted) {
            return 'completed-item';
        } else {
            return 'active-item';
        }
    }

    filterTasks() {
        let filteredTasks = this.taskList();

        filteredTasks = this.filterSearch(filteredTasks);
        
        filteredTasks = this.filterCompletion(filteredTasks);

        filteredTasks = this.filterByDate(filteredTasks);

        filteredTasks = this.orderCompletion(filteredTasks);

        this.filteredTaskList = filteredTasks;
    }

    filterSearch(list: Todo[]): Todo[] {
        return list.filter(task => task.title.toLowerCase().includes(this.filter.search));
    }

    filterCompletion(list: Todo[]): Todo[] {
        if (this.filter.completion === 'active') {
            return list.filter((task) => !task.isCompleted);
        }
        if (this.filter.completion === 'completed') {
            return list.filter((task) => task.isCompleted);
        }
        return list;
    }

    filterByDate(list: Todo[]): Todo[] {
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

    orderCompletion(list: Todo[]): Todo[] {
        let activeTasks = list.filter((task) => !task.isCompleted);
        let completedTasks = list.filter((task) => task.isCompleted);
        return activeTasks.concat(completedTasks);
    }
}
