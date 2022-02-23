import { stringify } from "querystring";
import { FC, useState } from "react";
import { UserColor } from "../type/type";

type MenuProps = {
    onJoinGame: (playerName: string, gameId: string, colorId: string) => void;
    onCreateGame: (playerName: string, colorId: string) => void;
    colors: UserColor[];
}

type MenuState = {
    gameId: string | undefined;
    playerName: string | undefined;
    colorId: string;
}

export const Menu : FC<MenuProps> = (props) => {
    const [menuState, setMenuState] = useState<MenuState>({
        gameId: undefined,
        playerName: "",
        colorId: "1"
    });

    const joinGame = ()=>{
        if (menuState.gameId && menuState.playerName){
            props.onJoinGame(menuState.playerName, menuState.gameId, menuState.colorId);
        }
    }
    const createGame = () =>{
        if (menuState.playerName){
            props.onCreateGame(menuState.playerName, menuState.colorId);
        }
    }
    return (
        <div>
            <div>
            <label>Name:</label>
            <input onChange={(e)=> setMenuState({...menuState, playerName: e.target.value})} value={menuState.playerName}/>
            <label>Game Id:</label>
            <input onChange={(e)=> setMenuState({...menuState, gameId: e.target.value})} value={menuState.gameId}/>
            <label>Color:</label>
            <select onChange={(e)=> setMenuState({...menuState, colorId: e.target.value})}>
                {props.colors && props.colors.map(color=>{
                    return(<option style={{backgroundColor: color.code}} 
                        value={color.id}
                        selected={menuState.colorId == color.id}>{color.name}
                        </option>
                    )
                })
                }
            </select>
            </div>
            <button onClick={() => joinGame()}>Join game</button>
            <button onClick={() => createGame()}>Start game</button>
        </div>
    )
}