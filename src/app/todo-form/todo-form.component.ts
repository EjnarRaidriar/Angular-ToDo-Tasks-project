import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { TaskService } from '../task.service';
import { Todo } from '../todo.interface';

interface TodoForm {
    title: FormControl<string>;
    description: FormControl<string>;
    completeBefore: FormControl<string>;
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
        completeBefore: new FormControl('', {nonNullable: true}),
        isCompleted: new FormControl(false, {nonNullable: true})
    })

    ngOnInit() {
        this.subscribtion = this.route.paramMap.subscribe((params) => {
            let id = params.get('id');
            if (id) {
                this.task = this.taskService.getTask(id);
                this.taskService.selectTask(id);
                this.initForm();
            }
        })
    }
    
    ngOnDestroy() {
        this.subscribtion!.unsubscribe();
    }

    closeForm(): void {
        this.taskService.selectTask('');
        this.router.navigate(['/todo'])
    }
    
    submitForm(): void {
        this.formToTask()
        this.taskService.setTask(this.task!, this.isNewTask);
        this.resetForm();
        this.router.navigate(['/todo/new-task'])
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
            this.taskForm.get('title')!.setValue(this.task.title);
            this.taskForm.get('description')!.setValue(this.task.description);
            this.taskForm.get('completeBefore')!.setValue(this.taskDateToString());
            this.taskForm.get('isCompleted')!.setValue(this.task.isCompleted);
        } else {
            this.taskForm.get('title')!.setValue('');
            this.taskForm.get('description')!.setValue('');
            this.taskForm.get('completeBefore')!.setValue('');
            this.taskForm.get('isCompleted')!.setValue(false);
        }
    }

    private resetForm(): void {
        this.taskForm.get('title')!.setValue('');
        this.taskForm.get('description')!.setValue('');
        this.taskForm.get('completeBefore')!.setValue('');
        this.taskForm.get('isCompleted')!.setValue(false);
    }

    private stringToTaskDate() {
        const form = this.taskForm.controls;
        let date: Date | null = null;
        if (form.completeBefore.value !== '') {
            date = new Date(form.completeBefore.value);
        }
        if (date) {
            this.task!.completeBefore = date;
        }
    }
    
    private taskDateToString(): string {
        if (this.task!.hasOwnProperty('completeBefore')) {
            return moment(this.task!.completeBefore).format('y-MM-DDTHH:mm');
        } else {
            return '';
        }
    }

}

