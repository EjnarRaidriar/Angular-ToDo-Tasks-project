import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoComponent } from './todo/todo.component';
import { TodoFormComponent } from './todo-form/todo-form.component';

const routes: Routes = [
    { path: '', redirectTo: '/todo', pathMatch: 'full' },
    { path: 'todo', component: TodoComponent,
        children: [
            {path: ':id', component: TodoFormComponent}
        ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
