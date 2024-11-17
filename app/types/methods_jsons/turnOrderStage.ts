// {
//   method: 'turn_order_stage',
//   status: 'success',
//   current_turn: '6eefa7f2-7aa9-41dd-89b5-34d5e281cf59',
//   first_player_turn: '6eefa7f2-7aa9-41dd-89b5-34d5e281cf59',
//   message: 'Juan ha sacado un 3',
//   this_player_turn_results: {
//     playerId: '09ded19c-887c-41b1-ab6d-ecee0d179c53',
//     name: 'Juan',
//     avatarId: 3,
//     dices: [ 1, 2 ],
//     total: 3,
//     has_player_rolled_dices: true
//   },
//   turns_order: [
//     {
//       playerId: '09ded19c-887c-41b1-ab6d-ecee0d179c53',
//       name: 'Juan',
//       avatarId: 3,
//       dices: [Array],
//       total: 3,
//       has_player_rolled_dices: true
//     }
//   ],
//   is_turn_order_stage_over: false
//       total: 3,
//       has_player_rolled_dices: true
//     }
//   ],
//   is_turn_order_stage_over: false
// }

// CREATE THE INTERFACES FROM THE JSON ABOVE
export type TurnOrderStage = {
  method: string;
  status: string;
  current_turn: string;
  first_player_turn: string;
  message: string;
  this_player_turn_results: ThisPlayerTurnResults;
  turns_order: TurnPlayerOrder[];
  is_turn_order_stage_over: boolean;
}

export type ThisPlayerTurnResults = {
  playerId: string;
  name: string;
  avatarId: string;
  dices: number[];
  total: number;
  has_player_rolled_dices: boolean;
}

export type TurnPlayerOrder = {
  playerId: string;
  name: string;
  avatarId: string;
  dices: number[];
  total: number;
  has_player_rolled_dices: boolean;
}

