/* eslint-disable @typescript-eslint/no-explicit-any */

import { envs } from "~/env/envs";
import ServerWebSocket from "ws";
import { ConnectedPlayer } from "~/types/connectedPlayer";

import { Player } from "../http/player";
import { emitter } from "~/utils/emitter.server";
import { GameStartMessage } from "~/types/methods_jsons/startGameResponse";
import { TurnOrderStage } from "~/types/methods_jsons/turnOrderStage";

export interface IWebSocketService {
    connect(): void;
    sendMessage(message: string | object): void;
    disconnect(): void;
    joinGame(playerId: string): void;
    getConnectedPlayers(): ConnectedPlayer[];
    startGame(): void;
}

class WebSocketService implements IWebSocketService {
    private socket: ServerWebSocket | null = null;
    private gameId: string;
    private currentPlayer: Player | null = null;
    private connectedPlayers: ConnectedPlayer[] = []; // Store the list of players-explicit-any
    private startGameResponse: GameStartMessage;
    private turnOrderStageResponse: TurnOrderStage;
    private gameStateMessage: any;
    //private messageHandler: (message: string | object) => void;

    // // 'message' can be string or a JSON object
    // constructor(gameId: string) {
    //     this.gameId = gameId;
    // }

    // Method to set playerId later
    setGameId(gameId: string) {
        this.gameId = gameId;
    }

    // Method to set playerId later
    setPlayer(player: Player) {
        this.currentPlayer = player;
    }

    getCurrentPlayer() {
        return this.currentPlayer
    }

    isGameStarted() {
        return this.gameStateMessage?.status === 'success'
    }

    isCurrentPlayerTurn() {
        return this.gameStateMessage?.current_turn === this.currentPlayer?.id;
    }

    getCurrentPlayerTurn() {
        return this.gameStateMessage?.current_turn;
    }

    getStageMethod() {
        return this.gameStateMessage?.method;
    }

    getGameState<T>() {
        return this.gameStateMessage as T;
    }

    // Method to set messageHandler later
    // setMessageHandler(messageHandler: (message: string | object) => void) {
    //     this.messageHandler = messageHandler;
    // }

    // removeMessageHandler() {
    //     this.messageHandler = () => {};
    // }

    connect() {
        this.socket = new ServerWebSocket(`${envs.apiWsBaseUrl}/game/connect/${this.gameId}`);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
            // Enviar mensaje al conectarse
            // if (this.playerId && this.socket) {
            //     this.socket.send(this.playerId);
            // }
        };

        // this.socket.onmessage = (event) => {
        //     try {
        //       const message = JSON.parse(event.data.toString());
        //       // Manejar el mensaje JSON
        //       this.messageHandler(message);
        //     } catch (error) {
        //       // El mensaje no es JSON válido, manejar como texto plano
        //       console.log("Mensaje de texto recibido:", event.data);
        //       this.messageHandler({ type: 'text', data: event.data });
        //     }
        //   };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    // 'message' can be string or a JSON object
    sendMessage(message: string | object) {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error(
                "WebSocket is not open. Ready state:",
                this.socket?.readyState
            );
        }
    }

    // Join the game with a player name
    joinGame() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const joinMessage = {
                method: 'join',
                player_id: this.currentPlayer?.id,
            };

            // Send the message to the server
            this.sendMessage(joinMessage);

            // Optionally, listen for players' info update after joining
            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                if (message.status === 'success' && message.method == "join") {
                    this.connectedPlayers = message.game.players;
                    console.log("Updated Players List:", this.connectedPlayers);
                    emitter.emit('players', this.connectedPlayers);
                }

                this.handleStartGameResponse(message);
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }


    //Join the game with a player name
    startGame() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const startGame = {
                method: 'start_game'
            };

            // Send the message to the server
            this.sendMessage(startGame);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleStartGameResponse(message);
                this.handlerTurnOrderStage(message);

                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    rollDices() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const startGame = {
                method: 'turn_order_stage'
            };

            // Send the message to the server
            this.sendMessage(startGame);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handlerTurnOrderStage(message);
                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    handleStartGameResponse(message: any) {
        if (message.status === 'success' && message.method == "start_game") {
            this.startGameResponse = message;
            this.gameStateMessage = message;
            console.log("Host started game", this.startGameResponse);
            emitter.emit('players', this.connectedPlayers);
        }
    }

    handlerTurnOrderStage(message: any) {
        if (message.method === 'turn_order_stage') {
            this.turnOrderStageResponse = message;
            this.gameStateMessage = message;
            console.log("Turn Stage", message);
            emitter.emit('game', message);
        }
    }
    

    // Get the current list of players
    getConnectedPlayers() {
        return this.connectedPlayers;
    }


    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}


export const globalWebSocketService = new WebSocketService();

//export default WebSocketService;

// Invoking the service
// const wsService = new WebSocketService(gameId, playerId);
// wsService.connect();