import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import BackgroundCanvas from "./BackgroundCanvas";

interface NNNodeProps {
    nodeWidth: number;
    id: string;
    nodeId?: string;
    decisionBoundary?: number[];
    discreetBoundary: boolean;
    numCells: number;
    handleOnClick?: (nodeId: string, active: boolean) => any;
    active: boolean;
}

interface ContainerProps {
    nodeWidth: number;
    active: boolean;
}

const NodeContainer = styled("div") <ContainerProps>`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;
    //border: 2px solid ${props => props.active ?"#000000" : "#505050"};
    border: 2px solid black;
    //background-color: black;
    background-color: white;
    border-radius: 3px;
    max-height: ${props => props.nodeWidth + 2 * 2}px;
    cursor: pointer;
`;


function NNNode(props: NNNodeProps) {

    return (
        <NodeContainer id={`${props.id}`}
            nodeWidth={props.nodeWidth}
            active={props.active}
            onClick={() => (props.handleOnClick && props.nodeId && props.handleOnClick(props.nodeId, props.active))}>
            <BackgroundCanvas
                width={props.nodeWidth}
                height={props.nodeWidth}
                numCells={props.numCells}
                padding={false}
                disabled={!props.active}
                decisionBoundary={props.decisionBoundary}
                discreetBoundary={props.discreetBoundary}
            />
        </NodeContainer>
    );
}

export default NNNode;