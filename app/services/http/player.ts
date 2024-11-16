import axios, { isAxiosError } from 'axios';
import { ResponseModel } from '../ResponseModel';
import { envs } from '~/env/envs';

const API_BASE_URL = envs.apiHttpBaseUrl // Cambia esto a la URL de tu backend

export interface Player {
    id: string;
    name: string;
    game_session_id: string;
    avatar_id: string;
    isHost: boolean;
    // Añade otros campos según tu modelo PlayerModel
}

export interface PlayerToCreate {
    name: string;
    game_session_id: string;
    avatar_id: string;
}

export const getAllPlayers = async (): Promise<ResponseModel<Player[]>> => {
    try {
        const response = await axios.get<ResponseModel<Player[]>>(`${API_BASE_URL}/all`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching players: ${error}`);
    }
};

export const createPlayer = async (player: PlayerToCreate): Promise<ResponseModel<Player>> => {
    try {
        const response = await axios.post<ResponseModel<Player>>(`${API_BASE_URL}/player/create`, player);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating player: ${error}`);
    }
};

export const getPlayerById = async (id: string): Promise<ResponseModel<Player>> => {
    try {
        const response = await axios.get<ResponseModel<Player>>(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Error fetching player: ${error}`);
    }
};

export const updatePlayer = async (id: string, player: Player): Promise<ResponseModel<Player>> => {
    try {
        const response = await axios.put<ResponseModel<Player>>(`${API_BASE_URL}/${id}`, player);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Error updating player: ${error}`);
    }
};

export const deletePlayer = async (id: string): Promise<ResponseModel<Player>> => {
    try {
        const response = await axios.delete<ResponseModel<Player>>(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
            throw new Error(error.response.data.message);
        }
        throw new Error(`Error deleting player: ${error}`);
    }
};