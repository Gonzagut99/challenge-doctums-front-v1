export type TurnEventResults={
    method: string;
    status: string;
    message: string;
    current_turn: string;
    event:GameEventState;
    player:GameEventPlayerState 
    show_event:boolean;
    is_ready_to_set_next_turn:boolean;
} 
//| NotYourTurnResponse

export type GameEventState = {
    id: string;
    level: number;
    efficiency_chosen: string;
    pass_first_challenge: boolean;
    risk_challenge_dices: number[];
    risk_points: number;
    pass_second_challenge: boolean;
    //well also the punishments are sent to the rewards xd
    rewards: TurnEventConsequences
}

export type TurnEventConsequences = { 
    budget: number;
    score: number;
    obtained_efficiencies_points: number;
}

export type GameEventPlayerState = {
    score: number;
    number: number;
    effiencies: {[key:number]:number}; //the name in the back is like that
}

export type NotYourTurnResponse = {
    method: string;
    status: string;
    message: string;
    current_turn: string;
}

// export type TurnEventResults={
//     method: string;
//     status: string;
//     message: string;
//     event:{
//         id: number;
//         level: number;
//         efficiency_chosen: number;
//         pass_first_challenge: boolean;
//         risk_challenge_dices: number[];
//         risk_points: number;
//         pass_second_challenge: boolean;
//         //well also the punishments are sent to the rewards xd
//         rewards:{ 
//             budget: number;
//             score: number;
//             obtained_efficiencies_points: number;
//         }
//     };
//     player:{
//         score: number;
//         number: number;
//         effiencies: {[key:number]:number}; //the name in the back is like that
//     } | {
//         method: string;
//         status: string;
//         message: string;
//         current_turn: string;
//     }
// }