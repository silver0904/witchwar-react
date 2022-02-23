import React from "react";
import { CharacterInfo, GameConfig, GameInfo, PlayerInfo, Position, Vector, WebsocketMethod } from "../type/type";
import { tick } from "../utils/tickUtils";
import { Player } from "./Player";
// @ts-ignore
import Keyb from "keyb";
import { Menu } from "./Menu";
import { calculateDirection, calculatePosition, calculateVectorWith2Position, calculateVelocity, convertRenderPositionToPosition, equals, isZero } from "../utils/physicUtils";
import { Stage } from "./Stage";
import Config from "../config.json";
import { Mouse } from "../utils/Mouse";

type GameState ={
    currentClientId: string | undefined
    gameInfo: GameInfo | undefined
    gameConfig: GameConfig
}

type GameProps = {
    websocket: WebSocket
}

export class Game extends React.Component<GameProps, GameState> {
    mouse: Mouse;
    constructor(props: any){
        super(props);
        this.mouse = new Mouse(Config.STAGE.WIDTH);
        this.state ={
           currentClientId: undefined,
           gameInfo: undefined,
           gameConfig: { userColors: [] }
        }
        
        this.props.websocket.onmessage = message =>{
            // message.data
            const response = JSON.parse(message.data);
            if (response.method === WebsocketMethod.CONNECT){
                this.setState({
                    ...this.state,
                    currentClientId: response.clientId,
                    gameConfig: response.config
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

    updatePlayer = (frameTime: number) => {
        if (!this.state.currentClientId || !this.state.gameInfo){
            return;
        }
        let playerInfo = this.state.gameInfo.players[this.state.currentClientId] ;
        let character = playerInfo.character;
        if (this.checkInMist(character.position)){
            character.health -= frameTime * 0.01
        }

        character = this.updatePlayerPosition(character, frameTime)

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
        // update server playerInfo
        this.updatePlayerToServer(playerInfo);
    }
    
    updatePlayerPosition = (character: CharacterInfo, frameTime: number) : CharacterInfo =>{
        //console.log(this.state.playerPosition)
        let newCharacterInfo = character;
        let walkingDirection : Vector = new Vector(0,0);
        let mouseDirection : Vector = new Vector(0,0);
        if (this.mouse.isPressed){
            const mousePosition = convertRenderPositionToPosition(this.mouse.getRenderPosition());
            mouseDirection = calculateVectorWith2Position(character.position, mousePosition)
            newCharacterInfo.status ="CHARGING"
        }
        else{
            newCharacterInfo.status = undefined
        }
        newCharacterInfo.aimDirection = mouseDirection

        
        if(Keyb.isDown("S")) {
            walkingDirection.y -= 1;
        }
        if(Keyb.isDown("W")){
            walkingDirection.y += 1;
        }
        if(Keyb.isDown("A")) {
            walkingDirection.x -= 1;
        }
        if(Keyb.isDown("D")) {
            walkingDirection.x += 1
        }

        const newDirection = calculateDirection(walkingDirection, character.direction);
        const newVelocity = calculateVelocity(walkingDirection, 0.3, character.impulse);
        const newPosition = calculatePosition(character.position, newVelocity, frameTime);
        if ( equals(newDirection, character.direction) && isZero(mouseDirection) &&
            isZero(newVelocity) && equals(newPosition, character.position)){
            return newCharacterInfo;
        }
        
        newCharacterInfo.direction = newDirection;
        //character.impulse = newVelocity;
        newCharacterInfo.position = newPosition
        return newCharacterInfo;

    };

    checkInMist = (playerPosition: Position) =>{
        // circle only
        return (playerPosition.x * playerPosition.x + playerPosition.y * playerPosition.y) >
            (Config.ARENA.SIZE)/2 * (Config.ARENA.SIZE)/2
    }

    createGame = (playerName: string, colorId: string) =>{

        const payLoad = {
            method: WebsocketMethod.CREATE,
            clientId: this.state.currentClientId,
            colorId,
            playerName
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }

    joinGame = (playerName: string, gameId : string, colorId: string) =>{
        const payLoad = {
            method: WebsocketMethod.JOIN,
            clientId: this.state.currentClientId,
            gameId,
            colorId,
            playerName
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }

    updatePlayerToServer = (playerInfo: PlayerInfo) =>{
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
            this.updatePlayer(frameTime)
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
                    <Stage boundaryHeight={Config.STAGE.HEIGHT} 
                        boundaryWidth={Config.STAGE.WIDTH}
                        arenaSize={Config.ARENA.SIZE}
                        arenaType={Config.ARENA.TYPE}
                        mouseDown={(event) => this.mouse.mousePressed(event as any)}
                        mouseUp={(event) => this.mouse.mouseReleased(event as any)}
                        mouseMove={(event) => this.mouse.mouseMoved(event as any)}
                        >
                    { playerList.map(player =>
                        <Player playerInfo={player} 
                            key={player.clientId}
                        ></Player>
                    ) }
                    </Stage>
                    <h1>{this.state.gameInfo.gameId}</h1>
                </div>
            )
        }
        return(
        <div>
            <Menu onJoinGame={this.joinGame} onCreateGame={this.createGame} colors={this.state.gameConfig.userColors}/>
        </div>
        
        )
    }
}
