// emitter.client.ts
// clase para emitir eventos en el cliente
class ClientEventEmitter {
    private events: Record<string, Function[]> = {};

    on(event: string, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, ...args: any[]) {
        if (this.events[event]) {
            this.events[event].forEach((listener) => listener(...args));
        }
    }

    off(event: string, listener: Function) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter((l) => l !== listener);
        }
    }
}

export const emitter = new ClientEventEmitter();
