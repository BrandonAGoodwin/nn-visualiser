import * as nn from "../NeuralNet";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import LeaderLine from "react-leader-line";
import * as d3 from "d3";
import NNNode from "./NNNode";
import { INPUTS } from "../visControl"


interface NetworkProps {
    network: nn.Node[][];
    decisionBoundaries: { [nodeId: string]: number[] };
    discreetBoundary: boolean;
    networkWidth: number;
    networkHeight: number;
}

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
const FadeCanvas = styled("canvas")<CanvasProps>`
    position: absolute;
    background-color: white;

    ${ ({visible}) => visible && `
    transition: opacity 1.1s;
    `}
    ${ ({visible}) => !visible && `
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


    useEffect(() => {
        setLinksUpdated(false);
        setNetwork(props.network)
    }, [props.network])


    useEffect(() => {
        drawAllLinks(props.network);
    }, [props.decisionBoundaries])

 
    const drawAllLinks = (network: nn.Node[][]) => {
        console.log("Draw Links");
        let start = Date.now();

        d3.selectAll(".link").remove();

        let node2Coord = getNodeCoords(network);
        if(!node2Coord) return;

        let iter = 0;
        for (let layerNum = 0; layerNum < network.length; layerNum++) {
            let currentLayer = network[layerNum];
            for (let i = 0; i < currentLayer.length; i++) {
                let node: nn.Node = currentLayer[i];
                // Instead store node positions in a dictionary to reduce elementSearches and increase speed
                for (let j = 0; j < node.linksOut.length; j++) {
                    let link: nn.Link = node.linksOut[j];
                    
                    drawLink(link, node2Coord, j, node.linksOut.length)

                    iter++;
                }
                
            }
        }

        if(!labelsDrawn) drawLabels(node2Coord);

        setLinksUpdated(true);
        let delta = Date.now() - start;
        console.log(`Finished drawing links (Links Drawn: ${iter}) (Duration: ${delta}ms)`);
    
    }

    const getNodeCoords = (network: nn.Node[][]) => {
        
        let containerCurrent = container.current;
        if(!network || !containerCurrent) return null;
        let node2Coord: { [id: string]: { cx: number, cy: number } } = {}
        let containerLeft = containerCurrent.offsetLeft;
        let containerTop = containerCurrent.offsetTop;

        for (let layerNum = 0; layerNum < network.length; layerNum++) {
            let currentLayer = network[layerNum];
            if(layerNum === 0) {
                let iter = 0;
                Object.keys(INPUTS).forEach((nodeId) => {
                
                    let nodeElement = document.getElementById(`node-${nodeId}`);
                    // Right now they aren't actually the centre
                    if (nodeElement) node2Coord[nodeId] = {cx: nodeElement.offsetLeft - containerLeft + nodeWidth/2, cy: nodeElement.offsetTop - containerTop + nodeWidth/2}
                })
            } else {
                for (let i = 0; i < currentLayer.length; i++) {
                    let node: nn.Node = currentLayer[i];
                    let nodeElement = document.getElementById(`node-${node.id}`);
                    // Right now they aren't actually the centre
                    if (nodeElement) node2Coord[node.id] = {cx: nodeElement.offsetLeft - containerLeft + nodeWidth/2, cy: nodeElement.offsetTop - containerTop + nodeWidth/2}
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
        if(!(dest && source)) return;

        // Check X and Ys are reversed properlly
        let datum:any = {
            source: 
                [source.cx + RECT_SIZE / 2 + 2, source.cy]
            ,
            target: [dest.cx - RECT_SIZE / 2, dest.cy + ((index - (length - 1) / 2) / length) * 12]
        };

        let diagonal = d3.linkHorizontal()
            .x(function(d: any) {
                return d[0]; }).y(function(d: any) { return d[1]; })
        let d = diagonal(datum);

        let linkConfig = generateLineConfig(input);

        d && line.attr("marker-start", "url(#markerArrow)")
            .attr("class", "link")
            .attr("id", `link-${input.source.id}-${input.dest.id}`)
            .attr("d", d)
            .attr("fill", "none")
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
            if(!source) {
                nodeNotDrawnYet = true;
                return;
            }
            // let datum:any = {
            //     source: 
            //         [source.cx + RECT_SIZE / 2 + 2, source.cy]
            //     ,
            //     target: [dest.cx - RECT_SIZE / 2, dest.cy + ((index - (length - 1) / 2) / length) * 12]
            // };

            let label = INPUTS[nodeId].label != null ? INPUTS[nodeId].label : nodeId;
            // Draw the input label.
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

            //nodeGroup.classed(activeOrNotClass, true);
    
        })
        if(!nodeNotDrawnYet)setLabelsDrawn(true);
    }


    const getInputNodes = (nodeId: string, onClick: any) => {
       return(<div>
           <p></p>
           <NNNode
                id={`node-${nodeId}`}
                nodeWidth={nodeWidth}
                numCells={20}
                decisionBoundary={props.decisionBoundaries[nodeId]}
                discreetBoundary={props.discreetBoundary}
            />
       </div>);
    }

    return (
        <div ref={container}>
            
            <svg
                ref={svgContainer}
                width={props.networkWidth}
                height={props.networkHeight}
                style={{ position: "absolute" }}
            />
            {!network || !linksUpdated && <FadeCanvas visible={true} width={props.networkWidth} height={props.networkHeight} />}

            <Container style={{width:props.networkWidth, height:props.networkHeight }} id={'lines-container'}>

                <Layer>
                    {network && Object.keys(INPUTS).map(nodeId => 
                        <NNNode
                        id={`node-${nodeId}`}
                        nodeWidth={nodeWidth}
                        numCells={20}
                        decisionBoundary={props.decisionBoundaries[nodeId]}
                        discreetBoundary={props.discreetBoundary}
                        />
                    )}
                </Layer>
                
                {network && network.slice(1).map(layer => <Layer>
                    {layer.map(node => <NNNode
                        id={`node-${node.id}`}
                        nodeWidth={nodeWidth}
                        numCells={20}
                        decisionBoundary={props.decisionBoundaries[node.id]}
                        discreetBoundary={props.discreetBoundary}
                    />)}
                </Layer>)}

            </Container>
        </div>
    );
}

export default NeuralNetworkVis;