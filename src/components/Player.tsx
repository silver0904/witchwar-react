import { FC } from "react";
import styled from 'styled-components';
import { PlayerInfo } from "../type/type";

type PlayerProps = {
    playerInfo: PlayerInfo
}

const BoxDiv = styled.div({
    margin: '40px',
    border: '5px black',
    position: 'absolute',
})

export const Box : FC<PlayerProps> = (props) => {
    const {position, name } = props.playerInfo
    const {x,y} = position;
    return (
      <BoxDiv style={{top: `${-y}px`, right: `${-x}.px`}}>
        <p>{name}</p>
      </BoxDiv>
    )
}