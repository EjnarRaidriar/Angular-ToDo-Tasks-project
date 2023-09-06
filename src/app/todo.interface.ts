export interface Todo {
    id: string;
    title: string;
    description: string;
    dueDate?: Date;
    isCompleted: boolean;
}