import { Direction } from "../classes/Direction";
import { Position } from "../classes/Position";
import { Projectile } from "../classes/Projectile";
import { Vector } from "../classes/Vector";

export type RenderPosition = {
    top: number;
    right: number;
}

export type GeneralInfo = {
    name: string
    color: UserColor
}

export type CharacterInfo = {
    position: Position;
    direction: Direction;
    aimDirection: Direction| undefined;
    impulse: Vector;
    health: number;
    status: CharacterStatus;
}

export enum CharacterStatus {
    CHARGING = "CHARGING",
    IDLE = "IDLE"
}


export type PlayerInfo = {
    clientId: string;
    character: CharacterInfo;
    general: GeneralInfo
}

export type PlayerMap = {
    [key: string] : PlayerInfo
}

export type GameInfo = {
    gameId: string,
    players: PlayerMap,
    projectiles: Projectile[]
}

export type GameConfig = {
    userColors: UserColor[];
}

export type UserColor = {
    id: string;
    name: string;
    code: string;
}

export enum WebsocketMethod {
    CONNECT = "CONNECT",
    CREATE = "CREATE",
    JOIN = "JOIN",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export enum WebsocketEntityType {
    GAME = "GAME",
    PLAYER = "PLAYER",
    PROJECTILE = "PROJECTILE"
}