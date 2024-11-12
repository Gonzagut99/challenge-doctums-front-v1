import { ResponseModel } from "../ResponseModel";
import { apiClient } from ".";

export interface GameSession {
  id: string;
  players: string[];
  // Añade otros campos según tu modelo GameSessionModel
}

export class GameSessionService {
    async createGameSession(): Promise<ResponseModel<GameSession>> {
        return apiClient.post('/create');
    }

    async getAllGameSessions(): Promise<ResponseModel<GameSession[]>> {
        return apiClient.get('/all');
    }

    async getGameSessionById(id: string): Promise<ResponseModel<GameSession>> {
        return apiClient.get(`/${id}`);
    }

    async deleteGameSession(id: string): Promise<ResponseModel<GameSession>> {
        return apiClient.delete(`/${id}`);
    }
}

export const gameSessionService = new GameSessionService();
