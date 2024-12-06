import { NextTurnPlayerOrderStats } from "./nextTurn";

export type PlayersActionNotification = {
  method: string;
  status: string;
  message: string;
  turn_order: NextTurnPlayerOrderStats[];
  current_turn?:string;
  is_new_turn_stage?:boolean;
  has_player_rolled_dices?:boolean
}

