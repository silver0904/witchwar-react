import Config from "../config.json";
import { RenderPosition, SquareDimenion } from "../type/type";
import { Vector } from "../classes/Vector";
import { Position } from "../classes/Position";
import { Direction } from "../classes/Direction";


export const calculateMoveDirection = (controlledDirection: Direction, currentDirection: Direction): Direction =>{
    // if (currentDirection.degrees == undefined || controlledDirection.degrees == undefined) return currentDirection;
    // const degree = 5;
    // let degreeVar = controlledDirection.degrees - currentDirection.degrees ;
    // if (degreeVar > 180) degreeVar = 180 - degreeVar
    // if (degreeVar > -degree && degreeVar <  degree ){
    //     return controlledDirection
    // }
    // else if (degreeVar > degree){
    //     return {degrees: currentDirection.degrees + degree};
    // }
    // else {
    //     return {degrees: currentDirection.degrees - degree};
    // }
    return controlledDirection.degrees!== undefined ? controlledDirection : currentDirection
}

export const convertDirectionToVector = (direction: Direction, magnitude: number) : Vector =>{
    const degrees = direction.degrees;
    if (degrees == undefined) return new Vector(0,0);
    return new Vector( magnitude* Math.sin(degrees/180 * Math.PI), magnitude* Math.cos(degrees/180 * Math.PI))
}

export const convertVectorToDirection = (vector: Vector): Direction => {
    const degrees = isZero(vector) ? undefined: convertVectorToDegree(vector)
    return {degrees}
}

export const calculateVelocity = (controlledDirection: Direction, movementSpeedFactor: number, impulse: Vector| undefined): Vector =>{
    let controlledVelocity = convertDirectionToVector(controlledDirection , movementSpeedFactor);
    if (impulse == undefined) return controlledVelocity
    return new Vector(controlledVelocity.x - impulse.x,controlledVelocity.y - impulse.y)
}

export const calculatePosition = (position: Position, velocity: Vector, time: number): Position =>{
    let pos =  new Position(position.x + velocity.x * time, position.y + velocity.y * time)
    if (pos.x > Config.STAGE.WIDTH/2 ) pos.x = Config.STAGE.WIDTH/2
    if (pos.x < -Config.STAGE.WIDTH/2 ) pos.x = -Config.STAGE.WIDTH/2
    if (pos.y > Config.STAGE.HEIGHT/2 ) pos.y = Config.STAGE.HEIGHT/2
    if (pos.y < -Config.STAGE.HEIGHT/2 ) pos.y = -Config.STAGE.HEIGHT/2
    return pos;
}

export const convertVectorToDegree = (vector: Vector) : number =>{
    var angle = Math.atan2(vector.x, vector.y);   //radians
    var degrees = 180*angle/Math.PI;  //degrees
    return (360+Math.round(degrees))%360;
}

export const convertPositionToRenderPosition= (position: Position) : RenderPosition =>{
    return {
        top: Math.floor(Config.STAGE.HEIGHT/2 - position.y),
        right: Math.floor(Config.STAGE.WIDTH/2 - position.x)
    }
}

export const convertRenderPositionToPosition = (renderPosition: RenderPosition) : Position =>{
    return {
        x: Math.floor(Config.STAGE.WIDTH/2 - renderPosition.right),
        y: Math.floor(Config.STAGE.HEIGHT/2 - renderPosition.top),
    }
}

export const calculateDirectionWith2Position = (sourcePosition: Position, targetPosition: Position): Direction =>{
    return convertVectorToDirection
    (new Vector(targetPosition.x-sourcePosition.x, targetPosition.y-sourcePosition.y));
}

export const checkCollisionBetweenSquares = (xPos: Position, xDim: SquareDimenion, yPos: Position, yDim: SquareDimenion) : boolean =>{
    let xRenderPos = convertPositionToRenderPosition(xPos);
    let yRenderPos = convertPositionToRenderPosition(yPos);
    // return (
    //     (xHitbox.top > yHitbox.bottom && xHitbox.top < yHitbox.top && xHitbox.right > yHitbox.left && xHitbox.left < yHitbox.left) ||
    //     (xHitbox.top > yHitbox.bottom && xHitbox.top < yHitbox.top && xHitbox.left < yHitbox.right && xHitbox.right > yHitbox.right) ||
    //     (xHitbox.bottom < yHitbox.top && xHitbox.bottom > yHitbox.bottom && xHitbox.left < yHitbox.right && xHitbox.right > yHitbox.right) ||
    //     (xHitbox.bottom < yHitbox.top && xHitbox.bottom > yHitbox.bottom && xHitbox.right > yHitbox.left && xHitbox.left < yHitbox.left) 
    // )
    return !(
        ((xRenderPos.top + xDim.height/2)< yRenderPos.top) ||
        (xRenderPos.top > (yRenderPos.top + yDim.height/2)) ||
        ((xRenderPos.right + xDim.width/2) < yRenderPos.right) ||
        (xRenderPos.right >(yRenderPos.right + yDim.width/2))
    );

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

export const isZero = (a: Vector| Position) : boolean => {
    return a.x === 0 && a.y === 0
}