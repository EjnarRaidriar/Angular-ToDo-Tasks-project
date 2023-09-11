import { Injectable } from '@angular/core';
import { Todo } from './todo.interface';
import { FilterParams } from './filterParams.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskFilterService {

    filterTasks(filter: FilterParams, taskList: Todo[]): Todo[] {
        let filteredTasks = taskList;
        filteredTasks = this._filterSearch(filter, filteredTasks);
        filteredTasks = this._filterCompletion(filter, filteredTasks);
        filteredTasks = this._filterByDate(filter, filteredTasks);
        filteredTasks = this._orderCompletion(filteredTasks);
        return filteredTasks;
    }

    private _filterSearch(filter: FilterParams ,list: Todo[]): Todo[] {
        return list.filter(task => task.title.toLowerCase().includes(filter.search));
    }

    private _filterCompletion(filter: FilterParams,list: Todo[]): Todo[] {
        if (filter.completion === 'active') {
            return list.filter((task) => !task.isCompleted);
        }
        if (filter.completion === 'completed') {
            return list.filter((task) => task.isCompleted);
        }
        return list;
    }

    private _filterByDate(filter: FilterParams,list: Todo[]): Todo[] {
        let datedTasks = list.filter((task) => task.dueDate !== undefined);
        let undatedTasks = list.filter((task) => task.dueDate === undefined);
        if (filter.orderByDate === 'asc') {
            datedTasks.sort((a, b) => {
                if (a.dueDate! > b.dueDate!) {
                    return 1;
                } else if (a.dueDate! < b.dueDate!) {
                    return -1;
                }
                return 0;
            })
        } else if (filter.orderByDate === 'desc') {
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

    private _orderCompletion(list: Todo[]): Todo[] {
        let activeTasks = list.filter((task) => !task.isCompleted);
        let completedTasks = list.filter((task) => task.isCompleted);
        return activeTasks.concat(completedTasks);
    }
}
