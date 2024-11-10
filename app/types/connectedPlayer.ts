import { CharacterData } from './character'
export interface ConnectedPlayer{
    name: string;
    userId: string; //is UUID
    characterData: CharacterData;
}