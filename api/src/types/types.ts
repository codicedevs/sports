export interface Filter {
    page: number;
    limit: number;
    populate?: string[];
    where?: object;
}

export interface FilterResponse<T> {
    total: number;
    results: T[];
}