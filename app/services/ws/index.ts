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
import { UpdatedPlayersPositions } from "~/types/methods_jsons/updatePlayersPositions";
import { LocalPlayerModifiers } from "~/types/methods_jsons/submitPlan";



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
    public localPlayerDynamicInfo: LocalPlayerDynamicInfo | null = null;
    public localPlayerPreviousEfficiencies: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0
    };
    public localPlayerEfficiencies: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0
    };
    private connectedPlayers: ConnectedPlayer[] = []; // Store the list of players-explicit-any
    private isGameInitialized: boolean = false; // Control game canvas initialization
    public gameCanvasState: PlayerCanvasState[] = [];
    public updatedPlayersPositions: UpdatedPlayersPositions | null;
    private startGameResponse: GameStartMessage;
    private turnOrderStageResponse: TurnOrderStage;
    private newTurn_storedData: StartNewTurn | Record<string, any>;
    public submitPlan_localPlayerPlan: PlanActions = {
        products: [],
        projects: [],
        resources: []
    };
    public submitPlan_potentialRemainingBudget: number = 0;
    public localPlayerModifiers: LocalPlayerModifiers | Record<string, { id: string; is_enabled?: boolean; was_bought?: boolean; purchased_requirements?: string[]; remaining_time?:number }[]> = {
        products: [],
        projects: [],
        resources: []
    };
    private submitActionPlanEffects: SubmitPlanResponse;
    public eventFlow_results: TurnEventResults | Record<string, any> ;

    private nextTurn_newTurnSettledInfo: NextTurnResponse;

    private gameStateMessage: any;
    //private messageHandler: (message: string | object) => void;

    // // 'message' can be string or a JSON object
    // constructor(gameId: string) {
    //     this.gameId = gameId;
    // }

    getHasPositionsUpdated() {
        const copy = this.updatedPlayersPositions;
        this.updatedPlayersPositions = null;
        return copy;
    }


    getGameStateCanvas() {
        return this.gameCanvasState;
    }

    getLocalPlayerActionPlanState(){
        return this.submitPlan_localPlayerPlan;
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

    // getIsRenderedOneTime() {
    //     return this.isRenderedOneTime;
    // }

    // getNewTurnStartedResponse() {
    //     return this.newTurn_storedData;
    // }

    newTurn_getStoredLocalPlayerDaysAdvanced() {
        return {
            days: this.newTurn_storedData?.thrown_dices.reduce((acc: number, dice: number) => acc + dice, 0),
            dices: this.newTurn_storedData?.thrown_dices
        };
    }

    newTurn_getStoredLocalPlayerData() {
        return this.newTurn_storedData
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

    getSubmitPlanEffects() {
        return this.submitActionPlanEffects;
    }

    // Method to set messageHandler later
    // setMessageHandler(messageHandler: (message: string | object) => void) {
    //     this.messageHandler = messageHandler;
    // }

    // removeMessageHandler() {
    //     this.messageHandler = () => {};
    // }

    getConnectedWsAddress() {
        return `${envs.apiWsBaseUrl}/game/connect/${this.gameId}`
    }

    connect() {
        this.socket = new ServerWebSocket(this.getConnectedWsAddress());

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
        if(this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data.toString());
                console.log("Message received", message);
                this.handleNotifications(message);
                this.handleJoinGame(message);
                this.handleStartGameResponse(message);
                this.handlerTurnOrderStage(message);
                this.handleNewTurnStart(message);
                this.handleAdvanceDays(message);
                this.handleCanvasPlayerPositions(message);
                this.handleActionPlanResponse(message);
                this.handleSetNextTurn(message);
                this.handleTurnEvent(message);
            };
        }
    }

    // Join the game with a player name
    joinGame() {
        if ( (this.socket && this.socket.readyState === ServerWebSocket.OPEN)) {
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



    advanceDays() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const startGame = {
                method: 'advance_days'
            };

            // Send the message to the server
            this.sendMessage(startGame);
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

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.handleActionPlanResponse(message);
                
            // };
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

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.handleTurnEvent(message);
                
            // };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    setNextTurn() {
        if (this.socket && this.socket.readyState === ServerWebSocket.OPEN) {
            const send = {
                method: 'next_turn'
            };
            //Here, we can update the previous effciecies property

            // Send the message to the server
            this.sendMessage(send);

            // this.socket.onmessage = (event) => {
            //     const message = JSON.parse(event.data.toString());
            //     this.handleSetNextTurn(message);
                
            // };
        } else {
            console.error("WebSocket is not open. Ready state:", this.socket?.readyState);
        }
    }

    // handleNotifications(message: any) {
    //     if (message.method === 'notification') {
    //         this.gameStateMessage = message;
    //         console.log("notification", message);
    //         emitter.emit('game', message);
    //     }
    // }

    handleAdvanceDays(message: any) {
        if (message.method === 'days_advanced') {
            this.gameStateMessage = message;
            console.log("advance days", message);
            emitter.emit('game', message);
        }
    }

    handleStartGameResponse(message: any) {
        if (message.status === 'success' && message.method == "start_game") {
            this.startGameResponse = message;
            this.localPlayerModifiers.products = message.legacy_products.map((product: string) => {
                return ({
                    id: product,
                    is_enabled: false,
                    was_bought: false,
                    purchased_requirements: []
                });
            });
            // this.localPlayerModifiers.products = message.legacy_products;
            this.gameStateMessage = message;
            this.localPlayerEfficiencies= message.player.efficiencies;
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
                connectedWsAddress: this.getConnectedWsAddress(),
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
            this.newTurn_storedData = message;
            this.gameStateMessage = message;
            console.log("New Turn Start", message);
            emitter.emit('game', message);
        }
    }

    handleCanvasPlayerPositions(message: any) {
        if (message.method === 'updated_players_positions') {
            console.log("Canvas Player Positions", message);
            this.updatedPlayersPositions = message;
            this.gameCanvasState = message.players_position;
            emitter.emit('game', message);
        }   
    }

    handleActionPlanResponse(message:SubmitPlanResponse ) {
        if (message.method === 'submit_plan') {
            this.gameStateMessage = message;
            this.submitActionPlanEffects = message;
            if (this.localPlayerDynamicInfo) {
                this.localPlayerDynamicInfo.budget = message.player.budget;
            }
            const noBaughtProducts = this.localPlayerModifiers.products.filter(product => !product.was_bought);
            const noBoughtProductsIds = noBaughtProducts.map(product => product.id);
            const localPlayerProducts = message.player.products.map(product => {
                if(noBoughtProductsIds.includes(product.product_id)){
                    return ({
                        id: product.product_id,
                        is_enabled: product.is_enabled,
                        was_bought: false,
                        purchased_requirements: product.purchased_requirements,
                    });
                }
                return {
                    id: product.product_id,
                    is_enabled: product.is_enabled,
                    was_bought: true,
                    purchased_requirements: product.purchased_requirements,
                };
            }
            );

            this.localPlayerModifiers.products = localPlayerProducts.length > 0 ? localPlayerProducts : this.localPlayerModifiers.products;
            this.localPlayerModifiers.projects = message.player.projects.map(project => ({
                id: project.project_id,
                remaining_time: project.remaining_time,
            }));
            this.localPlayerModifiers.resources = message.player.resources.map(resource => ({
                id: resource.resource_id,
                remaining_time: resource.remaining_time,
            }));
            console.log("Action Plan", JSON.stringify(message));
            emitter.emit('game', message);
        }
    }

    handleTurnEvent(message: any) {
        if (message.method === 'turn_event_flow') {
            this.gameStateMessage = message;
            this.eventFlow_results = message;
            if (this.localPlayerDynamicInfo) {
                this.localPlayerDynamicInfo.budget = message.player.budget;
                this.localPlayerDynamicInfo.score = message.player.score;
            }
            this.localPlayerPreviousEfficiencies = this.localPlayerEfficiencies;
            this.localPlayerEfficiencies = message.player.effiencies;
            console.log("Game Event", message);
            emitter.emit('game', message);
        }
    }

    handleSetNextTurn(message: NextTurnResponse) {
        if (message.method === 'next_turn') {
            this.gameStateMessage = message;
            this.nextTurn_newTurnSettledInfo = message;
            //Here we can make it possible to show the previous player results' summary            this.eventFlow_results = {};
            this.newTurn_storedData = {}

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