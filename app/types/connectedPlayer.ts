import { CharacterData } from './character'
export interface ConnectedPlayer{
    name: string;
    id: string; //is UUID
    avatarId: string;
    isHost: boolean;
    // characterData: CharacterData;
}

export interface TestConnectedPlayer{
    name: string;
    id: string; //is UUID
    avatarId: string;
    isHost: boolean;
    characterData: CharacterData;
}