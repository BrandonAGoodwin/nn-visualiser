import styled from "@emotion/styled";
import { createStyles, IconButton, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import React from "react";

const HtmlTooltip = styled(Tooltip)`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 

`

const StyledLink = styled("a")`
    text-decoration: underline;
    color: blue;
    cursor: pointer;
`
export interface DefinedTermProps {
    children: React.ReactChild | React.ReactChild[];
    definition: React.ReactChild | React.ReactChild[];
    onClick?: (panel: JSX.Element) => void;
    infoPanel?: JSX.Element;
}

export function DefinedTerm(props: DefinedTermProps) {
    return (
        <HtmlTooltip interactive arrow
            title={props.definition}
            onClick={() => props.onClick && props.infoPanel && props.onClick(props.infoPanel)}
        ><StyledLink>{props.children}</StyledLink></HtmlTooltip>
    );
}

export function DefX1() {
    return (
        <Typography variant="body2">
            X<sub>1</sub> represents the first feature of a datapoint that is being entered into the neural network
            (shown on the X axis of the nodes in the neural network and the output graph).<br />
            Domain of X<sub>1</sub> shown in the neural network is -8 to +8.
        </Typography>
    );
}

export function DefX2() {
    return (
        <Typography variant="body2">
            X<sub>2</sub> represents the second feature of a datapoint that is being entered into the neural network
            (shown on the Y axis of the nodes in the neural network and the output graph).<br />
            Domain of X<sub>2</sub> shown in the neural network is -8 to +8.
        </Typography>
    );
}

export function DefNode() {
    return (
        <Typography variant="body2">
           Nodes are the individual functions that make up the neural network and are connected to nodes in adjacent layers by links.<br/>
           <u>Click the icon to get more information</u>
        </Typography>
    );
}

export function DefLink() {
    return (
        <Typography variant="body2">

        </Typography>
    )
}
