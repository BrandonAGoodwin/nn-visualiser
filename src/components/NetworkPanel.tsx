import * as nn from "../NeuralNet";
import styled from "@emotion/styled";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import NNNode from "./NNNode";
import { INPUTS } from "../visControl"
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { IconButton, Typography } from "@material-ui/core";
import { ContainerSection, StyledInfoButton } from "./MainPage";
import { DefinedTerm, DefX1, DefX2 } from "./Definitions";
import MouseTooltip from "./MouseTooltip";
import ResizeSensor from "css-element-queries";
import useEventListener from "./UseEventListener";
import { ThemeContext } from "../contexts/ThemeContext";
import { NNConfig } from "../NetworkController";
import { InfoPanelContext } from "../contexts/InfoPanelContext";

const StyledNetworkPanel = styled((props: any) => <ContainerSection gridArea="network" {...props} />)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* max-width: fit-content; */
`

interface ContainerBox {
    top: number;
    left: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

enum HoverCardType {
    BIAS,
    WEIGHT
}

interface HoverCardConfig {
    type: HoverCardType;
    value: number;
}

const HoverCard = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    background-color: white;
    margin: auto auto;
    border-radius: 10px;
    border: 2px solid #bdbdbd;
    //border: 2px solid #353a3c;
    width: 120px;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    z-index: 10000;
    /* position: absolute; */
    /* position: static; */
`

const PlusMinusButtonsContainer = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: flex-start;
`

const GridContainer = styled("div")`
    position: relative;
    display: grid;
    height: 100%;
    width: 50vw;
    /* max-width: 40vw; */
    min-width: 550px;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto 1fr 48px;
    grid-gap: 0px;
    grid-template-areas: 
        "inputs-label layer-controls ."
        "inputs-layer hidden-layers output"
        ". hidden-layers ."
        ;
`

const Container = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 50px;
    padding-right: 0px;
    width: 100%;
    height: inherit;
`;

const Layer = styled("div")`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const NetworkContainerSection = styled("div")`
    grid-area: ${(props: { gridArea: string }) => (props.gridArea)};
`

const LayerControls = styled((props: any) => <NetworkContainerSection gridArea="layer-controls" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

interface CanvasProps {
    visible: boolean;
}
const FadeCanvas = styled("canvas") <CanvasProps>`
    position: absolute;
    background-color: white;
    border-radius: 30px;

    ${({ visible }) => visible && `
    transition: opacity 1.1s;
    `}
    ${({ visible }) => !visible && `
    transition: opacity 0.1s;
    `}
