export interface Filter {
    page: number;
    limit: number;
    populate?: string[];
    where?: object;
}

export interface FilterResponse<T> {
    totalCount: number;
    results: T[];
    page?: number;
    limit?: number,
}