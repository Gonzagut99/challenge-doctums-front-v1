import { TestConnectedPlayer } from "~/types/connectedPlayer";
import { charactersData } from "./characters";

export const testConnectedPlayers: TestConnectedPlayer[] = [
    {
        name: "Rachel D.",
        id: "123e4567-e89b-12d3-a456-426614174001",
        avatarId: "1",
        characterData: charactersData[0],
        isHost: true
    },
    {
        name: "Marisol S.",
        id: "123e4567-e89b-12d3-a456-426614174003",
        avatarId: "2",
        characterData: charactersData[1],
        isHost: false
    },
    {
        name: "Gonzalo G.",
        id: "123e4567-e89b-12d3-a456-426614174000",
        avatarId: "2",
        characterData: charactersData[2],
        isHost: false
    },
    {
        name: "Esclender L.",
        id: "123e4567-e89b-12d3-a456-426614174002",
        avatarId: "2",
        characterData: charactersData[3],
        isHost: false
    }
]