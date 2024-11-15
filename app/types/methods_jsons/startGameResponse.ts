// {
//   "method": "start_game",
//   "status": "success",
//   "message": "¡El juego ha comenzado!",
//   "current_turn": "5872f2eb-5346-4fa5-a3e7-3b8a4930791c",
//   "legacy_products": [
//       "4",
//       "9",
//       "15"
//   ],
//   "player": {
//       "id": "5872f2eb-5346-4fa5-a3e7-3b8a4930791c",
//       "name": "Alda",
//       "avatarId": 1,
//       "budget": 100000,
//       "score": 0,
//       "efficiencies": {
//           "1": 0,
//           "2": 0,
//           "3": 5,
//           "4": 0,
//           "5": 10,
//           "6": 0,
//           "7": 0,
//           "8": 0,
//           "9": 0,
//           "10": 0,
//           "11": 0,
//           "12": 5
//       }
//   },
//   "turns_order": [
//       {
//           "playerId": "5872f2eb-5346-4fa5-a3e7-3b8a4930791c",
//           "name": "Alda",
//           "dices": [
//               5,
//               3
//           ],
//           "total": 8
//       },
//       {
//           "playerId": "a27d1a73-83a2-46ac-8399-185cdcda6d77",
//           "name": "Javon",
//           "dices": [
//               2,
//               4
//           ],
//           "total": 6
//       }
//   ]
// }

export interface GameStartMessage {
  method: string;
  status: string;
  message: string;
  current_turn: string;
  legacy_products: string[];
  player: Player;
  turns_order: TurnOrder[];
}

export interface Player {
  id: string;
  name: string;
  avatarId: string;
  budget: number;
  score: number;
  efficiencies: Efficiencies;
}

interface Efficiencies {
  [key: string]: number;
}

export interface TurnOrder {
  playerId: string;
  name: string;
  avatarId: string;
  dices: number[];
  total: number;
}