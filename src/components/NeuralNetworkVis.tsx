import * as nn from "../NeuralNet";
import AdjustIcon from '@material-ui/icons/Adjust';
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import LeaderLine from "react-leader-line";
import * as d3 from "d3";
import BackgroundCanvas from "./BackgroundCanvas";
import NNNode from "./NNNode";
import { networkInterfaces } from "os";

interface NetworkProps {
    network: nn.Node[][];
    decisionBoundaries: { [nodeId: string]: number[] };
    discreetBoundary: boolean;
}

const Container = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 40px;
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


// Could remove the output node and point straight to the graph
function NeuralNetworkVis(props: NetworkProps) {
    const nodeWidth = 40;
    const [links, setLinks] = useState<{[key:string]: any}>({});
    const [initalised, setInitalised] = useState<boolean>(false);
    useEffect(() => {
        drawLinks();
        setInitalised(true);
    }, [props.network])

    useEffect(() => {
        //drawLinks();
        initalised && updateLinks();
        // Change to redraw on network shape change and just update options using a lines
        // Dictionary for better efficiency 
    }, [props.decisionBoundaries])

    useEffect(() => {
        window.addEventListener('resize', drawLinks);
        return () => window.removeEventListener('resize', drawLinks);
    }, [])

    const generateLineConfig = (link: nn.Link) => {
        let weightToSize = d3.scaleLinear().domain([-1, 0, 1]).range([4, 1, 4]);
        return {
            color: (link.weight > 0 ? "#ff7661" : "#223781"),
            startSocket: "right",
            endSocket: "left",
            size: weightToSize(link.weight),
        }
    }

    const drawLinks = () => {
        console.log("Draw Links");
        // Optimise to only redraw the links for the layer that has been changed
        let start = Date.now();
        let newLinks: {[key:string]: any} = {}
        d3.selectAll(".leader-line").remove();
        let iter = 0;
        for (let layerNum = 0; layerNum < props.network.length; layerNum++) {
            let currentLayer = props.network[layerNum];
            for (let i = 0; i < currentLayer.length; i++) {
                let node: nn.Node = currentLayer[i];
                let startNodeElement = document.getElementById(`node-${node.id}`);
                for (let j = 0; j < node.linksOut.length; j++) {
                    let link: nn.Link = node.linksOut[j];
                    let endNodeElement = document.getElementById(`node-${link.dest.id}`);

                    let lineConfig = generateLineConfig(link);

                    newLinks[`link-${node.id}-${link.dest.id}`] = new LeaderLine(startNodeElement, endNodeElement, lineConfig);
                    iter++;
                }
            }
        }
        setLinks(newLinks);
        let delta = Date.now() - start;
        console.log(`Finished drawing links (Links Drawn: ${iter}) (Duration: ${delta}ms)`);
    }

    const updateLinks = () => {
        console.log("Updating Links");
        let start = Date.now();
        let iter = 0;
        for (let layerNum = 0; layerNum < props.network.length; layerNum++) {
            let currentLayer = props.network[layerNum];
            for (let i = 0; i < currentLayer.length; i++) {
                let node: nn.Node = currentLayer[i];
                //let startNodeElement = document.getElementById(`node-${node.id}`);
                for (let j = 0; j < node.linksOut.length; j++) {
                    let link: nn.Link = node.linksOut[j];
                    //let endNodeElement = document.getElementById(`node-${link.dest.id}`);

                    let lineConfig = generateLineConfig(link);

                    let line = links[`link-${node.id}-${link.dest.id}`];
                    line.setOptions(lineConfig);
                    iter++;
                }
            }

        }
        let delta = Date.now() - start;
        console.log(`Finished updating links (Links Updating: ${iter}) (Duration: ${delta}ms)`);
    }

    return (
        <Container>
            {props.network.map(layer => <Layer>
                {layer.map(node => <NNNode
                    id={`node-${node.id}`}
                    nodeWidth={nodeWidth}
                    numCells={20}
                    decisionBoundary={props.decisionBoundaries[node.id]}
                    discreetBoundary={props.discreetBoundary}
                />)}
            </Layer>)}
        </Container>
    );
}

export default NeuralNetworkVis;