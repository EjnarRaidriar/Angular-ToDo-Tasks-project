import { Injectable } from '@angular/core';
import { Todo } from './todo.interface';
import { FilterParams } from './filterParams.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskFilterService {

    taskList: Todo[] = [];

    filterTasks(filter: FilterParams, taskList: Todo[]) {
        console.log('filterTasks');
    }
}
