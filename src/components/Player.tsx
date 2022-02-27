import { FC } from "react";
import styled from 'styled-components';
import { PlayerInfo } from "../type/type";
import {ReactComponent as ArrowSvg} from "../static/arrow.svg";
import { convertPositionToRenderPosition, convertVectorToDegree, isZero } from "../utils/physicUtils";

type PlayerProps = {
    playerInfo: PlayerInfo
}

const BoxDiv = styled.div({
    position: 'absolute',
})

export const Player : FC<PlayerProps> = (props) => {
    const {character, general } = props.playerInfo
    const rotation = character.status == "CHARGING" && character.aimDirection ?
    character.aimDirection.degrees :
    character.direction.degrees;
    const renderPos = convertPositionToRenderPosition(character.position);
    return (
      <BoxDiv style={{top: `${renderPos.top}px`, 
        right: `${renderPos.right}.px`}}>
        <ArrowSvg width="26px" height="26px" fill={general.color.code} transform={`rotate(${rotation})`}/>
        <p>{Math.floor(character.health)}</p>
      </BoxDiv>
    )
}