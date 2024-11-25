export type NextTurnResponse = {
    method: string;
    status: string;
    message: string;
    current_turn: string;
    player: NextTurnPlayerState;
    turn_order: NextTurnPlayerOrderStats[];
}

export type NextTurnPlayerState = {
    playerId: string;
    avatarId: string;
    name: string
    score: number;
    budget: number;
    date:string;
}

export type NextTurnPlayerOrderStats = {
    playerId: string;
    avatarId: string;
    name: string
    score: number;
    budget: number;
    date:string;
}

// export type NextTurnResponse = {
//     method: string;
//     status: string;
//     message: string;
//     current_turn: string;
//     player: {
//         is_first_turn: boolean;
//         current_month: number;
//     },
//     turn_order: {
//         player: string;
//         order: number;
//     }[];
// }