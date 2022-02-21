import {createContext} from "react";
import { GameConfig } from "../type/type";



export type GameContextType ={
    gameConfig: GameConfig,
    setGameConfig: (gameConfig: GameConfig) => void
}

const DEFAULT_CONFIG = {userColors: []}

export const GameContext = createContext<GameContextType>({
    gameConfig: DEFAULT_CONFIG,
    setGameConfig: (gameConfig: GameConfig) => {}
});
