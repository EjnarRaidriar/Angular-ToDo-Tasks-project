export interface Todo {
    id: string;
    title: string;
    description: string;
    completeBefore?: Date;
    isCompleted: boolean;
}