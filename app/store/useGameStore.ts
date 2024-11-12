// src/store/useGameStore.ts
import {create} from 'zustand';
import { gameSessionService } from '~/services/http/GameSessionServices';

interface GameSession {
  id: string;
  players: string[];
}

interface GameState {
  gameSession: GameSession | null;
  isLoading: boolean;
  error: string | null;
  startGameSession: () => Promise<void>;
  resetGameSession: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameSession: null,
  isLoading: false,
  error: null,

  // Action to start a new game session
  startGameSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await gameSessionService.createGameSession();
      set({ gameSession: session.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to start game session', isLoading: false });
      console.error(error);
    }
  },

  // Action to reset the game session
  resetGameSession: () => set({ gameSession: null, error: null }),
}));
