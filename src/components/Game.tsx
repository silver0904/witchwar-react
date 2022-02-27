import React from "react";
import { CharacterInfo, CharacterStatus, GameConfig, GameInfo, PlayerInfo, WebsocketEntityType, WebsocketMethod } from "../type/type";
import { Vector } from "../classes/Vector";
import { Position } from "../classes/Position";
import { tick } from "../utils/tickUtils";
import { Player } from "./Player";
// @ts-ignore
import Keyb from "keyb";
import { Menu } from "./Menu";
import { calculateMoveDirection, calculatePosition, calculateDirectionWith2Position, calculateVelocity, convertRenderPositionToPosition, equals, isZero, convertVectorToDirection, checkCollisionBetweenSquares } from "../utils/physicUtils";
import { Stage } from "./Stage";
import Config from "../config.json";
import { Mouse } from "../classes/Mouse";
import { Projectile } from "../classes/Projectile";
import { Direction } from "../classes/Direction";
import { Fireball } from "./Fireball";

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
                return;
            }
            switch (response.entity){
                case (WebsocketEntityType.GAME):
                    this.setState({
                        ...this.state,
                        gameInfo: response.game as GameInfo
                    })
                    break;
                case (WebsocketEntityType.PLAYER):
                    if (!this.state.gameInfo) break;
                    let players = this.state.gameInfo.players;
                    players[response.player.clientId] = response.player;
                    this.setState({
                        ...this.state,
                        gameInfo: {
                            ...this.state.gameInfo,
                            players
                        }
                    });
                    break;
                case (WebsocketEntityType.PROJECTILE):
                    if (!this.state.gameInfo) break;
                    let projectiles = this.state.gameInfo.projectiles;
                    const index = projectiles.findIndex(p => p.projectileId == response.projectile.projectileId);

                    if (response.method == WebsocketMethod.DELETE ) {
                        if (index == -1) {
                            break;
                        }
                        projectiles.splice(index, 1)
                    }
                    if (response.method == WebsocketMethod.UPDATE){
                        if (index == -1) {
                            projectiles.push(response.projectile);
                        }
                        else{
                            projectiles[index] = response.projectile
                        }
                    }
                    this.setState({
                        ...this.state,
                        gameInfo: {
                            ...this.state.gameInfo,
                            projectiles
                        }
                    })
                    break;

            }
        }
    }

    checkObjectCollisions = (frameTime : number) =>{
        if (!this.state.currentClientId || !this.state.gameInfo){
            return;
        }
        let playerInfo = this.state.gameInfo.players[this.state.currentClientId] ;
        let character = playerInfo.character;
        let updated = false;
        if (this.checkInMist(character.position)){
            character.health -= frameTime * 0.01
            updated = true;
        }
        let projectiles = this.state.gameInfo.projectiles;
        projectiles.forEach((projectile, index, arr) =>{
            if (projectile.emitterClientId !== this.state.currentClientId && 
                checkCollisionBetweenSquares(character.position, {width:26,height:26}, projectile.position, {width:26, height:26})){
                // hit by fireball
                console.log("hit!")
                // delete projectile
                arr.splice(index, 1);
                playerInfo.character = character;
                this.updateProjectileToServer(WebsocketMethod.DELETE, projectile);
            }
        })
        if (updated){
            this.updatePlayerToServer(playerInfo);
        }
        let newPlayers = this.state.gameInfo.players;
        newPlayers[this.state.currentClientId] = playerInfo;
        this.setState({
            ...this.state,
            gameInfo:{
                ...this.state.gameInfo,
                projectiles: projectiles,
                players: newPlayers
            }
        })


    }

    updateProjectiles = (frameTime: number) =>{
        if (!this.state.currentClientId || !this.state.gameInfo){
            return;
        }
        let projectiles = this.state.gameInfo.projectiles;
        if (!projectiles){
            return;
        }
        // performance optimize: no need to update projectile in server
        projectiles.forEach((projectile, index, arr) =>{
            if (projectile.emitterClientId === this.state.currentClientId && 
                (Math.abs(projectile.position.x) >= Config.STAGE.WIDTH/2 ||
                Math.abs(projectile.position.y) >= Config.STAGE.HEIGHT/2 )){
                arr.splice(index, 1);
                this.updateProjectileToServer(WebsocketMethod.DELETE, projectile);
            }
            else{
                const newVelocity = calculateVelocity(projectile.direction, 0.3, undefined);
                const newPosition = calculatePosition(projectile.position, newVelocity, frameTime);
                projectile.position = newPosition;
                arr[index] = projectile
                this.updateProjectileToServer(WebsocketMethod.UPDATE, projectile);
            }
        })
        this.setState({
            ...this.state,
            gameInfo:{
                ...this.state.gameInfo,
                projectiles: projectiles
            }
        })
        
    }

    updatePlayer = (frameTime: number) => {
        if (!this.state.currentClientId || !this.state.gameInfo){
            return;
        }
        let playerInfo = this.state.gameInfo.players[this.state.currentClientId] ;
        let character = playerInfo.character;

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
        let newCharacterInfo = character;
        let walkingVector : Vector = new Vector(0,0);
        let mouseDirection : Direction = {degrees: undefined};
        if (this.mouse.isPressed){
            const mousePosition = convertRenderPositionToPosition(this.mouse.getRenderPosition());
            mouseDirection = calculateDirectionWith2Position(character.position, mousePosition)
            newCharacterInfo.status = CharacterStatus.CHARGING
        }
        else{
            if (character.status == CharacterStatus.CHARGING ){
                // release fireball
                this.emitProjectile(character, "1")
            }
            newCharacterInfo.status = CharacterStatus.IDLE
        }
        newCharacterInfo.aimDirection = mouseDirection

        
        if(Keyb.isDown("S")) {
            walkingVector.y -= 1;
        }
        if(Keyb.isDown("W")){
            walkingVector.y += 1;
        }
        if(Keyb.isDown("A")) {
            walkingVector.x -= 1;
        }
        if(Keyb.isDown("D")) {
            walkingVector.x += 1
        }
        const walkingDirection = convertVectorToDirection(walkingVector)
        const newDirection = calculateMoveDirection(walkingDirection, character.direction);
        const newVelocity = calculateVelocity(walkingDirection, 0.3, character.impulse);
        const newPosition = calculatePosition(character.position, newVelocity, frameTime);
        if ( newDirection.degrees == character.direction.degrees && mouseDirection.degrees == undefined &&
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

    emitProjectile = (character: CharacterInfo, projectileTypeId: string) => {
        if (!character.aimDirection || !this.state.currentClientId) return;
        const projectile: Projectile = {
            projectileId:undefined,
            typeId: projectileTypeId,
            emitterClientId: this.state.currentClientId,
            speed: {x:100, y:100},
            direction: character.aimDirection,
            position: character.position
        }
        this.updateProjectileToServer(WebsocketMethod.UPDATE, projectile);
    }

    updateProjectileToServer = (operation: WebsocketMethod, projectile: Projectile) =>{
        if (!this.state.gameInfo || !this.state.currentClientId) return;
        const payLoad = {
            method: operation,
            entity: WebsocketEntityType.PROJECTILE,
            clientId: this.state.currentClientId,
            gameId: this.state.gameInfo.gameId,
            projectile: projectile
        }
        this.props.websocket.send(JSON.stringify(payLoad));
    }

    createGame = (playerName: string, colorId: string) =>{

        const payLoad = {
            method: WebsocketMethod.CREATE,
            entity: WebsocketEntityType.GAME,
            clientId: this.state.currentClientId,
            colorId,
            playerName
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }

    joinGame = (playerName: string, gameId : string, colorId: string) =>{
        const payLoad = {
            method: WebsocketMethod.JOIN,
            entity: WebsocketEntityType.GAME,
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
            entity: WebsocketEntityType.PLAYER,
            gameId: this.state.gameInfo?.gameId,
            clientId: this.state.currentClientId,
            player: playerInfo
        }
        this.props.websocket.send(JSON.stringify(payLoad))
    }
    

    componentDidMount = ()=>{
        tick((frameTime:number)=>{
            this.checkObjectCollisions(frameTime);
            this.updateProjectiles(frameTime);
            this.updatePlayer(frameTime);
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
                    {
                        this.state.gameInfo.projectiles.map( projectile =>
                            <Fireball projectileInfo={projectile}/>
                        )
                    }
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
