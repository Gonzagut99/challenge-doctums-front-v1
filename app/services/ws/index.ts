/* eslint-disable @typescript-eslint/no-explicit-any */

import { envs } from "~/env/envs";
import ServerWebSocket from "ws";
import { ConnectedPlayer } from "~/types/connectedPlayer";

import { Player } from "../http/player";
const isServer = typeof window === "undefined";
const { emitter } = isServer
    ? await import("~/utils/emitter.server")
    : await import("~/utils/emitter.client");
import { GameStartMessage } from "~/types/methods_jsons/startGameResponse";
import { TurnOrderStage } from "~/types/methods_jsons/turnOrderStage";
import { StartNewTurn } from "~/types/methods_jsons/startNewTurn";
import { NextTurnResponse, PlanActions, SubmitPlanResponse, TurnEventResults } from "~/types/methods_jsons";


// {
//     id: this.currentPlayerAvatarInfo?.id,
//     name: this.currentPlayerAvatarInfo?.name,
//     avatarId: this.currentPlayerAvatarInfo?.avatar_id,
//     budget: this.startGameResponse?.budget,
//     score: this.currentPlayerAvatarInfo?.score,
//     efficiencies: this.currentPlayerAvatarInfo?.efficiencies,
    

// }

export type PlayerClientInfo =  {
    id: string;
    name: string;
    avatarId: string;
    budget: number;
    score: number;
    //modifiers: any;
}

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
    private currentPlayerAvatarInfo: Player | null = null;
    private playerClientInfo: PlayerClientInfo | null = null;
    private connectedPlayers: ConnectedPlayer[] = []; // Store the list of players-explicit-any
    private startGameResponse: GameStartMessage;
    private turnOrderStageResponse: TurnOrderStage;
    private turnStartInfo: StartNewTurn;
    private gameStateMessage: any;
    private submitActionPlanEffects: SubmitPlanResponse
    private currentEventResults: TurnEventResults;
    private newTurnSettled: NextTurnResponse;
    //private messageHandler: (message: string | object) => void;

    // // 'message' can be string or a JSON object
    // constructor(gameId: string) {
    //     this.gameId = gameId;
    // }

    getResponseWhenGameStarted() {
        return this.startGameResponse;
    }

    getDefinedTurnsOrder() {
        return this.turnOrderStageResponse?.turns_order ?? [];
    }


    // Method to set playerId later
    setGameId(gameId: string) {
        this.gameId = gameId;
    }

    setPlayer(player: Player) {
        this.currentPlayerAvatarInfo = player;
    }

    getCurrentPlayerAvatarInfo() {
        return this.currentPlayerAvatarInfo
    }

    setPlayerClientInfo() {
        this.playerClientInfo = {
            id: this.currentPlayerAvatarInfo?.id ?? '',
            name: this.currentPlayerAvatarInfo?.name ?? '',
            avatarId: this.currentPlayerAvatarInfo?.avatar_id ?? '',
            budget: this.startGameResponse?.player.budget ?? 0,
            score: this.startGameResponse?.player.score ?? 0,
            //modifiers: this.turnStartInfo?. ?? {},
        };
    }

    getPlayerClientInfo() {
        return this.playerClientInfo;
    }

    isGameStarted() {
        return this.gameStateMessage?.status === 'success'
    }

    isCurrentPlayerTurn() {
        return this.gameStateMessage?.current_turn === this.currentPlayerAvatarInfo?.id;
    }

    getTurnsOrder() {
        return this.gameStateMessage?.turns_order;
    }

    getCurrentPlayerTurn() {
        return this.gameStateMessage?.current_turn;
    }

    getStageMethod(): string {
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
                player_id: this.currentPlayerAvatarInfo?.id,
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
            const send = {
                method: 'start_game'
            };

            // Send the message to the server
            this.sendMessage(send);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleStartGameResponse(message);
                this.handlerTurnOrderStage(message);
                this.handleNotifications(message);
                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    rollDices() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'turn_order_stage'
            };

            // Send the message to the server
            this.sendMessage(send);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handlerTurnOrderStage(message);
                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    startNewTurn() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const startGame = {
                method: 'start_new_turn'
            };

            // Send the message to the server
            this.sendMessage(startGame);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleNewTurnStart(message);
                this.handleNotifications(message);
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    handleNotifications(message: any) {
        if (message.method === 'notification') {
            this.gameStateMessage = message;
            console.log("notification", message);
            emitter.emit('game', message);
        }
    }

    submitPlan(plan: PlanActions) {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'submit_plan',
                actions: plan
            };

            // Send the message to the server
            this.sendMessage(send);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleActionPlanResponse(message);
                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    startTurnEventFlow(){
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'turn_event_flow'
            };

            // Send the message to the server
            this.sendMessage(send);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleTurnEvent(message);
                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    setNextTurn() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'next_turn'
            };

            // Send the message to the server
            this.sendMessage(send);

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleSetNextTurn(message);
                
            };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    handleSetNextTurn(message: any) {
        if (message.method === 'next_turn') {
            this.gameStateMessage = message;

            console.log("Next Turn", message);
            emitter.emit('game', message);
        }
    }

    handleNewTurnStart(message: any) {
        if (message.method === 'new_turn_start') {
            this.turnStartInfo = message;
            this.gameStateMessage = message;
            console.log("New Turn Start", message);
            emitter.emit('game', message);
        }
    }

    handleStartGameResponse(message: any) {
        if (message.status === 'success' && message.method == "start_game") {
            this.startGameResponse = message;
            this.gameStateMessage = message;
            this.setPlayerClientInfo()
            console.log("Host started game", this.startGameResponse);
            emitter.emit('players', this.connectedPlayers);
        }
    }

    handlerTurnOrderStage(message: any) {
        if (message.method === 'turn_order_stage') {
            this.turnOrderStageResponse = message;
            this.gameStateMessage = message;
            console.log("Turn Stage", message);
            //agregada
            const players = this.getPlayersFromTurnOrder(message);
            //agregada
            emitter.emit('renderPlayersOnMap', players);
            emitter.emit('game', message);
        }
    }

    //agregado
    getPlayersFromTurnOrder(message: any) {
        if (message?.turns_order) {
            return message.turns_order.map((turn: any) => ({
                playerId: turn.player_id,
                avatarId: turn.avatar_id,
                name: turn.name,
                dices: turn.dices,
                total: turn.total,
            }));
        }
        return [];
    }

    handleActionPlanResponse(message:SubmitPlanResponse ) {
        if (message.method === 'submit_plan') {
            this.gameStateMessage = message;
            this.submitActionPlanEffects = message;
            console.log("Action Plan", message);
            emitter.emit('updatedModifiers', message);
        }
    }

    handleTurnEvent(message: any) {
        if (message.method === 'turn_event_flow') {
            this.gameStateMessage = message;
            this.currentEventResults = message;
            console.log("Game Event", message);
            emitter.emit('eventResults', message);
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


// eslint-disable-next-line no-var
export var globalWebSocketService: WebSocketService;

export function initializeWebSocket(gameId: string) {
    globalWebSocketService = new WebSocketService();
    globalWebSocketService.setGameId(gameId);
    globalWebSocketService.connect();
}

//export default WebSocketService;

// Invoking the service
// const wsService = new WebSocketService(gameId, playerId);
// wsService.connect();