`;


interface NetworkProps {
    network: nn.Node[][];
    decisionBoundaries: { [nodeId: string]: number[] };
    discreetBoundary: boolean;
    networkWidth: number;
    networkHeight: number;
    handleOnClick: any;
    inputs: { [inputId: string]: boolean };
    config: NNConfig;
    addNode: (layer: number) => void;
    removeNode: (layer: number) => void;
    addLayer: () => void;
    removeLayer: () => void;
    hiddenDomain: [number, number];
    outputDomain: [number, number];
}

// Could remove the output node and point straight to the graph
function NetworkPanel(props: NetworkProps) {
    const { minColour, maxColour } = useContext(ThemeContext);
    const { setInfoPanel } = useContext(InfoPanelContext);
    const svgContainer: any = useRef<any>(null);
    const container: any = useRef<any>(null);
    const nodeWidth = 30;
    const [linksUpdated, setLinksUpdated] = useState<boolean>(false);
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [labelsDrawn, setLabelsDrawn] = useState<boolean>(false);
    const [containerBox, setContainerBox] = useState<ContainerBox>({ top: 0, left: 0, x: 0, y: 0, width: 0, height: 0 });
    const [showHoverCard, setShowHoverCard] = useState<boolean>(false);
    const [hoverCardConfig, setHoverCardConfig] = useState<HoverCardConfig>({ type: HoverCardType.WEIGHT, value: 0 });
    const [hoverTarget, setHoverTarget] = useState<string>("");


    useEffect(() => {

        updateContainerBox();

        let container = document.getElementById("main-container");

        if (container) {
            window.addEventListener('resize', updateContainerBox);
            container.addEventListener('scroll', updateContainerBox);
        }
        return () => {
            if (container) {
                window.removeEventListener('resize', updateContainerBox);
                container.removeEventListener('scroll', updateContainerBox);
            }
        }
    }, [])

    const updateHovercard = (event: any) => {
        let targetId = event.target.id;

        if (targetId
            && (targetId.indexOf("link") !== -1 || targetId.indexOf("node") !== -1)
            && !(targetId.substring(5) in props.inputs)) {

            setHoverTarget(targetId);
            setShowHoverCard(true);

        }
    }

    const hideHoverCard = (event: any) => {
        let targetId = event.target.id;
        if (!targetId || (targetId.indexOf("link") === -1 && targetId.indexOf("node") === -1)) return;
        setHoverTarget("");
        setShowHoverCard(false);
    }

    // useEventListener("mouseenter", updateHovercard, undefined, true);
    // useEventListener("mouseleave", hideHoverCard, undefined, true);

    useEffect(() => {
        setLinksUpdated(false);
        setNetwork(props.network);

        document.addEventListener('mouseenter', updateHovercard, true);
        document.addEventListener('mouseleave', hideHoverCard, true);

        return () => {
            document.removeEventListener('mouseenter', updateHovercard, true);
            document.removeEventListener('mouseleave', hideHoverCard, true);
        }
    }, [props.network, props.inputs]);


    useEffect(() => {
        // drawAllLinks(props.network);
        updateContainerBox();
    }, [props.decisionBoundaries]);

    useEffect(() => {
        // At this point this means links are always drawn twice
        drawAllLinks(props.network);
    }, [containerBox]);

    useEffect(() => {
        if (hoverTarget !== "") {
            if (hoverTarget.indexOf("link") === -1) {
                // If a node
                let node = nodeId2Node(hoverTarget);
                if (node) setHoverCardConfig({ type: HoverCardType.BIAS, value: node.bias });

            } else {
                // If a link
                let link = linkId2Link(hoverTarget);
                if (link) setHoverCardConfig({ type: HoverCardType.WEIGHT, value: link.weight });
            }
        }
    }, [hoverTarget, props.decisionBoundaries]);


    const drawAllLinks = (network: nn.Node[][]) => {
        console.log("Draw Links");
        let start = Date.now();

        d3.selectAll(".link").remove();

        let node2Coord = getNodeCoords(network);
        if (!node2Coord) return;

        let iter = 0;
        for (let layerNum = 0; layerNum < network.length; layerNum++) {
            let currentLayer = network[layerNum];
            for (let i = 0; i < currentLayer.length; i++) {
                let node: nn.Node = currentLayer[i];
                // Instead store node positions in a dictionary to reduce elementSearches and increase speed
                for (let j = 0; j < node.linksOut.length; j++) {
                    let link: nn.Link = node.linksOut[j];

                    drawLink(link, node2Coord);

                    iter++;
                }

            }
        }

        if (!labelsDrawn) drawLabels(node2Coord);

        setLinksUpdated(true);
        let delta = Date.now() - start;
        console.log(`Finished drawing links (Links Drawn: ${iter}) (Duration: ${delta}ms)`);

    }

    const getNodeCoords = (network: nn.Node[][]) => {

        let containerCurrent = container.current;
        if (!network || !containerCurrent) return null;
        let node2Coord: { [id: string]: { cx: number, cy: number } } = {}
        let containerLeft = containerCurrent.offsetLeft;
        let containerTop = containerCurrent.offsetTop;

        for (let layerNum = 0; layerNum < network.length; layerNum++) {
            let currentLayer = network[layerNum];
            if (layerNum === 0) {
                let iter = 0;
                Object.keys(INPUTS).forEach((nodeId) => {

                    let nodeElement = document.getElementById(`node-${nodeId}`);
                    // Right now they aren't actually the centre
                    if (nodeElement) node2Coord[nodeId] = { cx: nodeElement.offsetLeft + nodeWidth / 2, cy: nodeElement.offsetTop + nodeWidth / 2 }
                })
            } else {
                for (let i = 0; i < currentLayer.length; i++) {
                    let node: nn.Node = currentLayer[i];
                    let nodeElement = document.getElementById(`node-${node.id}`);
                    // Right now they aren't actually the centre
                    if (nodeElement) node2Coord[node.id] = { cx: nodeElement.offsetLeft + nodeWidth / 2, cy: nodeElement.offsetTop + nodeWidth / 2 }
                }
            }
        }
        return node2Coord;
    }

    // Implement something so that the distributed widths are proportional to each other
    // or
    // Set a max width
    const generateLineConfig = (link: nn.Link) => {
        let weightToSize = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range([6, 1.5, 6])
            .clamp(true);
        return {
            color: (link.weight > 0 ? maxColour : minColour),
            size: weightToSize(link.weight),
        }
    }

    function drawLink(
        input: nn.Link, node2coord: { [id: string]: { cx: number, cy: number } }) {
        let container = d3.select(svgContainer.current);
        let line = container.append("path");
        let hoverLine = container.append("path");
        let source = node2coord[input.source.id];
        let dest = node2coord[input.dest.id];
        if (!(dest && source)) return;

        // Check X and Ys are reversed properlly
        let datum: any = {
            source:
                [source.cx + nodeWidth / 2 + 2, source.cy]
            ,
            target: [dest.cx - nodeWidth / 2, dest.cy]
        };

        let diagonal = d3.linkHorizontal()
            .x(function (d: any) {
                return d[0];
            }).y(function (d: any) { return d[1]; })
        let d = diagonal(datum);

        let linkConfig = generateLineConfig(input);

        d && line.attr("marker-start", "url(#markerArrow)")
            .attr("class", "link")
            .attr("id", `link-${input.source.id}-${input.dest.id}`)
            .attr("d", d)
            .attr("fill", "transparent")
            // .attr("pointer-events", "all")
            .attr("stroke", linkConfig.color)
            .attr("stroke-width", linkConfig.size || 0)
            .attr("stroke-dasharray", "10,2")
            // .attr("cursor", "pointer")
            // .on("mouseover", function (d, i) {
            //     d3.select(this).transition()
            //         .duration(100000)
            //         .ease(d3.easeLinear)
            //         .attr("stroke-dashoffset", -8000)
            // })
            // .on("mouseout", function (d, i) {
            //     d3.select(this)
            //         .transition();
            // })

            d && hoverLine.attr("marker-start", "url(#markerArrow)")
            .attr("class", "link")
            .attr("id", `link-${input.source.id}-${input.dest.id}`)
            .attr("d", d)
            .attr("fill", "transparent")
            .attr("pointer-events", "all")
            .attr("stroke", "grey")
            .attr("stroke-opacity", 0)
            .attr("stroke-width", 10)
            // .attr("stroke-dasharray", "10,2")
            .attr("cursor", "pointer")
            .on("mouseover", function (d, i) {
                line.transition()
                    .duration(100000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", -8000)
            })
            .on("mouseout", function (d, i) {
                line.transition();
            });
        return line;
    }

    function drawLabels(node2coord: { [id: string]: { cx: number, cy: number } }) {
        console.log("Draw Labels");
        let nodeIds = Object.keys(INPUTS);
        let nodeNotDrawnYet = false;
        let svg = d3.select(svgContainer.current);

        svg.selectAll(".input-label").remove();

        nodeIds.forEach((nodeId) => {
            let source = node2coord[nodeId];
            if (!source) {
                nodeNotDrawnYet = true;
                return;
            }

            let label = INPUTS[nodeId].label != null ? INPUTS[nodeId].label : nodeId;

            let text = svg.append("text")
                .attr("class", "input-label")
                .attr("x", source.cx - (nodeWidth / 2 + 2))
                .attr("y", source.cy + (nodeWidth / 4))
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
            if (/[_^]/.test(label)) {
                let myRe = /(.*?)([_^])(.)/g;
                let myArray;
                let lastIndex;
                while ((myArray = myRe.exec(label)) != null) {
                    lastIndex = myRe.lastIndex;
                    let prefix = myArray[1];
                    let sep = myArray[2];
                    let suffix = myArray[3];
                    if (prefix) {
                        text.append("tspan").text(prefix);
                    }
                    text.append("tspan")
                        .attr("baseline-shift", sep === "_" ? "sub" : "super")
                        .style("font-size", "9px")
                        .text(suffix);
                }
                if (lastIndex && label.substring(lastIndex)) {
                    text.append("tspan").text(label.substring(lastIndex));
                }
            } else {
                text.append("tspan").text(label);
            }

        })
        if (!nodeNotDrawnYet) setLabelsDrawn(true);
    }

    const updateContainerBox = () => {
        let containerCurrent = container.current;
        if (!containerCurrent) return;
        // console.log("updating container box");
        let viewportOffset = containerCurrent.getBoundingClientRect();
        // console.log(containerCurrent.offsetTop);
        // console.log(viewportOffset)
        setContainerBox({
            left: -viewportOffset.x,
            top: -viewportOffset.y,
            x: viewportOffset.x,
            y: viewportOffset.y,
            width: viewportOffset.width,
            height: viewportOffset.height
        });

    }

    const nodeId2Node = (nodeId: string) => {
        if (!props.network) return null;
        let id = nodeId.substring(5);
        for (let layerNum = 0; layerNum < props.network.length; layerNum++) {
            for (let nodeNum = 0; nodeNum < props.network[layerNum].length; nodeNum++) {
                let node = props.network[layerNum][nodeNum];
                if (node.id === id) return node;
            }
        }
    }

    const linkId2Link = (linkId: string) => {
        // console.log(props.network)
        if (!props.network) return null;
        let splitId = linkId.split("-");
        // console.log(splitId)
        let fromNodeId = splitId[1];
        let toNodeId = splitId[2];
        let fromNode = nodeId2Node("node-" + fromNodeId);
        // console.log(fromNode)
        if (!fromNode) return null;
        for (let i = 0; i < fromNode.linksOut.length; i++) {
            let link = fromNode.linksOut[i];
            if (link.dest.id === toNodeId) return link;
        }
        return null;
    }

    return (
        <StyledNetworkPanel>
            <>
            <GridContainer style={{ overflow: "hidden" }} ref={container}>
                <svg
                    ref={svgContainer}
                    width={containerBox.width}
                    height={containerBox.height}
                    style={{ position: "absolute", pointerEvents: "none" }}
                    id={'lines-container'}
                />
                {!network || !linksUpdated && <FadeCanvas visible={true} width={containerBox.width} height={containerBox.height} />}
                <div style={{ paddingTop: "10px", paddingLeft: "30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gridArea: "inputs-label" }}>
                    <Typography>Inputs</Typography>
                    <StyledInfoButton title="Inputs Tooltip" fontSize="small" marginRight={0} marginLeft={5}>
                        <React.Fragment>
                            <Typography color="inherit">Inputs</Typography>
                            <Typography variant="body2">
                                The inputs determine the data that is input into the neural network from the data set.
                                Each input is a function of <DefinedTerm definition={DefX1()}>X<sub>1</sub></DefinedTerm> and/or <DefinedTerm definition={DefX2()}>X<sub>2</sub></DefinedTerm>.
                            </Typography>
                            {/* <br /><u>Click the icon to get more information</u> */}
                        </React.Fragment>
                    </StyledInfoButton>
                </div>
                <LayerControls>
                    <IconButton onClick={props.removeLayer}>
                        <RemoveCircleIcon />
                    </IconButton>
                    <Typography> Hidden Layers: {props.config.networkShape.length - 2}</Typography>
                    <IconButton onClick={props.addLayer}>
                        <AddCircleIcon />
                    </IconButton>
                </LayerControls>
                <Container style={{ gridArea: "inputs-layer", paddingLeft: "60px" }}>
                    <Layer>
                        {network && Object.keys(INPUTS).map(nodeId =>
                            <NNNode
                                id={`node-${nodeId}`}
                                nodeId={nodeId}
                                active={props.inputs[nodeId]}
                                nodeWidth={nodeWidth}
                                numCells={20}
                                decisionBoundary={props.decisionBoundaries[nodeId]}
                                discreetBoundary={props.discreetBoundary}
                                handleOnClick={props.handleOnClick}
                                domain={props.hiddenDomain}
                            />
                        )}
                    </Layer>
                </Container>
                <Container style={{ width: "100%", height: "100%", paddingLeft: "0px", justifyContent: "space-around", gridArea: "hidden-layers" }}>
                    {network && network.slice(1, network.length - 1).map((layer, layerNum) =>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Layer style={{ flexGrow: 1 }}>
                                {layer.map(node => <NNNode
                                    id={`node-${node.id}`}
                                    nodeWidth={nodeWidth}
                                    numCells={20}
                                    active={true}
                                    decisionBoundary={props.decisionBoundaries[node.id]}
                                    discreetBoundary={props.discreetBoundary}
                                    domain={ props.hiddenDomain }
                                />)}
                            </Layer>
                            {(layerNum !== network.length - 2) &&
                                <PlusMinusButtonsContainer style={{ flexGrow: 0 }}>
                                <IconButton onClick={() => props.removeNode(layerNum + 1)}>
                                    <RemoveCircleIcon />
                                </IconButton>
                                <IconButton onClick={() => props.addNode(layerNum + 1)}>
                                    <AddCircleIcon />
                                </IconButton>
                            </PlusMinusButtonsContainer>}
                        </div>)}
                </Container>
                <Container style={{ width: "100%", height: "100%", paddingLeft: "0px", gridArea: "output", paddingRight: "10px" }}>
                    {network && network.slice(network.length - 1).map((layer, layerNum) =>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Layer style={{ flexGrow: 1 }}>
                                {layer.map(node => <NNNode
                                    id={`node-${node.id}`}
                                    nodeWidth={nodeWidth}
                                    numCells={20}
                                    active={true}
                                    decisionBoundary={props.decisionBoundaries[node.id]}
                                    discreetBoundary={props.discreetBoundary}
                                    domain={props.outputDomain}
                                />)}
                            </Layer>
                        </div>)}
                </Container>
                {/* <svg
                    ref={svgContainer}
                    width={containerBox.width}
                    height={containerBox.height}
                    style={{ position: "absolute", pointerEvents: "none" }}
                    id={'lines-container'}
                    className={"testg"}
                /> */}
            </GridContainer>
            <MouseTooltip
                visible={showHoverCard}
                // offsetX={containerBox.left}
                // offsetY={containerBox.top}
                style={{ /* position: "absolute"  ,*/ pointerEvents: "none" }}
            >
                <HoverCard>
                    {(hoverCardConfig.type === HoverCardType.WEIGHT) && <p>Weight: {hoverCardConfig.value.toFixed(3)}</p>}
                    {(hoverCardConfig.type === HoverCardType.BIAS) && <p>Bias: {hoverCardConfig.value.toFixed(3)}</p>}
                </HoverCard>
            </MouseTooltip>
            </>
        </StyledNetworkPanel>
    );
}

export default NetworkPanel;