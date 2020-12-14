import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Dataset2D } from '../datasets';
import BackgroundCanvas from './BackgroundCanvas';


type GraphProps = {
    dataset: Dataset2D[],
    density: number,
    canvasWidth: number;

    margin: number,
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
        console.log("Creating graph")

        let svg = d3.select(d3Container.currnet)

        svg.attr('width', props.canvasWidth + props.margin * 2)
            .attr('height', props.canvasWidth + props.margin * 2)

    }

    const updateGraph = () => {
        console.log("Updating graph")

        const svg = d3.select(d3Container.current)

        svg.selectAll(`.graph`).remove();

        const graph = svg.append('g')
            .attr("class", "graph")
            .attr('transform', `translate(${props.margin}, ${props.margin})`);

        const x = d3.scaleLinear().range([0, props.canvasWidth]);
        const y = d3.scaleLinear().range([props.canvasWidth, 0]);

        x.domain([-8, 8]);
        y.domain([-8, 8]);

        graph.append('g')
            .attr("class", `axis`)
            .attr('transform', `translate(0,${props.canvasWidth})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())));

        graph.append('g')
            .attr("class", `axis`)
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())));

        graph.append('g')
            .attr("class", `axis`)
            .attr('transform', `translate(${props.canvasWidth},0)`)
            .call(d3.axisRight(y).tickValues([0].concat(y.ticks())));

        graph.append('g')
            .attr("class", `axis`)
            .call(d3.axisTop(x).tickValues([0].concat(x.ticks())));

        graph.selectAll(`.circle`)
            .data(props.dataset)
            .enter().append('circle')
            .attr('class', `circle`)
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
            <div>
                <svg
                    ref={d3Container}
                    width={props.canvasWidth + props.margin * 2}
                    height={props.canvasWidth + props.margin * 2}
                    style={{ position: "absolute" }}
                />
                <BackgroundCanvas
                    width={props.canvasWidth}
                    height={props.canvasWidth}
                    numCells={props.numCells}
                    padding={true}
                    decisionBoundary={props.decisionBoundary}
                    discreetBoundary={props.discreetBoundary}
                />
            </div>
        </>
    );
}

export default NNGraph;