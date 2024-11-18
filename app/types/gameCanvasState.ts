export type PlayerCanvasState = {
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