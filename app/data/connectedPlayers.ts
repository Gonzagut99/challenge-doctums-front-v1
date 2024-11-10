import { ConnectedPlayer } from "~/types/connectedPlayer";
import { charactersData } from "./characters";

export const connectedPlayers: ConnectedPlayer[] = [
    {
        name: "Rachel D.",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        characterData: charactersData[1]
    },
    {
        name: "Marisol S.",
        userId: "123e4567-e89b-12d3-a456-426614174003",
        characterData: charactersData[3]
    },
    {
        name: "Gonzalo G.",
        userId: "123e4567-e89b-12d3-a456-426614174000",
        characterData: charactersData[0]
    },
    {
        name: "Esclender L.",
        userId: "123e4567-e89b-12d3-a456-426614174002",
        characterData: charactersData[2]
    }
]