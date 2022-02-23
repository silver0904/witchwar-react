import { MouseEvent } from "react";
import { RenderPosition } from "../type/type";


export class Mouse {
    private cursorPosition: RenderPosition
    isPressed: boolean;
    stageWidth: number;

    constructor(stageWidth: number){
        this.cursorPosition = {right:0,top:0}
        this.isPressed = false;
        this.stageWidth = stageWidth;
    }

    mousePressed = (event: MouseEvent) => {
        event.stopPropagation();
        this.isPressed = true;
        this.cursorPosition = {
            right: this.stageWidth - event.nativeEvent.pageX,
            top: event.nativeEvent.pageY
        }
    }

    mouseReleased = (event: MouseEvent) =>{
        event.stopPropagation();
        this.isPressed = false;
        this.cursorPosition = {
            right: this.stageWidth - event.nativeEvent.pageX,
            top: event.nativeEvent.pageY
        }
    }
    mouseMoved = (event: MouseEvent) =>{
        event.stopPropagation();
        if (this.isPressed === false) return;
        // console.log(event.nativeEvent)
        this.cursorPosition = {
            right: this.stageWidth - event.nativeEvent.pageX,
            top: event.nativeEvent.pageY
        }
    }

    getRenderPosition = (): RenderPosition =>{
        return this.cursorPosition;
    }

    
}



