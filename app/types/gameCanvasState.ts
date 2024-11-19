export type PlayerCanvasState = {
    connectedWsAddress:string;
    playerId: string,
    avatarId: number,
    currentDay: number,
    isLocalPlayer: boolean,
    previousPosition: number,
    currentPosition: number,
};

export type CreateCanvasPlayer = {
    playerId: string,
    avatarId: number,
    currentDay: number,
};