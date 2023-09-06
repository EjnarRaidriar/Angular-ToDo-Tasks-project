export interface FilterParams {
    completion: "all" | "active" | "completed";
    orderByDate: "default" | "asc" | "desc";
    search: string;
}