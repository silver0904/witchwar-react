import { FC, SyntheticEvent } from "react"
import styled from "styled-components"

type StageProps = {
    boundaryWidth: number;
    boundaryHeight: number;
    arenaSize: number;
    arenaType: string;
    mouseDown: (event:SyntheticEvent) => void;
    mouseUp: (event:SyntheticEvent) => void;
    mouseMove: (event:SyntheticEvent) => void;
}
const StageDiv = styled.div({
    border: '5px solid red',
    position: 'absolute',
    top: '0px'
})

const ArenaDiv = styled.div({
    position: "absolute",
    border: '5px solid green',
    borderRadius: '50%'
})
export const Stage : FC<StageProps> = (props) => {
    const {children, 
        boundaryWidth, 
        boundaryHeight, 
        arenaSize, 
        arenaType, 
        mouseDown,
        mouseUp,
        mouseMove
    } = props;
    return (
        <StageDiv 
            style={{width: `${boundaryWidth}px`, height: `${boundaryHeight}px`}}
            onMouseDown={(event)=> mouseDown(event)} 
            onMouseMove={(event) => mouseMove(event)}
            onMouseUp={(event) => mouseUp(event)}
            >
            {children}
            <ArenaDiv style={{
                width: `${arenaSize}px`, 
                height: `${arenaSize}px`,
                top: `${(boundaryHeight-arenaSize)/2}px`,
                right: `${(boundaryWidth-arenaSize)/2}px`}}/>
        </StageDiv>

        
    )
}