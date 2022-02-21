import { FC } from "react";
import styled from 'styled-components';
import { PlayerInfo } from "../type/type";
import arrowSvg from "../static/arrow.svg";
import { convertPositionToRenderPosition, convertVectorToDegree } from "../utils/physicUtils";

type PlayerProps = {
    playerInfo: PlayerInfo
}

const BoxDiv = styled.div({
    position: 'absolute',
})

export const Box : FC<PlayerProps> = (props) => {
    const {character, general } = props.playerInfo
    const rotation = convertVectorToDegree(character.direction);
    const renderPos = convertPositionToRenderPosition(character.position);
    return (
      <BoxDiv style={{top: `${renderPos.top}px`, 
        right: `${renderPos.right}.px`,
        transform: `rotate(${rotation}deg)`}}>
        {/* <p>{name}</p> */}
        <img src={arrowSvg} style={{width: "25px", height: "25px"}}/>
      </BoxDiv>
    )
}