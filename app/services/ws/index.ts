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
import { PlayerCanvasState } from "~/types/gameCanvasState";



// {
//     id: this.currentPlayerAvatarInfo?.id,
//     name: this.currentPlayerAvatarInfo?.name,
//     avatarId: this.currentPlayerAvatarInfo?.avatar_id,
//     budget: this.startGameResponse?.budget,
//     score: this.currentPlayerAvatarInfo?.score,
//     efficiencies: this.currentPlayerAvatarInfo?.efficiencies,
    

// }

export type LocalPlayerDynamicInfo =  {
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
    private keepAliveInterval: NodeJS.Timeout | null = null;
    private localPlayerAvatarInfo: Player | null = null;
    private localPlayerDynamicInfo: LocalPlayerDynamicInfo | null = null;
    private connectedPlayers: ConnectedPlayer[] = []; // Store the list of players-explicit-any
    private isGameInitialized: boolean = false; // Control game canvas initialization
    public gameCanvasState: PlayerCanvasState[] = [];
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

    getGameStateCanvas() {
        return this.gameCanvasState;
    }

    // setGameStateCanvas(gameCanvasState: PlayerCanvasState[]) {
    //     this.gameCanvasState = gameCanvasState;
    // }

    getResponseWhenGameStarted() {
        return this.startGameResponse;
    }

    getDefinedTurnsOrder() {
        return this.turnOrderStageResponse?.turns_order ?? [];
    }

    getIsGameInitialized() {
        return this.isGameInitialized;
    }

    // Method to set playerId later
    setGameId(gameId: string) {
        this.gameId = gameId;
    }

    setPlayer(player: Player) {
        this.localPlayerAvatarInfo = player;
    }

    setIsGameInitialized(isInitialized: boolean) {
        this.isGameInitialized = isInitialized;
    }

    getLocalPlayerAvatarInfo() {
        return this.localPlayerAvatarInfo
    }

    setLocalPlayerDynamicInfo() {
        this.localPlayerDynamicInfo = {
            id: this.localPlayerAvatarInfo?.id ?? '',
            name: this.localPlayerAvatarInfo?.name ?? '',
            avatarId: this.localPlayerAvatarInfo?.avatar_id ?? '',
            budget: this.startGameResponse?.player.budget ?? 0,
            score: this.startGameResponse?.player.score ?? 0,
            //modifiers: this.turnStartInfo?. ?? {},
        };
    }

    getLocalPlayerDynamicInfo() {
        return this.localPlayerDynamicInfo;
    }

    isGameStarted() {
        return this.gameStateMessage?.status === 'success'
    }

    isLocalPlayerTurn() {
        return this.gameStateMessage?.current_turn === this.localPlayerAvatarInfo?.id;
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
            this.startKeepAlive();
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

        this.socket.onclose = (e) => {
            console.log("WebSocket connection closed", e.reason);
            this.stopKeepAlive();
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

    listentoGameEvents() {
        if(this.socket && this.socket.readyState === ServerWebSocket.OPEN){
            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                this.handleNotifications(message);
                this.handleJoinGame(message);
                this.handleStartGameResponse(message);
                this.handlerTurnOrderStage(message);
                this.handleNewTurnStart(message);
            };
        }
    }

    // Join the game with a player name
    joinGame() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const joinMessage = {
                method: 'join',
                player_id: this.localPlayerAvatarInfo?.id,
            };

            // Send the message to the server
            this.sendMessage(joinMessage);
            this.listentoGameEvents();

            // Optionally, listen for players' info update after joining
            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
                
            // };
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

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.setIsGameInitialized(true);
            //     this.handleStartGameResponse(message);
            //     this.handlerTurnOrderStage(message);
            //     this.handleNotifications(message);
                
            // };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    rollDices() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'turn_order_stage',
                INFO_DEBUG: this.localPlayerAvatarInfo
            };

            // Send the message to the server
            this.sendMessage(send);

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.handlerTurnOrderStage(message);
                
            // };
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

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.handleNewTurnStart(message);
            //     this.handleNotifications(message);
            // };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    updatePlayersPositions() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'update_players_positions',
            };

            // Send the message to the server
            this.sendMessage(send);

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.handleCanvasPlayerPositions(message);
                
            // };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
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

    handleStartGameResponse(message: any) {
        if (message.status === 'success' && message.method == "start_game") {
            this.startGameResponse = message;
            this.gameStateMessage = message;
            this.setLocalPlayerDynamicInfo()
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

    handleJoinGame(message:any){
        // if (message.status === 'success' && message.method == "join") {
        //     this.connectedPlayers = message.game.players;
        //     console.log("Updated Players List:", this.connectedPlayers);
        //     emitter.emit('players', this.connectedPlayers);
        // }

        if (message.status === 'success' && message.method == "join") {
            this.connectedPlayers = message.game.players;
            // export type ConnectedPlayer = {
            //     name: string;
            //     id: string; //is UUID
            //     avatarId: string;
            //     isHost: boolean;
            //     // characterData: CharacterData;
            // }
            const canvasPlayers: PlayerCanvasState[] = this.connectedPlayers.map((player: ConnectedPlayer) => ({
                playerId: player.id,
                avatarId: Number(player.avatarId),
                currentDay: 0,
                isLocalPlayer: player.id === this.localPlayerAvatarInfo?.id,
                previousPosition: 0,
                currentPosition: 0,
            }));
            this.gameCanvasState = canvasPlayers;
            console.log("Updated Players List:", this.connectedPlayers);
            emitter.emit('players', this.connectedPlayers);
        }
    }

    handleNotifications(message: any) {
        if (message.method === 'notification') {
            this.gameStateMessage = message;
            console.log("notification", message);
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

    handleCanvasPlayerPositions(message: any) {
        if (message.method === 'updated_players_positions') {
            this.gameCanvasState = message.players;
            console.log("Canvas Player Positions", message);
            emitter.emit('gameCanvas', message);
        }   
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

    handleSetNextTurn(message: any) {
        if (message.method === 'next_turn') {
            this.gameStateMessage = message;

            console.log("Next Turn", message);
            emitter.emit('game', message);
        }
    }

    // handleCanvasPlayerPositions(message: any) {
    //     if (message.method === 'canvas_player_positions') {
    //         this.gameCanvasState = message.players;
    //         console.log("Canvas Player Positions", message);
    //         emitter.emit('canvasPlayers', message);
    //     }
    // }

    // Get the current list of players
    getConnectedPlayers() {
        return this.connectedPlayers;
    }


    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    // Start keepalive mechanism
    private startKeepAlive() {
        this.keepAliveInterval = setInterval(() => {
            if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
                this.sendMessage({ "method": "ping" });
            }
        }, 30000); // Send ping every 30 seconds
    }

    // Stop keepalive mechanism
    private stopKeepAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
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