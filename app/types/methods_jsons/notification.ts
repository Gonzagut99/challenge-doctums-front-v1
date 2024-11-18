export type PlayersActionNotification = {
  method: string;
  status: string;
  message: string;
  is_new_turn_stage?:boolean;
  has_player_rolled_dices?:boolean
}