import { PlayerCanvasState } from "~/types/gameCanvasState";

// export type PlayerCanvasState = {
//     playerId: string
//     avatarId: number,
//     currentDay: number,
//     previousPosition: number,
//     currentPosition: number,
// };

export type GameCanvasStateMethods = {
    updatePlayerPosition: (
        playerId: string,
        current_day: number
    ) => void,
    getPlayerPosition: (
        playerId: string,
    ) => PlayerCanvasState | undefined,
    resetGameCanvasState: () => void,
    removePlayer: (
        playerId: string,
    ) => void,
}

// export const gameCanvasState: GameCanvasStateMethods = {
//     updatePlayerPosition: (
//         playerId: string,
//         current_day: number
//     ) => {
//         globalWebSocketService.gameCanvasState.map((player) => {
//             if (player.playerId === playerId) {
//                 player.currentDay = current_day;
//                 player.previousPosition = player.currentPosition;
//                 player.currentPosition = current_day;
//             }
//         }
//         );
//     },

//     getPlayerPosition: (
//         playerId: string,
//     ) => {
//         const gameCanvasState = globalWebSocketService.gameCanvasState;
//         if (!gameCanvasState) {
//             return;
//         }
//         return gameCanvasState.find(
//             (player) => player.playerId === playerId
//         );
//     },

//     resetGameCanvasState: () => {
//         globalWebSocketService.gameCanvasState = [];
//     },

//     removePlayer: (
//         playerId: string,
//     ) => {
//         const gameCanvasState = globalWebSocketService.gameCanvasState;
//         if (!gameCanvasState) {
//             return;
//         }
//         const playerIndex = gameCanvasState.findIndex(
//             (player) => player.playerId === playerId
//         );
//         if (playerIndex === -1) {
//             return;
//         }
//         gameCanvasState.splice(playerIndex, 1);
//     },
// }
