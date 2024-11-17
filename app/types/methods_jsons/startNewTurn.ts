/* eslint-disable @typescript-eslint/no-explicit-any */
// {
//   "method": "new_turn_start",
//   "status": "success",
//   "message": "¡Avanzaste en el tablero!",
//   "current_turn": "5c05637a-2fa9-495d-a003-831a9b22256f",
//   "thrown_dices": [
//       5,
//       5,
//       1,
//       1,
//       2
//   ],
//   "days_advanced": 14,
//   "time_manager": {
//       "current_day": 14,
//       "current_day_in_month": 15,
//       "current_month": 1,
//       "is_weekend": true,
//       "is_first_turn_in_month": true,
//       "is_journey_finished": false,
//       "is_game_over": false
//   },
//   "player": {
//       "id": "5c05637a-2fa9-495d-a003-831a9b22256f",
//       "products": [
//           {
//               "product_id": "10",
//               "is_enabled": false,
//               "purchased_requirements": []
//           },
//           {
//               "product_id": "13",
//               "is_enabled": false,
//               "purchased_requirements": []
//           },
//           {
//               "product_id": "19",
//               "is_enabled": false,
//               "purchased_requirements": [
//                   "13"
//               ]
//           }
//       ],
//       "projects": [],
//       "resources": []
//   }
// }

// export type StartNewTurn = {
//   method: string;
//   status: string;
//   message: string;
//   current_turn: string;
//   thrown_dices: number[];
//   days_advanced: number;
//   time_manager: TimeManager;
//   playerM: PlayerInitModifiers;
// } | {
//   method: string;
//   status: string;
//   message: string;
//   current_turn: string;
// }
export type StartNewTurn = {
  method: string;
  status: string;
  message: string;
  current_turn: string;
  thrown_dices: number[];
  days_advanced: number;
  time_manager: TimeManager;
  playerM: PlayerInitModifiers;
}

export type TimeManager = {
  current_day: number;
  current_day_in_month: number;
  current_month: number;
  is_weekend: boolean;
  is_first_turn_in_month: boolean;
  is_journey_finished: boolean;
  is_game_over: boolean;
}


export type PlayerInitModifiers = {
  id: string;
  products: [{
    product_id: number;
    is_enabled: boolean;
    purchased_requirements: string[];
  }];
  projects:[{
      project_id: number;
      remaining_time: number;
  }];
  resources:[{
      resource_id: number;
      remaining_time: number;
  }];
}

// type PlayerNewTurnResponse = {
//   method: string;
//   status: string;
//   message: string;
//   current_turn: string;
//   thrown_dices: number[];
//   days_advance: number;
//   time_manager:{
//       current_day: number;
//       current_day_in_month: number;
//       current_month: number;
//       is_weekend:boolean;
//       is_first_turn_in_month:boolean;
//       is_journey_finished:boolean;
//       is_game_over:boolean;
//   };
//   player:{
//       id: string;
//       products: [{
//           product_id: number;
//           is_enabled: boolean;
//           purchased_requirements: string[];
//       }];
//       projects:[{
//           project_id: number;
//           remaining_time: number;
//       }];
//       resources:[{
//           resource_id: number;
//           remaining_time: number;
//       }];
//   }
// } | {
//   method: string;
//   status: string;
//   message: string;
//   current_turn: string;
// }
