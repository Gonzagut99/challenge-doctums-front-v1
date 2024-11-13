
import { envs } from "~/env/envs";
import ServerWebSocket from "ws";

export interface IWebSocketService {
    connect(): void;
    sendMessage(message: string | object): void;
    disconnect(): void;
}

class WebSocketService implements IWebSocketService {
    private socket: ServerWebSocket | null = null;
    private gameId: string;
    private playerId: string | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private messageHandler: (message: string | object) => void;

    // // 'message' can be string or a JSON object
    // constructor(gameId: string) {
    //     this.gameId = gameId;
    // }

    // Method to set playerId later
    setGameId(gameId: string) {
        this.gameId = gameId;
    }

    // Method to set playerId later
    setPlayerId(playerId: string) {
        this.playerId = playerId;
    }

    // Method to set messageHandler later
    setMessageHandler(messageHandler: (message: string | object) => void) {
        this.messageHandler = messageHandler;
    }

    connect() {
        this.socket = new ServerWebSocket(`${envs.apiWsBaseUrl}/game/connect/${this.gameId}`);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
            // Enviar mensaje al conectarse
            // if (this.playerId && this.socket) {
            //     this.socket.send(this.playerId);
            // }
        };

        this.socket.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data.toString());
              // Manejar el mensaje JSON
              this.messageHandler(message);
            } catch (error) {
              // El mensaje no es JSON válido, manejar como texto plano
              console.log("Mensaje de texto recibido:", event.data);
              this.messageHandler({ type: 'text', data: event.data });
            }
          };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    // 'message' can be string or a JSON object
    sendMessage(message: string | object) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error(
                "WebSocket is not open. Ready state:",
                this.socket?.readyState
            );
        }
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