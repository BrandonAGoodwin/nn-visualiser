import React, { useEffect, useState, useRef, useContext } from "react";
import * as d3 from "d3";
import { Datapoint2D } from "../datasets";
import DecisionBoundaryCanvas from "./DecisionBoundaryCanvas";
import { ThemeContext } from "../contexts/ThemeContext";

interface GraphProps {
    trainingData: Datapoint2D[];
    testData: Datapoint2D[];
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
    showTestData: boolean;
    domain: [number, number];
}

function NNGraph(props: GraphProps): JSX.Element {

    const {
        trainingData,
        testData,
        density,
        canvasWidth,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        numCells,
        decisionBoundary,
        discreetBoundary,
        showTestData,
        domain
    } = props;

    const { minColour, maxColour } = useContext(ThemeContext);

    const d3Container: any = useRef<any>(null);

    const [initialised, setInitialised] = useState<boolean>(false);

    let scale = canvasWidth / 16;


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
        console.log("props and decisionboundary NNGraph useEffect")
        if (!initialised) {
            init()
        } else {
            updateGraph()
        }
    }, [decisionBoundary, trainingData, testData, showTestData]);


    const createGraph = () => {
        console.log("Creating graph");

        d3.select(d3Container.currnet)
            .attr("width", canvasWidth + marginLeft + marginRight)
            .attr("height", canvasWidth + marginTop + marginBottom);

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
            .attr("transform", `translate(${marginLeft}, ${marginTop})`);

        const x = d3.scaleLinear().range([0, canvasWidth]);
        const y = d3.scaleLinear().range([canvasWidth, 0]);

        x.domain([-8, 8]);
        y.domain([-8, 8]);

        graph.append("g")
            .attr("class", `axis`)
            .attr("transform", `translate(0,${canvasWidth})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())));

        graph.append("g")
            .attr("class", `axis`)
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())));

        graph.append("g")
            .attr("class", `axis`)
            .attr("transform", `translate(${canvasWidth},0)`)
            .call(d3.axisRight(y).tickValues([0].concat(y.ticks())));

        graph.append("g")
            .attr("class", `axis`)
            .call(d3.axisTop(x).tickValues([0].concat(x.ticks())));

        let xAxisLabel = "X_1";
        let yAxisLabel = "X_2";

        let xAxisText = graph.append("text")
            .attr("class", `axis`)
            .attr("x", canvasWidth / 2)
            .attr("y", canvasWidth + marginBottom - 7)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "bottom");

        addFormattedText(xAxisLabel, xAxisText);

        let yAxisText = graph.append("text")
            .attr("class", `axis`)
            .attr("y", canvasWidth / 2)
            .attr("x", -marginLeft)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")


        addFormattedText(yAxisLabel, yAxisText);

        const outOfBoundsFilter = (p: Datapoint2D) => {
            return p.x1 >= x.domain()[0] && p.x1 <= x.domain()[1]
                && p.x2 >= y.domain()[0] && p.x2 <= y.domain()[1];
        }

        let filteredTrainingData = trainingData.filter(outOfBoundsFilter);
        let filteredTestData = testData.filter(outOfBoundsFilter);


        graph.selectAll(`.circle.train`)
            .data(filteredTrainingData)
            .enter().append("circle")
            .attr("class", `circle train`)
            .attr("r", scale / 7)
            .attr("fill", function (datapoint: Datapoint2D): string {
                let colour = "black";
                if (datapoint.y === 1) colour = maxColour;
                if (datapoint.y === -1) colour = minColour;

                return colour;
            })
            .style("stroke", "black")
            .attr("cx", (datapoint: Datapoint2D) => (datapoint.x1 * scale) + (canvasWidth / 2))
            .attr("cy", (datapoint: Datapoint2D) => -(datapoint.x2 * scale) + (canvasWidth / 2));

        if (showTestData) {
            graph.selectAll(`.circle.test`)
                .data(filteredTestData)
                .enter().append("circle")
                .attr("class", `circle test`)
                .attr("r", scale / 7)
                .attr("fill", function (datapoint: Datapoint2D): string {
                    let colour = "black";
                    if (datapoint.y === 1) colour = maxColour;
                    if (datapoint.y === -1) colour = minColour;
                    return colour;
                })
                .attr("fill-opacity", 0.5)
                .style("stroke", "black")
                .style("stroke-opacity", 0.5)
                .attr("cx", (datapoint: Datapoint2D) => (datapoint.x1 * scale) + (canvasWidth / 2))
                .attr("cy", (datapoint: Datapoint2D) => -(datapoint.x2 * scale) + (canvasWidth / 2));
        }

    }

    return (
        <>
            <div style={{ position: "relative" }}>
                <svg
                    ref={d3Container}
                    width={canvasWidth + marginLeft + marginRight}
                    height={canvasWidth + marginTop + marginBottom}
                    style={{ position: "absolute" }}
                />
                <DecisionBoundaryCanvas
                    width={canvasWidth}
                    height={canvasWidth}
                    numCells={numCells}
                    paddingLeft={marginLeft}
                    paddingRight={marginRight}
                    paddingTop={marginTop}
                    paddingBottom={marginBottom}
                    disabled={false}
                    padding={true}
                    decisionBoundary={decisionBoundary}
                    discreetBoundary={discreetBoundary}
                    domain={domain}
                />
            </div>
        </>
    );
}

export default NNGraph;