import { Direction } from "./Direction";
import { Position } from "./Position";
import { Vector } from "./Vector"

export interface Projectile{
    projectileId: string | undefined;
    typeId: string;
    emitterClientId: string;
    speed: Vector;
    direction: Direction;
    position: Position;
    //power
}