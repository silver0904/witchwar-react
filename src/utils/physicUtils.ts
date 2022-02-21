import Config from "../config.json";
import { Position, RenderPosition, Vector } from "../type/type";


export const calculateDirection = (controlledDirection: Vector, currentDirection: Vector): Vector =>{
    if (controlledDirection.x === 0 && controlledDirection.y === 0) return currentDirection;
    const directionVar = { 
        x: (controlledDirection.x - currentDirection.x)/15 ,
        y: (controlledDirection.y - currentDirection.y)/15 
    }
    return new Vector( currentDirection.x + directionVar.x,currentDirection.y + directionVar.y)
    
    
}

export const calculateVelocity = (controlledDirection: Vector, movementSpeedFactor: number, impulse: Vector): Vector =>{
    const factor = controlledDirection.x && controlledDirection.y ? movementSpeedFactor* 0.707 : movementSpeedFactor;
    let controlledVelocity = times(controlledDirection,factor);
    return new Vector(controlledVelocity.x - impulse.x,controlledVelocity.y - impulse.y)
}

export const calculatePosition = (position: Position, velocity: Vector, time: number): Position =>{
    let pos =  new Position(position.x + velocity.x * time, position.y + velocity.y * time)
    if (pos.x > Config.ARENA.WIDTH/2 ) pos.x = Config.ARENA.WIDTH/2
    if (pos.x < -Config.ARENA.WIDTH/2 ) pos.x = -Config.ARENA.WIDTH/2
    if (pos.y > Config.ARENA.HEIGHT/2 ) pos.y = Config.ARENA.HEIGHT/2
    if (pos.y < -Config.ARENA.HEIGHT/2 ) pos.y = -Config.ARENA.HEIGHT/2
    return pos;
}

export const convertVectorToDegree = (vector: Vector) : number =>{
    var angle = Math.atan2(vector.x, vector.y);   //radians
    var degrees = 180*angle/Math.PI;  //degrees
    return (360+Math.round(degrees))%360;
}

export const convertPositionToRenderPosition= (position: Position) : RenderPosition =>{
    return {
        top: Math.floor(Config.ARENA.HEIGHT/2 - position.y),
        right: Math.floor(Config.ARENA.WIDTH/2 - position.x)
    }
}

export const plus = (a: Vector, b:Vector) : Vector => {
    return new Vector(a.x + b.x, a.y + b.y);
}


export const minus = (a: Vector, b:Vector) : Vector => {
    return new Vector(a.x - b.x, a.y - b.y);
}

export const times = (a: Vector, factor: number) : Vector => {
    return new Vector(a.x * factor, a.y * factor);
}

export const equals = (a: Vector| Position, b: Vector| Position) : boolean =>{
    return a.x === b.x && a.y === b.y
}

export const isZero = (a: Vector) : boolean => {
    return a.x === 0 && a.y === 0
}