import React, {FC, useState} from "react";
import { GameConfig } from "../type/type";
import { GameContext } from "./GameContext";


const GameContextProvider: FC<{
    gameConfig: GameConfig
}> = ({gameConfig, children}) => {

    const [currentGameConfig, setCurrentGameConfig] = useState(gameConfig);
    const setGameConfig = (gameConfig: GameConfig) =>{
        setCurrentGameConfig(gameConfig);
    }
    return (
        <GameContext.Provider value={{gameConfig:currentGameConfig ,setGameConfig}}>
            {children}
        </GameContext.Provider>
    )
};

export default GameContextProvider
