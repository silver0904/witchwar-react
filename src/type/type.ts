export class Position {
    x:number; 
    y:number;
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    // public isZero = () : boolean => {
    //     return this.x === 0 && this.y === 0
    // }
}

export class Vector extends Position{

    constructor(x:number, y:number){
        super(x,y);
    }

    // public plus = (arg: Vector) : Vector => {
    //     this.x += arg.x;
    //     this.y += arg.y;
    //     return new Vector(this.x, this.y);
    // }
    // public times = (arg: number): Vector => {
    //     this.x *= arg;
    //     this.y *= arg;
    //     return new Vector(this.x, this.y);
    // }
    
}

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
    direction: Vector;
    aimDirection: Vector| undefined;
    impulse: Vector;
    health: number;
    status: string | undefined;
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
    players: PlayerMap
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
    UPDATE = "UPDATE"
}