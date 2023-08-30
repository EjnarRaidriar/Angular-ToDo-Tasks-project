export interface Todo {
    id: string;
    title: string;
    description: string;
    completeBefore?: Date;
    isCompleted: boolean;
}


// import { FormControl } from '@angular/forms';
// export interface TodoForm {
//     id: FormControl<string>;
//     title: FormControl<string>;
//     description: FormControl<string>;
//     completeBefore: FormControl<Date>;
//     isCompleted: FormControl<boolean>;
// }