// // src/context/GameSessionProvider.tsx
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { GameSession, gameSessionService } from '~/services/http/GameSessionServices';
// import WebSocketService from '~/services/ws';

// interface GameSessionContextType {
//     gameSession: GameSession | undefined;
//     startGame: () => Promise<void>;
//     sendMessage: (message: string | object) => void;
//     disconnect: () => void;
// }

// const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

// export const GameSessionProvider = ({ children }: { children: ReactNode }) => {
//     const [gameSession, setGameSession] = useState<GameSession | undefined>(undefined);
//     const [webSocketService, setWebSocketService] = useState<WebSocketService | undefined>(undefined);

//     const startGame = async () => {
//         const response = await gameSessionService.createGameSession();
//         setGameSession(response.data);

//         if(!response.data?.id) {
//             console.error("Failed to start game session");
//             return;
//         }

//         // Initialize WebSocket connection for the new session
//         const wsService = new WebSocketService(
//             response.data.id,
//             "yourPlayerId",
//             (message) => {
//                 console.log("Received WebSocket message:", message);
//             }
//         );
//         wsService.connect();
//         setWebSocketService(wsService);
//     };

//     const sendMessage = (message: string | object) => {
//         webSocketService?.sendMessage(JSON.stringify(message));
//     };

//     const disconnect = () => {
//         webSocketService?.disconnect();
//     };

//     useEffect(() => {
//         // Cleanup WebSocket connection on unmount
//         return () => {
//             webSocketService?.disconnect();
//         };
//     }, [webSocketService]);

//     return (
//       <GameSessionContext.Provider
//           value={{
//               gameSession,
//               startGame,
//               sendMessage,
//               disconnect,
//           }}
//       >
//         {children}
//     </GameSessionContext.Provider>
//     );
// };

// export const useGameSession = () => {
//     const context = useContext(GameSessionContext);
//     if (context === undefined) {
//         throw new Error("useGameSession must be used within a GameSessionProvider");
//     }
//     return context;
// };
