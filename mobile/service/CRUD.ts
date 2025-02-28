import { HttpService } from "./http.service";

export class CRUDService<T> extends HttpService {
    constructor(endpoint: string) {
        super(endpoint);
    }

    getAll = async (params?: any) => {
        const res = await this.get("/", { params });
        return res.data;
    };

    getById = async (id: string) => {
        const res = await this.get(`/${id}`);
        return res.data;
    };

    create = async (data: T) => {
        const res = await this.post("/", data);
        return res.data;
    };

    update = async (id: string, data: Partial<T>) => {
        const res = await this.put(`/${id}`, data);
        return res.data;
    };

    remove = async (id: string) => {
        const res = await this.delete(`/${id}`);
        return res.data;
    };
}
