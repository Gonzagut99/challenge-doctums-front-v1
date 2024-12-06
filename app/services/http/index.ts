// src/services/ApiClient.ts
import axios, { AxiosInstance } from 'axios';
import { envs } from '~/env/envs';

class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get<T>(url: string): Promise<T> {
        return (await this.client.get<T>(url)).data;
    }

    async post<T>(url: string, data?: unknown): Promise<T> {
        return (await this.client.post<T>(url, data)).data;
    }

    async delete<T>(url: string): Promise<T> {
        return (await this.client.delete<T>(url)).data;
    }
}

export const apiClient = new ApiClient(`${envs.apiHttpBaseUrl}/game`);
