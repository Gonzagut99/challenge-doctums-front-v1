import { envs } from "~/env/envs";

class WebSocketService {
    private socket: WebSocket | null = null;
    private gameId: string;
    private playerId: string | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private messageHandler: (message: string | object) => void;

    // 'message' can be string or a JSON object
    constructor(gameId: string, playerId: string, messageHandler: (message: string | object) => void) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.messageHandler = messageHandler;
    }

    connect() {
        this.socket = new WebSocket(`${envs.apiWsBaseUrl}/game/${this.gameId}`);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
            // Enviar mensaje al conectarse
            if (this.playerId && this.socket) {
                this.socket.send(this.playerId);
            }
        };

        this.socket.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data);
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
    sendMessage(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
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

export default WebSocketService;

// Invoking the service
// const wsService = new WebSocketService(gameId, playerId);
// wsService.connect();