import styled from "@emotion/styled";
import { Tooltip, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { ColouredBox } from "./GraphPanel";

const HtmlTooltip = styled(Tooltip)`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 

`

const StyledLink = styled("a")`
    text-decoration: underline;
    color: ${(props: { color: string }) => (props.color)};
    cursor: pointer;
`


export interface DefinedTermProps {
    children: React.ReactChild | React.ReactChild[];
    definition: React.ReactChild | React.ReactChild[];
    onClick?: (panel: JSX.Element) => void;
    infoPanel?: JSX.Element;
    color?: string;
}

export function DefinedTerm(props: DefinedTermProps) {
    return (
        <HtmlTooltip interactive arrow
            title={props.definition}
            onClick={() => props.onClick && props.infoPanel && props.onClick(props.infoPanel)}
        ><StyledLink color={props.color ? props.color : "blue"}>{props.children}</StyledLink></HtmlTooltip>
    );
}

export function DefActivationFunction() {
    return (
        <>
            <Typography color="inherit">Activation Function (&Phi;)</Typography>
            <Typography variant="body2">The activation defines the output of a neuron (node).</Typography><br />
            <u>Click the icon to get more information</u>
        </>
    );
}

export function DefLearningRate() {
    return (
        <>
            <Typography color="inherit">Learning Rate (&epsilon;)</Typography>
            <Typography variant="body2">This affects the rate at which the weights and biases change when training the neural network.</Typography><br />
            <u>Click the icon to get more information</u>
        </>
    );
}

export function DefBatchSize() {
    return (
        <>
            <Typography color="inherit">Batch Size</Typography>
            {/* Could create an info panel for Stochastic Gradient Decent*/}
            <Typography variant="body2">Specifies the number of training samples used in each epoch of <StyledLink color={"lightblue"} href="https://www.google.com/search?q=mini+batch+gradient+descent" target="_blank">Mini-Batch Gradient Decent</StyledLink>.<br />(When batch size = 1, this is equivalent to <StyledLink color={"lightblue"} href="https://www.google.com/search?q=stochastic+gradient+descent" target="_blank">Stochastic Gradient Decent</StyledLink>) </Typography>
        </>
    );
}

export function DefOutput() {
    const { maxColour, minColour, minColourName, maxColourName } = useContext(ThemeContext);
    return (
        <>
            <Typography color="inherit">Output</Typography>
            <Typography variant="body2">This graph shows the final output of the neural network in the domain (-8, +8) for both the <DefinedTerm color={"lightblue"} definition={DefX1()}>X<sub>1</sub></DefinedTerm> and <DefinedTerm color={"lightblue"} definition={DefX2()}>X<sub>2</sub></DefinedTerm> features.<br /> The samples in the data sets used only have 2 classes (-1 and +1); the neural network defines a decision boundary so that points that are in<br /> {minColourName} <ColouredBox colour={minColour} /> sections of the graph are classified as class -1 and points that are in <br /> {maxColourName} <ColouredBox colour={maxColour} /> sections of the graph are classified as class +1.</Typography><br />
        </>
    );
}

export function DefLoss() {
    return (
        <>
            <Typography color="inherit">Loss</Typography>
            <Typography variant="body2">This is loss calculated using the <StyledLink color="lightblue" href="https://www.google.com/search?q=sum+squared+residuals" target="_blank">sum of squared residulals</StyledLink> between the output of our neural network and the expected output from out training set.</Typography><br />
            <u>Click the icon to get more information</u>
        </>
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
            Nodes are the individual functions that make up the neural network and are connected to nodes in adjacent layers by links.<br />
            <u>Click the icon to get more information</u>
        </Typography>
    );
}

export function DefLink() {
    return (
        <Typography variant="body2">

        </Typography>
    );
}
