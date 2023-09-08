export interface Completion {
    value: "all" | "active" | "completed";
}

export interface OrderByDate {
    value: "default" | "asc" | "desc";
}

export interface FilterParams {
    completion: "all" | "active" | "completed";
    orderByDate: "default" | "asc" | "desc";
    search: string;
}