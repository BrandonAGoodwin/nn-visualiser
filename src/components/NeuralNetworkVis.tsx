import * as nn from "../NeuralNet";
import AdjustIcon from '@material-ui/icons/Adjust';
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import LeaderLine from "react-leader-line";
import * as d3 from "d3";
import BackgroundCanvas from "./BackgroundCanvas";
import NNNode from "./NNNode";
import { networkInterfaces } from "os";
import { link } from "fs";
import SVGPath from "./SVGPath";

interface NetworkProps {
    network: nn.Node[][];
    decisionBoundaries: { [nodeId: string]: number[] };
    discreetBoundary: boolean;
}

const Container = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;
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
    const container: any = useRef<any>(null);
    const nodeWidth = 40;
    const [links, setLinks] = useState<{[key:string]: any}>({});
    const [initalised, setInitalised] = useState<boolean>(false);
    // const [updatingLinks, setUpdatingLinks] = useState<boolean>(false);

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
        // setUpdatingLinks(true);
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
                    console.log(`link-${ node.id }-${ link.dest.id }`)
                    newLinks[`link-${node.id}-${link.dest.id}`] = new LeaderLine(startNodeElement, endNodeElement, lineConfig);
                    iter++;
                }
            }
        }
        let lines = document.querySelectorAll(".leader-line");
        let networkContainer = document.getElementById("lines-container");
        if(lines) {
            console.log("Appending lines")
            lines.forEach((value, index, array) => {networkContainer && networkContainer.append(value)})
    
        }
        setLinks(newLinks);
        // setUpdatingLinks(false);
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

    const checkLinks = () => {
        console.log("Checking links")
        let expectedNoLines = 0;
        for(let i = 0; i < props.network.length - 1; i++) {
            expectedNoLines += props.network[i].length * props.network[i + 1].length;
        }
        return links.length === expectedNoLines;
    }
    //Have a method that checks if the links matches the current network before rendering
    //Make a link into a component
    //Reimplement the way the network is formed
    return (
        <div>
            <canvas
                style={{
                    width:  "inherit",
                    height: "inherit",
                    backgroundColor: "white",
                    position: "absolute"
                }}
            />
        <Container ref={container} id={'lines-container'}>
            
            
            {props.network.map(layer => <Layer>
                {layer.map(node => <NNNode
                    id={`node-${node.id}`}
                    nodeWidth={nodeWidth}
                    numCells={20}
                    decisionBoundary={props.decisionBoundaries[node.id]}
                    discreetBoundary={props.discreetBoundary}
                />)}
            </Layer>)}
                {/* <svg width="100%" height="100%"  style={{ position: "absolute" }}>
                    {container.current && props.network.map(layer => {
                        layer.map(node => {
                            node.linksOut.map(link => <SVGPath
                                startElementId={`node-x`}
                                endElementId={`node-1`}
                                points={[]}
                                color={"white"}
                                width={3}
                                trace={false}
                                progress={0}
                                containerLeft={container.current.offsetLeft||0}
                                containerTop={container.current.offsetTop||0}
                            />)
                        })
                    }
                    )}
                    {container.current && <SVGPath
                        startElementId={`node-x`}
                        endElementId={`node-1`}
                        points={[]}
                        color={"red"}
                        width={3}
                        trace={false}
                        progress={0}
                        containerLeft={container.current.offsetLeft||0}
                        containerTop={container.current.offsetTop||0}
                    />}</svg> */}
            {/* {props.network && drawLinks()} */}
        </Container>
        </div>
    );
}

export default NeuralNetworkVis;