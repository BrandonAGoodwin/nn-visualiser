import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import BackgroundCanvas from "./BackgroundCanvas";


interface ContainerProps {
    nodeWidth: number;
    active: boolean;
    noBorder: boolean;
}

const NodeContainer = styled("div") <ContainerProps>`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;
    //border: 2px solid ${props => props.active ? "#000000" : "#505050"};
    border: 2px solid black;
    //background-color: black;
    background-color: white;
    border-color: ${props => props.noBorder ? "#FFFFFF" : "#000000"};
    border-radius: 3px;
    max-height: ${props => props.nodeWidth + 2 * 2}px;
    cursor: pointer;
`;

interface NNNodeProps {
    nodeWidth: number;
    id: string;
    nodeId?: string;
    decisionBoundary?: number[];
    discreetBoundary: boolean;
    numCells: number;
    handleOnClick?: (nodeId: string, active: boolean) => any;
    handleOnHover?: (nodeId: string, active: boolean) => any;
    active: boolean;
    domain: [number, number];
    hide?: boolean;
}


function NNNode(props: NNNodeProps) {
    const {
        nodeWidth,
        id,
        nodeId,
        decisionBoundary,
        discreetBoundary,
        numCells,
        handleOnClick,
        handleOnHover,
        active,
        domain,
        hide = false,
    } = props;

    return (
        <NodeContainer id={`${id}`}
            nodeWidth={nodeWidth}
            active={active}
            onClick={() => (handleOnClick && nodeId && handleOnClick(nodeId, active))}
            onMouseOver={() => (handleOnHover && nodeId && handleOnHover(nodeId, active))}
            noBorder={hide ? hide : false}
        >
            <BackgroundCanvas
                width={nodeWidth}
                height={nodeWidth}
                numCells={numCells}
                padding={false}
                disabled={!active}
                decisionBoundary={decisionBoundary}
                discreetBoundary={discreetBoundary}
                domain={domain}
                hide={hide}
            />
        </NodeContainer>
    );
}

export default NNNode;