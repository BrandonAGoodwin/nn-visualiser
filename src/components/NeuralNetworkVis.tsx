import * as nn from "../NeuralNet";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import LeaderLine from "react-leader-line";
import * as d3 from "d3";
import NNNode from "./NNNode";


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
    const svgContainer: any = useRef<any>(null);
    const container: any = useRef<any>(null);
    const nodeWidth = 40;
    // Draw network
    const RECT_SIZE = 40;
    const [linksUpdated, setLinksUpdated] = useState<boolean>(false);
    const [network, setNetwork] = useState<nn.Node[][]>();

    // function getRelativeHeight(selection) {
    //     let node = selection.node() as HTMLAnchorElement;
    //     return node.offsetHeight + node.offsetTop;
    // }

    useEffect(() => {
        setLinksUpdated(false);
        setNetwork(props.network)
    }, [props.network])

    useEffect(() => {

    },)

    useEffect(() => {
        drawAllLinks(props.network);
    }, [props.decisionBoundaries])

 

    const drawAllLinks = (network: nn.Node[][]) => {
        console.log("Draw Links");
        let start = Date.now();
        d3.selectAll(".link").remove();
        let node2Coord = getNodeCoords(network);
        console.log(node2Coord)
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

                    // let lineConfig = generateLineConfig(link);
                    console.log(`link-${ node.id }-${ link.dest.id }`)
                    // newLinks[`link-${node.id}-${link.dest.id}`] = new LeaderLine(startNodeElement, endNodeElement, lineConfig);
                    iter++;
                }
                
            }
        }
        // let lines = document.querySelectorAll(".leader-line");
        // let networkContainer = document.getElementById("lines-container");
        // if(lines) {
        //     console.log("Appending lines")
        //     lines.forEach((value, index, array) => {networkContainer && networkContainer.append(value)})

        // }
        // setLinks(newLinks);
        // setUpdatingLinks(false);
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
        console.log(containerCurrent)

        for (let layerNum = 0; layerNum < network.length; layerNum++) {
            let currentLayer = network[layerNum];
            for (let i = 0; i < currentLayer.length; i++) {
                let node: nn.Node = currentLayer[i];
                let nodeElement = document.getElementById(`node-${node.id}`);
                // Right now they aren't actually the centre
                console.log(nodeElement)
                if(nodeElement) console.log(nodeElement.offsetLeft)
                console.log(containerLeft)
                if (nodeElement) node2Coord[node.id] = {cx: nodeElement.offsetLeft - containerLeft + nodeWidth/2, cy: nodeElement.offsetTop - containerTop + nodeWidth/2}
            }
        }
        return node2Coord;
    }

    function drawLink(
        input: nn.Link, node2coord: { [id: string]: { cx: number, cy: number } },
         index: number, length: number) {
             console.log("Draw Link NEW")
             console.log(input)
             console.log(node2coord)
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
        // let diagonal = d3.svg.diagonal().projection(d => [d.y, d.x]);
        let diagonal = d3.linkHorizontal()
            .x(function(d: any) { console.log(d)
                return d[0]; }).y(function(d: any) { return d[1]; })
        let d = diagonal(datum);

        d && line.attr("marker-start", "url(#markerArrow)")
            .attr("class", "link")
            .attr("id", `link-${input.source.id}-${input.dest.id}`)
            .attr("d", d)
            .attr("fill", "none")
            .attr("stroke","red")
            .attr("stroke-width", "5")


        // Add an invisible thick link that will be used for
        // showing the weight value on hover.
        // container.append("path")
        //     .attr("d", diagonal(datum, 0))
        //     .attr("class", "link-hover")
        //     .on("mouseenter", function () {
        //         updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this));
        //     }).on("mouseleave", function () {
        //         updateHoverCard(null);
        //     });
        return line;
    }

    const drawLayer = () => {

    }
    const drawNode = () => {

    }

    return (
        <div ref={container}>
            
            <svg
                ref={svgContainer}
                width={props.networkWidth}
                height={props.networkHeight}
                style={{ position: "absolute" }}
            />
            {!network || !linksUpdated && <canvas width={props.networkWidth} height={props.networkHeight} color="blue" style={{ position: "absolute", backgroundColor: "blue"}}/>}
            <Container style={{width:props.networkWidth, height:props.networkHeight }} id={'lines-container'}>

                {network && network.map(layer => <Layer>
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

// import * as nn from "../NeuralNet";
// import AdjustIcon from '@material-ui/icons/Adjust';
// import styled from "@emotion/styled";
// import React, { useEffect, useRef, useState } from "react";
// import LeaderLine from "react-leader-line";
// import * as d3 from "d3";
// import BackgroundCanvas from "./BackgroundCanvas";
// import NNNode from "./NNNode";
// import { networkInterfaces } from "os";
// import { link } from "fs";
// import SVGPath from "./SVGPath";

// interface NetworkProps {
//     network: nn.Node[][];
//     decisionBoundaries: { [nodeId: string]: number[] };
//     discreetBoundary: boolean;
// }

// const Container = styled("div")`
//     -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
//     -moz-box-sizing: border-box;    /* Firefox, other Gecko */
//     box-sizing: border-box;
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     padding-left: 40px;
//     padding-right: 0px;
//     width: inherit;
//     height: inherit;
// `;

// const Layer = styled("div")`
//     display: flex;
//     flex-direction: column;
//     justify-content: space-around;
//     align-items: center;
// `;


// // Could remove the output node and point straight to the graph
// function NeuralNetworkVis(props: NetworkProps) {
//     const container: any = useRef<any>(null);
//     const nodeWidth = 40;
//     const [links, setLinks] = useState<{[key:string]: any}>({});
//     const [initalised, setInitalised] = useState<boolean>(false);
//     // const [updatingLinks, setUpdatingLinks] = useState<boolean>(false);

//     useEffect(() => {
//         drawLinks();
//         setInitalised(true);
//     }, [props.network])

//     useEffect(() => {
//         //drawLinks();
//         initalised && updateLinks();
//         // Change to redraw on network shape change and just update options using a lines
//         // Dictionary for better efficiency 
//     }, [props.decisionBoundaries])

//     useEffect(() => {
//         window.addEventListener('resize', drawLinks);
//         return () => window.removeEventListener('resize', drawLinks);
//     }, [])

//     const generateLineConfig = (link: nn.Link) => {
//         let weightToSize = d3.scaleLinear().domain([-1, 0, 1]).range([4, 1, 4]);
//         return {
//             color: (link.weight > 0 ? "#ff7661" : "#223781"),
//             startSocket: "right",
//             endSocket: "left",
//             size: weightToSize(link.weight),
//         }
//     }

//     const drawLinks = () => {
//         console.log("Draw Links");
//         // setUpdatingLinks(true);
//         // Optimise to only redraw the links for the layer that has been changed
//         let start = Date.now();
//         let newLinks: {[key:string]: any} = {}
//         d3.selectAll(".leader-line").remove();
//         let iter = 0;
//         for (let layerNum = 0; layerNum < props.network.length; layerNum++) {
//             let currentLayer = props.network[layerNum];
//             for (let i = 0; i < currentLayer.length; i++) {
//                 let node: nn.Node = currentLayer[i];
//                 let startNodeElement = document.getElementById(`node-${node.id}`);
//                 for (let j = 0; j < node.linksOut.length; j++) {
//                     let link: nn.Link = node.linksOut[j];
//                     let endNodeElement = document.getElementById(`node-${link.dest.id}`);

//                     let lineConfig = generateLineConfig(link);
//                     console.log(`link-${ node.id }-${ link.dest.id }`)
//                     newLinks[`link-${node.id}-${link.dest.id}`] = new LeaderLine(startNodeElement, endNodeElement, lineConfig);
//                     iter++;
//                 }
//             }
//         }
//         let lines = document.querySelectorAll(".leader-line");
//         let networkContainer = document.getElementById("lines-container");
//         if(lines) {
//             console.log("Appending lines")
//             lines.forEach((value, index, array) => {networkContainer && networkContainer.append(value)})
    
//         }
//         setLinks(newLinks);
//         // setUpdatingLinks(false);
//         let delta = Date.now() - start;
//         console.log(`Finished drawing links (Links Drawn: ${iter}) (Duration: ${delta}ms)`);
//     }

//     const updateLinks = () => {
//         console.log("Updating Links");
//         let start = Date.now();
//         let iter = 0;
        
//         for (let layerNum = 0; layerNum < props.network.length; layerNum++) {
//             let currentLayer = props.network[layerNum];
//             for (let i = 0; i < currentLayer.length; i++) {
//                 let node: nn.Node = currentLayer[i];
//                 //let startNodeElement = document.getElementById(`node-${node.id}`);
//                 for (let j = 0; j < node.linksOut.length; j++) {
//                     let link: nn.Link = node.linksOut[j];
//                     //let endNodeElement = document.getElementById(`node-${link.dest.id}`);

//                     let lineConfig = generateLineConfig(link);

//                     let line = links[`link-${node.id}-${link.dest.id}`];
//                     line.setOptions(lineConfig);
//                     iter++;
//                 }
//             }

//         }

//         let delta = Date.now() - start;
//         console.log(`Finished updating links (Links Updating: ${iter}) (Duration: ${delta}ms)`);
//     }

//     const checkLinks = () => {
//         console.log("Checking links")
//         let expectedNoLines = 0;
//         for(let i = 0; i < props.network.length - 1; i++) {
//             expectedNoLines += props.network[i].length * props.network[i + 1].length;
//         }
//         return links.length === expectedNoLines;
//     }
//     //Have a method that checks if the links matches the current network before rendering
//     //Make a link into a component
//     //Reimplement the way the network is formed
//     return (
//         <Container ref={container} id={'lines-container'}>
            
//             {props.network.map(layer => <Layer>
//                 {layer.map(node => <NNNode
//                     id={`node-${node.id}`}
//                     nodeWidth={nodeWidth}
//                     numCells={20}
//                     decisionBoundary={props.decisionBoundaries[node.id]}
//                     discreetBoundary={props.discreetBoundary}
//                 />)}
//             </Layer>)}
                
//         </Container>
//     );
// }

// export default NeuralNetworkVis;