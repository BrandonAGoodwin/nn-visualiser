import * as nn from "../NeuralNet";
import AdjustIcon from '@material-ui/icons/Adjust';
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import LeaderLine from "react-leader-line";
import * as d3 from "d3";
import BackgroundCanvas from "./BackgroundCanvas";
import NNNode from "./NNNode";

interface NetworkProps {
    network: nn.Node[][];
    decisionBoundaries: { [nodeId: string]: number[] };
    discreetBoundary: boolean;
}

const Container = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-left: 50px;
    padding-right: 10px;
    width: inherit;
    height: inherit;
`;

const Layer = styled("div")`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

function NeuralNetworkVis(props: NetworkProps) {
    const nodeWidth = 40;

    useEffect(() => {
        drawLinks();
        // Change to redraw on network shape change and just update options using a lines
        // Dictionary for better efficiency 
    }, [props.decisionBoundaries])

    useEffect(() => {
        function handleResize() {
            drawLinks();
        }
        window.addEventListener('resize', drawLinks);
        return () => window.removeEventListener('resize', drawLinks);
    }, [])

    const drawLinks = () => {
        console.log("Draw Links")

        let start = Date.now();

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

                    let lineConfig = {
                        color: (link.weight > 0 ? "#621fa2" : "#fbfb39"),
                        startSocket: "right",
                        endSocket: "left",
                    };

                    new LeaderLine(startNodeElement
                        , endNodeElement,
                        lineConfig
                    );
                    iter++;
                }
            }
        }

        let delta = Date.now() - start;
        console.log(`Finished drawing links (Links Drawn: ${iter}) (Duration: ${delta}ms)`);
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