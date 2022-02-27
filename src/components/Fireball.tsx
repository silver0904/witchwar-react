import { FC } from "react";
import styled from 'styled-components';
import {ReactComponent as BallSvg} from "../static/ball.svg";
import { convertPositionToRenderPosition, convertVectorToDegree, isZero } from "../utils/physicUtils";
import { Projectile } from "../classes/Projectile";

type FireballProps = {
    projectileInfo: Projectile
}

const BoxDiv = styled.div({
    position: 'absolute',
})

export const Fireball : FC<FireballProps> = (props) => {
    const {direction, position} = props.projectileInfo
    const rotation = direction.degrees;
    const renderPos = convertPositionToRenderPosition(position);
    return (
      <BoxDiv style={{top: `${renderPos.top}px`, 
        right: `${renderPos.right}.px`}}>
        <BallSvg width="26px" height="26px" 
        // fill={general.color.code} 
        transform={`rotate(${rotation})`}/>
      </BoxDiv>
    )
}