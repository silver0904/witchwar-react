import axios from "axios";
import React, {FC, useState} from "react";
import { GameConfig } from "../type/type";
import { GameContext } from "./GameContext";
import Config from "../config.json"

const GameContextProvider: FC<any> = ({children}) => {
    
    const gameConfig = await axios.get(Config.SERVER_URL + '/config').then(response => {return response.data });
    
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
