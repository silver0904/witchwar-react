import React, { useContext } from "react";
import { GameConfig, GameInfo, PlayerInfo, Vector, WebsocketMethod } from "../type/type";
import { tick } from "../utils/tickUtils";
import { Box } from "./Player";
// @ts-ignore
import Keyb from "keyb";
import { Menu } from "./Menu";
import { calculateDirection, calculatePosition, calculateVelocity, equals, isZero } from "../utils/physicUtils";

type GameState ={
    currentClientId: string | undefined
    gameInfo: GameInfo | undefined
}

type GameProps = {
    websocket: WebSocket
}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: any){
        super(props);
        this.state ={
           currentClientId: undefined,
           gameInfo: undefined,
        }
        
        this.props.websocket.onmessage = message =>{
            // message.data
            const response = JSON.parse(message.data);
            if (response.method === WebsocketMethod.CONNECT){
                this.setState({
                    ...this.state,
                    currentClientId: response.clientId,
                })
            }

            if (response.method === WebsocketMethod.CREATE){
                this.setState({
                    ...this.state,
                    gameInfo: response.game as GameInfo
                })
            }

            if (response.method === WebsocketMethod.JOIN){
                this.setState({
                    ...this.state,
                    gameInfo: response.game as GameInfo
                })
            }
        }
    }
    
    updatePlayerPosition = (frameTime: number) =>{
        //console.log(this.state.playerPosition)

        if (!this.state.currentClientId || !this.state.gameInfo){
            return;
        }
        let playerInfo = this.state.gameInfo.players[this.state.currentClientId] ;
        let character = playerInfo.character;

        let controlledDirection : Vector = new Vector(0,0);

        if(Keyb.isDown("S")) {
            controlledDirection.y -= 1;
        }
        if(Keyb.isDown("W")){
            controlledDirection.y += 1;
        }
        if(Keyb.isDown("A")) {
            controlledDirection.x -= 1;
        }
        if(Keyb.isDown("D")) {
            controlledDirection.x += 1
        }

        const newDirection = calculateDirection(controlledDirection, character.direction);
        const newVelocity = calculateVelocity(controlledDirection, 0.3, character.impulse);
        const newPosition = calculatePosition(character.position, newVelocity, frameTime);
        if ( equals(newDirection, character.direction) && 
            isZero(newVelocity) && equals(newPosition, character.position)){
            return;
        }
        character.direction = newDirection;
        //character.impulse = newVelocity;
        character.position = newPosition

        playerInfo.character = character;
        let newPlayers = this.state.gameInfo.players;
        newPlayers[this.state.currentClientId] = playerInfo;
        this.setState({
            ...this.state,
            gameInfo: {
                ...this.state.gameInfo,
                players: newPlayers
            }
        });
        // update server location
        this.updatePlayer(playerInfo);
    };

    createGame = (playerName: string) =>{

        const payLoad = {
            method: WebsocketMethod.CREATE,
            clientId: this.state.currentClientId,
            playerName
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }

    joinGame = (playerName: string, gameId : string) =>{
        const payLoad = {
            method: WebsocketMethod.JOIN,
            clientId: this.state.currentClientId,
            gameId,
            playerName
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }

    updatePlayer = (playerInfo: PlayerInfo) =>{
        const payLoad = {
            method: WebsocketMethod.UPDATE,
            gameId: this.state.gameInfo?.gameId,
            clientId: this.state.currentClientId,
            player: playerInfo
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }
    

    componentDidMount = ()=>{
        tick((frameTime:number)=>{
            this.updatePlayerPosition(frameTime)
        })
        
    }


    render(): React.ReactNode {
        if (this.state.gameInfo){
            let playerList : PlayerInfo[]= []; 
            for (const [id, playerInfo] of Object.entries(this.state.gameInfo.players)){
                playerList.push(playerInfo);
            }
            return(
                <div>
                    <h1>{this.state.gameInfo.gameId}</h1>
                    { playerList.map(player =>
                        <Box playerInfo={player}></Box>
                    ) }
                </div>
            )
        }
        return(
        <div>
            <Menu onJoinGame={this.joinGame} onCreateGame={this.createGame}/>
        </div>
        
        )
    }
}
