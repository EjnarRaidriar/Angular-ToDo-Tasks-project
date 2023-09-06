import { Component, Signal, computed, effect, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { TaskService } from '../task.service';

import { Subscription } from 'rxjs';

import { Todo } from '../todo.interface';
import { FilterParams } from '../filterParams.interface';

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

    filteredTaskList: Signal<Todo[]> = computed(() => {
        return this.filterTasks();
    });

    filter: FilterParams = {
        completion: 'all',
        orderByDate: 'default',
        search: ''
    };

    route = inject(ActivatedRoute);
    taskService = inject(TaskService);

    subscribtion: Subscription | undefined = undefined;
    
    ngOnInit(): void {
        this.taskService.loadData();
        this.subscribtion = this.route.queryParams.subscribe((params) => {
            this.filter = {
                completion: params['completion'] || 'all',
                orderByDate: params['orderByDate'] || 'default',
                search: params['search'] || ''
            }
            console.log(this.filter);
        })
    }

    changeCompletion(id: string) {
        this.taskService.changeCompletion(id);
    }

    selectTask(id: string) {
        this.taskService.selectTask(id);
    }

    //For CSS
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

    filterTasks(): Todo[] {

        return this.taskList();
    }
}
