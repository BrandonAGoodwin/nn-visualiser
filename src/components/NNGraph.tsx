import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { Dataset2D } from "../datasets";
import BackgroundCanvas from "./BackgroundCanvas";
import styled from "@emotion/styled";

const StyledBackgroundCanvas = styled(BackgroundCanvas)`
    position: relative;
    top: 0;
    left: 0;
    z-index: -1;
`

interface GraphProps  {
    dataset: Dataset2D[];
    density: number;
    canvasWidth: number;

    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    numCells: number;
    xDomain: number[];
    yDomain: number[];
    decisionBoundary?: number[];
    discreetBoundary: boolean;
}


function NNGraph(props: GraphProps): JSX.Element {

    const d3Container: any = useRef<any>(null);

    const [initialised, setInitialised] = useState<boolean>(false);

    let scale = props.canvasWidth / 16;


    const init = () => {
        console.log("NNGraph init")

        createGraph();
        setInitialised(true);
    }

    useEffect(() => {
        console.log("NNGraph inital useEffect")
        init()
    }, []);


    useEffect(() => {
        console.log("props and props.decisionboundary NNGraph useEffect")
        if (!initialised) {
            init()
        } else {
            updateGraph()
        }
    }, [props.decisionBoundary, props.dataset]);


    const createGraph = () => {
        console.log("Creating graph");

        let svg = d3.select(d3Container.currnet)
            .attr("width", props.canvasWidth + props.marginLeft + props.marginRight)
            .attr("height", props.canvasWidth + props.marginTop + props.marginBottom);

    }

    const addFormattedText = (label: string, text: d3.Selection<SVGTextElement, unknown, null, undefined>) => {
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
    }

    const updateGraph = () => {
        console.log("Updating graph");

        const svg = d3.select(d3Container.current);

        svg.selectAll(`.graph`).remove();

        const graph = svg.append("g")
            .attr("class", "graph")
            .attr("transform", `translate(${props.marginLeft}, ${props.marginTop})`);

        const x = d3.scaleLinear().range([0, props.canvasWidth]);
        const y = d3.scaleLinear().range([props.canvasWidth, 0]);

        x.domain([-8, 8]);
        y.domain([-8, 8]);

        graph.append("g")
            .attr("class", `axis`)
            .attr("transform", `translate(0,${props.canvasWidth})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())));

        graph.append("g")
            .attr("class", `axis`)
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())));

        graph.append("g")
            .attr("class", `axis`)
            .attr("transform", `translate(${props.canvasWidth},0)`)
            .call(d3.axisRight(y).tickValues([0].concat(y.ticks())));

        graph.append("g")
            .attr("class", `axis`)
            .call(d3.axisTop(x).tickValues([0].concat(x.ticks())));

        let xAxisLabel = "X_1";
        let yAxisLabel = "X_2";

        let xAxisText = graph.append("text")
            .attr("class", `axis`)
            .attr("x", props.canvasWidth / 2)
            .attr("y", props.canvasWidth + props.marginBottom - 7)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "bottom");

        addFormattedText(xAxisLabel, xAxisText);

        let yAxisText = graph.append("text")
            .attr("class", `axis`)
            // .attr("transform", "rotate(-90)")
            // .attr("transform", `translate(${props.canvasWidth / 2}, ${- props.margin /2})`)
            .attr("y", props.canvasWidth / 2)
            .attr("x", -props.marginLeft)
            // .attr("dy", "1em")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")     
        

        addFormattedText(yAxisLabel, yAxisText);

        graph.selectAll(`.circle`)
            .data(props.dataset)
            .enter().append("circle")
            .attr("class", `circle`)
            .attr("r", scale / 7)
            .attr("fill", function (datapoint: Dataset2D): string {
                let colour = "black";
                if (datapoint.y === 1) colour = "#223781";
                if (datapoint.y === -1) colour = "#ff7661";

                return colour;
            })
            .style("stroke", "black")
            .attr("cx", (datapoint: Dataset2D) => (datapoint.x1 * scale) + (props.canvasWidth / 2))
            .attr("cy", (datapoint: Dataset2D) => -(datapoint.x2 * scale) + (props.canvasWidth / 2));

    }

    return (
        <>
            <div style={{ position: "relative"}}>
                <svg
                    ref={d3Container}
                    width={props.canvasWidth + props.marginLeft + props.marginRight}
                    height={props.canvasWidth + props.marginTop + props.marginBottom}
                    style={{ position: "absolute"}}
                />
                <BackgroundCanvas
                    width={props.canvasWidth}
                    height={props.canvasWidth}
                    numCells={props.numCells}
                    paddingLeft={props.marginLeft}
                    paddingRight={props.marginRight}
                    paddingTop={props.marginTop}
                    paddingBottom={props.marginBottom}
                    disabled={false}
                    padding={true}
                    decisionBoundary={props.decisionBoundary}
                    discreetBoundary={props.discreetBoundary}
                />
            </div>
        </>
    );
}

export default NNGraph;