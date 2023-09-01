import { Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { Todo } from '../todo.interface';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
    
    selectedTaskId: Signal<string | null> = computed(() => {
        return this.taskService.selectedTaskId()});

    todoList: Signal<Todo[]> = computed(() => {
        return this.taskService.taskList()});
    
    filteredList: Signal<Todo[]> = computed(() => {
        return this.filterList();
    })

    searchInput: WritableSignal<string> = signal('');

    filterOption: WritableSignal<string> = signal('all');

    route = inject(ActivatedRoute);
    taskService = inject(TaskService);
    
    ngOnInit(): void {
        this.taskService.loadData();
    }

    changeCompletion(id: string) {
        this.taskService.changeCompletion(id);
    }

    selectTask(id: string) {
        this.taskService.selectTask(id);
    }

    setSearchString(e: Event) {
        this.searchInput.set((e.target as HTMLInputElement).value);
    }

    setFilterOption(e: Event) {
        this.filterOption.set((e.target as HTMLInputElement).value);
    }

    filterList(): Todo[] {
        // filtering by search
        let filteredList = this.todoList().filter(task => task.title.toLowerCase().includes(this.searchInput()));
        // filtering by completion
        let completedList = filteredList.filter(task => task.isCompleted);
        let activeList = filteredList.filter(task => !task.isCompleted);
        // filtering by filter option
        if (this.filterOption() === 'completed') return completedList;
        if (this.filterOption() === 'active') return activeList;
        if (this.filterOption() === 'by date') {
            let undefinedCompletedList = completedList.filter(task => task.completeBefore === undefined);
            let undefinedActiveList = activeList.filter(task => task.completeBefore === undefined);
            completedList = completedList.filter(task => task.completeBefore !== undefined);
            activeList = activeList.filter(task => task.completeBefore !== undefined);
            completedList.sort((a, b) => {
                return a.completeBefore! > b.completeBefore! ? 1 : -1;
            });
            activeList.sort((a, b) => {
                return a.completeBefore! > b.completeBefore! ? 1 : -1;
            });
            completedList = completedList.concat(undefinedCompletedList);
            activeList = activeList.concat(undefinedActiveList);
        }
        filteredList = activeList.concat(completedList);
        return filteredList;
    }

    applyFilter(filter: string) {
        console.log(filter);
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
}
