import { CreateCanvasPlayer } from "../gameCanvasState"

export type UpdatedPlayersPositions = {
    method: string;
    status: string;
    message: string;
    players_position: CreateCanvasPlayer[];
}