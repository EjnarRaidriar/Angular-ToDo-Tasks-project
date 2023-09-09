import { Injectable, WritableSignal, signal } from '@angular/core';

import { Todo } from './todo.interface';
import { FilterParams } from './filterParams.interface';
import { Observable, of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private _storageKey = 'todos';

    activeFilters: WritableSignal<FilterParams> = signal({
        completion: 'all',
        orderByDate: 'default',
        search: ''
    });

    selectedTask: WritableSignal<Todo | undefined> = signal(undefined);

    taskList: WritableSignal<Todo[]> = signal([]);

    changeCompletion(id: string) {
        this.taskList.mutate(taskList => {
            const index = this.findTaskIndexById(id);
            taskList[index].isCompleted = !taskList[index].isCompleted;
        })
        this.uploadData();
    }

    setTask(task: Todo, isNewTask: boolean) {
        this.taskList.mutate(taskList => {
            if (isNewTask) {
                taskList.push(task);
            } else {
                let index = taskList.findIndex(_task => _task.id === task.id);
                taskList[index] = task;
            }
        })
        this.uploadData();
    }

    setFilter(filter: FilterParams) {
        this.activeFilters.set(filter);
    }

    selectTask(id: string) {
        const task = this.findTaskById(id);
        this.selectedTask.set(task!);
    }

    findTaskById(id: string): Todo | undefined{
        return this.taskList().find(todo => todo.id === id);
    }

    findTaskIndexById(id: string): number {
        return this.taskList().findIndex(todo => todo.id === id);
    }

    deleteTask(id: string) {
        this.taskList.mutate(taskList => {
            const index = this.findTaskIndexById(id);
            taskList.splice(index, 1);
        })
        this.uploadData();
    }

    getTask(id: string): Observable<Todo> {
        return of(this.findTaskById(id)!);
    }

    isSelectedTaskCompleted(): boolean {
        return this.selectedTask()!.isCompleted;
    }

    uploadData() {
        localStorage.setItem(this._storageKey, JSON.stringify(this.taskList()));
    }
    
    loadData(){
        // localStorage.clear();
        const todoList = <Todo[]>JSON.parse(localStorage.getItem(this._storageKey) || '[]');
        this.taskList.set(todoList);
        try {
            const selectedTask = <Todo>JSON.parse(localStorage.getItem('selectedTask') || '{}')
            this.selectedTask.set(selectedTask);
        } catch (err) {
            console.log(err);
        }
    }
}
