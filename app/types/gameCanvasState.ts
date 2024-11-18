export type PlayerCanvasState = {
    playerId: string
    avatarId: number,
    currentDay: number,
    previousPosition: number,
    currentPosition: number,
};

export type CreateCanvasPlayer = {
    playerId: string,
    avatarId: number,
    currentDay: number,
};