import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { Todo } from '../todo.interface';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

    filterList(): Todo[] {
        // filtering by search
        let filteredList = this.todoList().filter(task => task.title.toLowerCase().includes(this.searchInput()));
        // filtering by completion
        let completedList = filteredList.filter(task => task.isCompleted);
        let uncompletedList = filteredList.filter(task => !task.isCompleted);
        filteredList = uncompletedList.concat(completedList);
        return filteredList;
    }


    //For CSS
    listClass(id: string) {
        if (id === this.selectedTaskId()) {
            return 'selected-item';
        } else if (this.taskService.getTask(id)!.isCompleted) {
            return 'completed-item';
        } else {
            return 'active-item';
        }
    }
}
