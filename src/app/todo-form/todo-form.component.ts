import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import { Subscription, merge } from 'rxjs';

import { TaskService } from '../task.service';
import { Todo } from '../todo.interface';

interface TodoForm {
    title: FormControl<string>;
    description: FormControl<string>;
    dueDate: FormControl<string>;
    isCompleted: FormControl<boolean>;
}

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {

    task: Todo | undefined = undefined;
    subscribtion: Subscription | undefined = undefined;
    isNewTask: boolean = true;

    route = inject(ActivatedRoute);
    taskService = inject(TaskService);
    router = inject(Router);

    taskForm = new FormGroup<TodoForm>({
        title: new FormControl('', {nonNullable: true}),
        description: new FormControl('', {nonNullable: true}),
        dueDate: new FormControl('', {nonNullable: true}),
        isCompleted: new FormControl(false, {nonNullable: true})
    })

    ngOnInit() {
        this.subscribtion = this.route.paramMap.subscribe((params) => {
            let id = params.get('id');
            if (id) {
                this.getTask(id);
                this.taskService.selectTask(id);
                this.initForm();
            }
        })
    }

    getTask(id: string): void {
        this.taskService.getTask(id).subscribe(task => this.task = task);
    }
    
    ngOnDestroy() {
        this.subscribtion!.unsubscribe();
    }
    
    submitForm(): void {
        this.formToTask()
        this.taskService.setTask(this.task!, this.isNewTask);
        this.task = undefined;
        this.resetForm();
        this.router.navigate(['/todo/new-task'], {queryParamsHandling: 'merge'})
    }

    closeForm(): void {
        this.taskService.selectTask('');
        this.router.navigate(['/todo'], {queryParamsHandling: 'merge'})
    }

    deleteTask(): void {
        if (this.task) {
            let text = "Are you sure you want to delete this task?";
            if (confirm(text) === true) {   
                this.taskService.deleteTask(this.task.id);
                this.router.navigate(['/todo'], {queryParamsHandling: 'merge'})
            }
        }
    }

    private formToTask() {
        const form = this.taskForm.controls;

        this.task = {
            id: this.setTaskId(),
            title: form.title.value,
            description: form.description.value,
            isCompleted: form.isCompleted.value
        }
        this.stringToTaskDate();
    }

    private setTaskId(): string {
        if (this.task) {
            this.isNewTask = false;
            return this.task.id;
        } else {
            this.isNewTask = true;
            return crypto.randomUUID();
        }
    }
    
    private initForm(): void {
        if (this.task) {
            this.taskForm.patchValue({
                title: this.task.title,
                description: this.task.description,
                dueDate: this.taskDateToString(),
                isCompleted: this.task.isCompleted
            })
        } else {
            this.taskForm.patchValue({
                title: '',
                description: '',
                dueDate: '',
                isCompleted: false
            })
        }
    }

    private resetForm(): void {
        this.taskForm.get('title')!.setValue('');
        this.taskForm.get('description')!.setValue('');
        this.taskForm.get('dueDate')!.setValue('');
        this.taskForm.get('isCompleted')!.setValue(false);
    }

    private stringToTaskDate() {
        const form = this.taskForm.controls;
        let date: Date | null = null;
        if (form.dueDate.value !== '') {
            date = new Date(form.dueDate.value);
        }
        if (date) {
            this.task!.dueDate = date;
        }
    }
    
    private taskDateToString(): string {
        if (this.task!.hasOwnProperty('dueDate')) {
            return moment(this.task!.dueDate).format('y-MM-DDTHH:mm');
        } else {
            return '';
        }
    }

}

