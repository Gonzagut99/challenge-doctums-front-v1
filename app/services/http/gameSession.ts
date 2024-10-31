//create a data fetching services to a backend
import axios, {isAxiosError} from 'axios';
import { ResponseModel } from '../ResponseModel'
import { envs } from '~/env/envs';

const API_BASE_URL = envs.apiHttpBaseUrl// Cambia esto a la URL de tu backend

export interface GameSession {
    id: string;
    players: string[];
    // Añade otros campos según tu modelo GameSessionModel
}

export const createGameSession = async (): Promise<ResponseModel<GameSession>> => {
    try {
        const response = await axios.post<ResponseModel<GameSession>>(`${API_BASE_URL}/create`);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating game session: ${error}`);
    }
};

export const getAllGameSessions = async (): Promise<ResponseModel<GameSession[]>> => {
    try {
        const response = await axios.get<ResponseModel<GameSession[]>>(`${API_BASE_URL}/all`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Error fetching game sessions: ${error}`);
    }
};

export const getGameSessionById = async (id: string): Promise<ResponseModel<GameSession>> => {
    try {
        const response = await axios.get<ResponseModel<GameSession>>(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Error fetching game session: ${error}`);
    }
};

export const deleteGameSession = async (id: string): Promise<ResponseModel<GameSession>> => {
    try {
        const response = await axios.delete<ResponseModel<GameSession>>(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Error deleting game session: ${error}`);
    }
};