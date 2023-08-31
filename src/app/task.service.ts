import { Injectable, WritableSignal, signal } from '@angular/core';

import { Todo } from './todo.interface';


@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private storageKey = 'todos';

    selectedTaskId: WritableSignal<string | null> = signal(null);

    taskList: WritableSignal<Todo[]> = signal([]);

    constructor() { }

    changeCompletion(id: string) {
        this.taskList.mutate(value => {
            const index = value.findIndex(todo => todo.id === id);
            value[index].isCompleted = !value[index].isCompleted;
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

    selectTask(id: string) {
        this.selectedTaskId.set(id);
        this.uploadSelectedTaskId();
    }

    getTask(id: string): Todo | undefined {
        return this.taskList().find(todo => todo.id === id)!;
    }

    uploadData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.taskList()));
    }
    
    loadData(){
        // localStorage.clear();
        let todoList = <Todo[]>JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        this.taskList.set(todoList);
        this.selectedTaskId.set(this.loadSelectedTaskId());
    }

    uploadSelectedTaskId() {
        localStorage.setItem('selectedTaskId', JSON.stringify(this.selectedTaskId()));
    }

    loadSelectedTaskId() {
        let selectedTaskId = <string>JSON.parse(localStorage.getItem('selectedTaskId') || '""');
        this.selectedTaskId.set(selectedTaskId);
        return selectedTaskId;
    }
}
