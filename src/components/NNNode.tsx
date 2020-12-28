import styled from "@emotion/styled";
import React from "react";
import BackgroundCanvas from "./BackgroundCanvas";

interface NNNodeProps {
    nodeWidth: number;
    id: string;
    decisionBoundary: number[];
    discreetBoundary: boolean;
    numCells: number;
}

interface ContainerProps {
    nodeWidth: number;
}

const NodeContainer = styled("div") <ContainerProps>`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;
    border: 2px solid black;
    //background-color: black;
    background-color: white;
    border-radius: 3px;
    max-height: ${props => props.nodeWidth + 2 * 2}px;
`;


function NNNode(props: NNNodeProps) {
    
    return (
        <NodeContainer id={`${props.id}`} nodeWidth={props.nodeWidth}>
            <BackgroundCanvas
                width={props.nodeWidth}
                height={props.nodeWidth}
                numCells={props.numCells}
                padding={false}
                decisionBoundary={props.decisionBoundary}
                discreetBoundary={props.discreetBoundary}
            />
        </NodeContainer>
    );
}

export default NNNode;