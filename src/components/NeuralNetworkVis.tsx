import * as nn from "../NeuralNet";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import NNNode from "./NNNode";
import { INPUTS } from "../visControl"
import MouseToolTip from "react-sticky-mouse-tooltip";

interface Offset {
    top: number;
    left: number;
}

interface NetworkProps {
    network: nn.Node[][];
    decisionBoundaries: { [nodeId: string]: number[] };
    discreetBoundary: boolean;
    networkWidth: number;
    networkHeight: number;
    handleOnClick: any;
    inputs: string[];
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
    /* padding: 10px; */
    border-radius: 10px;
    border: 2px solid #bdbdbd;
    //border: 2px solid #353a3c;
    width: 120px;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    z-index: 10000;
    position: absolute;
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
    width: inherit;
    height: inherit;
`;

const Layer = styled("div")`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

interface CanvasProps {
    visible: boolean;
}
const FadeCanvas = styled("canvas") <CanvasProps>`
    position: absolute;
    background-color: white;

    ${({ visible }) => visible && `
    transition: opacity 1.1s;
    `}
    ${({ visible }) => !visible && `
    transition: opacity 0.1s;
    `}
`;

// Could remove the output node and point straight to the graph
function NeuralNetworkVis(props: NetworkProps) {
    const svgContainer: any = useRef<any>(null);
    const container: any = useRef<any>(null);
    const nodeWidth = 40;
    const RECT_SIZE = 40;
    const [linksUpdated, setLinksUpdated] = useState<boolean>(false);
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [labelsDrawn, setLabelsDrawn] = useState<boolean>(false);
    const [containerOffset, setContainerOffset] = useState<Offset>({ top: 0, left: 0 });
    const [showHoverCard, setShowHoverCard] = useState<boolean>(false);
    const [hoverCardConfig, setHoverCardConfig] = useState<HoverCardConfig>({ type: HoverCardType.WEIGHT, value: 0 });


    useEffect(() => {

        updateContainerOffset();

        window.addEventListener('resize', updateContainerOffset);

        document.addEventListener('mouseenter', updateHovercard, true);
        document.addEventListener('mouseleave', hideHoverCard, true);

        return () => {
            window.removeEventListener('resize', updateContainerOffset);

            document.removeEventListener('mouseenter', updateHovercard);
            document.removeEventListener('mouseleave', hideHoverCard);
        }
    }, [])

    const updateHovercard = (event: any) => {
        let targetId = event.target.id;

        if (!targetId || (targetId.indexOf("link") === -1 && targetId.indexOf("node") === -1)) return;

        if (targetId.indexOf("link") === -1) {
            // If a node
            let node = nodeId2Node(targetId);
            if (node) setHoverCardConfig({ type: HoverCardType.BIAS, value: node.bias });
        } else {
            // If a link
            let link = linkId2Link(targetId);
            if (link) setHoverCardConfig({ type: HoverCardType.WEIGHT, value: link.weight });
        }

        setShowHoverCard(true);
    }

    const hideHoverCard = (event: any) => {
        let targetId = event.target.id;
        if (!targetId || (targetId.indexOf("link") === -1 && targetId.indexOf("node") === -1)) return;
        setShowHoverCard(false);
    }

    useEffect(() => {
        setLinksUpdated(false);
        setNetwork(props.network);
    }, [props.network])


    useEffect(() => {
        drawAllLinks(props.network);
    }, [props.decisionBoundaries])


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

                    drawLink(link, node2Coord, j, node.linksOut.length);

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
                    if (nodeElement) node2Coord[nodeId] = { cx: nodeElement.offsetLeft - containerLeft + nodeWidth / 2, cy: nodeElement.offsetTop - containerTop + nodeWidth / 2 }
                })
            } else {
                for (let i = 0; i < currentLayer.length; i++) {
                    let node: nn.Node = currentLayer[i];
                    let nodeElement = document.getElementById(`node-${node.id}`);
                    // Right now they aren't actually the centre
                    if (nodeElement) node2Coord[node.id] = { cx: nodeElement.offsetLeft - containerLeft + nodeWidth / 2, cy: nodeElement.offsetTop - containerTop + nodeWidth / 2 }
                }
            }
        }
        return node2Coord;
    }

    // Implement something so that the distributed widths are proportional to each other
    // or
    // Set a max width
    const generateLineConfig = (link: nn.Link) => {
        let weightToSize = d3.scaleLinear().domain([-1, 0, 1]).range([4, 1, 4]);
        return {
            color: (link.weight > 0 ? "#223781" : "#ff7661"),
            size: weightToSize(link.weight),
        }
    }

    function drawLink(
        input: nn.Link, node2coord: { [id: string]: { cx: number, cy: number } },
        index: number, length: number) {
        let line = d3.select(svgContainer.current).append("path");
        let source = node2coord[input.source.id];
        let dest = node2coord[input.dest.id];
        if (!(dest && source)) return;

        // Check X and Ys are reversed properlly
        let datum: any = {
            source:
                [source.cx + RECT_SIZE / 2 + 2, source.cy]
            ,
            target: [dest.cx - RECT_SIZE / 2, dest.cy + ((index - (length - 1) / 2) / length) * 12]
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
            .attr("pointer-events", "all")
            .attr("stroke", linkConfig.color)
            .attr("stroke-width", linkConfig.size || 0)

        return line;
    }

    function drawLabels(node2coord: { [id: string]: { cx: number, cy: number } }) {
        console.log("Draw Labels");
        let nodeIds = Object.keys(INPUTS);
        let nodeNotDrawnYet = false;
        let svg = d3.select(svgContainer.current);

        nodeIds.forEach((nodeId) => {
            let source = node2coord[nodeId];
            if (!source) {
                nodeNotDrawnYet = true;
                return;
            }

            let label = INPUTS[nodeId].label != null ? INPUTS[nodeId].label : nodeId;

            let text = svg.append("text")
                .attr("x", source.cx - (RECT_SIZE / 2 + 2))
                .attr("y", source.cy)
                .attr("text-anchor", "end")
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

    const handleHover = (nodeId: string, active: boolean) => {

    }

    const updateContainerOffset = () => {
        let containerCurrent = container.current;
        if (!containerCurrent) return;
        setContainerOffset({ left: containerCurrent.offsetLeft, top: containerCurrent.offsetTop });
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
        if (!props.network) return null;
        let splitId = linkId.split("-");
        let fromNodeId = splitId[1];
        let toNodeId = splitId[2];
        let fromNode = nodeId2Node("node-" + fromNodeId);
        if (!fromNode) return null;
        for (let i = 0; i < fromNode.linksOut.length; i++) {
            let link = fromNode.linksOut[i];
            if (link.dest.id === toNodeId) return link;
        }
        return null;
    }

    return (
        <div ref={container}>
            <MouseToolTip
                visible={showHoverCard}
                offsetX={-1 * containerOffset.left}
                offsetY={-1 * containerOffset.top}
                style={{ position: "relative" }}>
                <HoverCard>
                    {(hoverCardConfig.type === HoverCardType.WEIGHT) && <p>Weight: {hoverCardConfig.value.toFixed(3)}</p>}
                    {(hoverCardConfig.type === HoverCardType.BIAS) && <p>Bias: {hoverCardConfig.value.toFixed(3)}</p>}
                </HoverCard>
            </MouseToolTip>
            <svg
                ref={svgContainer}
                width={props.networkWidth}
                height={props.networkHeight}
                style={{ position: "absolute", pointerEvents: "none" }}
                id={'lines-container'}
                className={"testg"}
            />
            {!network || !linksUpdated && <FadeCanvas visible={true} width={props.networkWidth} height={props.networkHeight} />}

            <Container style={{ width: props.networkWidth, height: props.networkHeight }}>

                <Layer>
                    {network && Object.keys(INPUTS).map(nodeId =>
                        <NNNode
                            id={`node-${nodeId}`}
                            nodeId={nodeId}
                            active={props.inputs.includes(nodeId)}
                            nodeWidth={nodeWidth}
                            numCells={20}
                            decisionBoundary={props.decisionBoundaries[nodeId]}
                            discreetBoundary={props.discreetBoundary}
                            handleOnClick={props.handleOnClick}
                        />
                    )}
                </Layer>

                {network && network.slice(1).map(layer => <Layer>
                    {layer.map(node => <NNNode
                        id={`node-${node.id}`}
                        nodeWidth={nodeWidth}
                        numCells={20}
                        active={true}
                        decisionBoundary={props.decisionBoundaries[node.id]}
                        discreetBoundary={props.discreetBoundary}
                        handleOnHover={handleHover}
                    />)}
                </Layer>)}

            </Container>
        </div>
    );
}

export default NeuralNetworkVis;