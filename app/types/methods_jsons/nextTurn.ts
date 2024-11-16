export type NextTurnResponse = {
    method: string;
    status: string;
    message: string;
    current_turn: string;
    player: NextTurnPlayerState;
}

export type NextTurnPlayerState = {
    is_first_turn: boolean;
    current_month: number;
}

// export type NextTurnResponse = {
//     method: string;
//     status: string;
//     message: string;
//     current_turn: string;
//     player: {
//         is_first_turn: boolean;
//         current_month: number;
//     }
// }
