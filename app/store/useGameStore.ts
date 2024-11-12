// src/store/useGameStore.ts
import {create} from 'zustand';
import { PlayerData } from '~/domain/entities/player';
import { GameSession } from '~/services/http/GameSessionServices';
import WebSocketService from '~/services/ws';

// interface GameSession {
//   id: string;
//   players: string[];
// }


interface GameState {
  gameSession: GameSession | null;
  isLoading: boolean;
  error: string | null;
  currentTurn: string | null;
  playerData: PlayerData | Record<string, never>;
  webSocketService: WebSocketService | null;
  isGameStarted: boolean;
  gameNotification: string;

  // initializeWebSocket: (gameId: string) => void;
  setPlayerData: (playerData: PlayerData) => void;
  setGameSessionNewPlayer: (player: PlayerData) => void;
  startGame: () => void;
  initializeWebSocket: (gameId: string) => void;
  // rollDice: () => void;
  // updateTurn: (turnData: Turn) => void;
  startGameSession: (newSession: GameSession) => void;
  resetGameSession: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameSession: null,
  isLoading: false,
  error: null,
  currentTurn: null,  // Example: "0e48a12f-b72e-4062-97e7-f8ccdcb9fcdd" (Player 1's turn)
  playerData: {},  // Example: { "id": "0e48a12f-b72e-4062-97e7-f8ccdcb9fcdd","name": "Romaine", "remaining_budget": 0 "avatar_id": 1, "score": 0, }
  webSocketService: null,  //Initially no WebSocket service
  isGameStarted: false,  // Example: false (game has not started yet)
  gameNotification: "",  

  // Action to start a new game session
  startGameSession: (newSession: GameSession | null) => {
    // set({ isLoading: true, error: null });
    // try {
    //   const session = await gameSessionService.createGameSession();
    //   set({ gameSession: session.data, isLoading: false });
    // } catch (error) {
    //   set({ error: 'Failed to start game session', isLoading: false });
    //   console.error(error);
    // }
    set({ gameSession: newSession, isLoading: false });
  },
  initializeWebSocket: (gameId: string) => {
    const webSocketService = new WebSocketService(gameId);
    // webSocketService.connect();

    // // Example listener for incoming messages
    // webSocketService.on('start_game', (data) => {
    //   set({ 
    //     isGameStarted: true, 
    //     players: data.players, 
    //     currentTurn: data.currentTurn 
    //   });
    // });

    // webSocketService.on('turn_update', (data) => {
    //   set({ currentTurn: data.currentTurn });
    // });

    // webSocketService.on('update_player_data', (data) => {
    //   const updatedPlayerData = { ...get().playerData, ...data };
    //   set({ playerData: updatedPlayerData });
    // });

    set({ webSocketService });
  },
  // Action to reset the game session
  resetGameSession: () => set({ gameSession: null, error: null }),
  setPlayerData: (playerData: PlayerData) => set({ playerData }),
  setGameSessionNewPlayer: (player: PlayerData) => {
    const { gameSession } = get();
    if (gameSession) {
      set({ gameSession: {
        ...gameSession,
        players: [...gameSession.players, player],
      } });
    }
  },
  startGame: () => {},

}));
