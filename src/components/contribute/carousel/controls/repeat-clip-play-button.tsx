import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Url } from 'url';
import { ContributeType, WheelColor } from '../../../../types/contribute';
import Pause from '../../../ui/icons/pause';
import PlayIcon, { Play } from '../../../ui/icons/play';
import { Glow } from './glow';

const PlayButton = styled.div`
    margin-left: 5rem;
    display: grid;
    & :hover {
        & > div {
            opacity: 1;
        }
    }
`;

const RelativeGlow = styled(Glow)`
    position: relative;
    grid-column: 1;
    grid-row: 1;
    z-index: 0;
`;

const RelativePlayIcon = styled(PlayIcon)``;

const RelativePlayIconContainer = styled.div`
    margin: auto;
    grid-column: 1;
    grid-row: 1;
    z-index: 1;
    background-color: white;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

// const Audio = styled.audio`
//     display: none;
// `;

interface Props {
    src: string | undefined;
}

export const RepeatClipPlayButton: React.FunctionComponent<Props> = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio(props.src));

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            audio.pause();
            return;
        }
        audio.play();
    };

    return (
        <PlayButton onClick={handleTogglePlay}>
            <RelativePlayIconContainer>
                <RelativePlayIcon height={35} width={35} fill={'green'} />
            </RelativePlayIconContainer>
            <RelativeGlow color={WheelColor.GREEN} />
        </PlayButton>
    );
};
