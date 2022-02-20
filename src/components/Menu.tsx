import { stringify } from "querystring";
import { FC, useState } from "react";

type MenuProps = {
    onJoinGame: (playerName: string, gameId: string) => void;
    onCreateGame: (playerName: string) => void
}

type MenuStatue = {
    gameId: string | undefined;
    playerName: string | undefined;
}

export const Menu : FC<MenuProps> = (props) => {
    const [menuState, setMenuState] = useState<MenuStatue>({
        gameId: undefined,
        playerName: ""
    });

    const joinGame = ()=>{
        if (menuState.gameId && menuState.playerName){
            props.onJoinGame(menuState.playerName, menuState.gameId);
        }
    }
    const createGame = () =>{
        if (menuState.playerName){
            props.onCreateGame(menuState.playerName);
        }
    }
    return (
        <div>
            
            <div>
            <label>Name:</label>
            <input onChange={(e)=> setMenuState({...menuState, playerName: e.target.value})} value={menuState.playerName}/>
            <label>Game Id:</label>
            <input onChange={(e)=> setMenuState({...menuState, gameId: e.target.value})} value={menuState.gameId}/>
            </div>
            <button onClick={() => joinGame()}>Join game</button>
            <button onClick={() => createGame()}>Start game</button>
        </div>
    )
}