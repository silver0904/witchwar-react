export type PlayerPosition ={
    x:number;
    y:number;
}

export type PlayerInfo = {
    clientId: string;
    position: PlayerPosition;
    name: string;
}

export type PlayerMap = {
    [key: string] : PlayerInfo
}

export type GameInfo = {
    gameId: string,
    players: PlayerMap
}

export enum WebsocketMethod {
    CONNECT = "CONNECT",
    CREATE = "CREATE",
    JOIN = "JOIN",
    UPDATE = "UPDATE"
}