import { CreateCanvasPlayer } from "../gameCanvasState"

export type UpdatedPlayersPositions = {
    method: string;
    status: string;
    players_position: CreateCanvasPlayer[];
}