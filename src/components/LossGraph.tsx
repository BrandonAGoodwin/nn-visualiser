import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Dataset2D } from '../datasets';
import BackgroundCanvas from './BackgroundCanvas';

export type LossData = {
    epoch: number;
    trainingLoss: number;
}

interface GraphProps {
    dataset: [number, number][];
    width: number;
    height: number;
    margin: number;
    // xDomain: number[];
    // yDomain: number[];
}


function LossGraph(props: GraphProps) {

    const d3Container: any = useRef<any>(null);
    const [initialised, setInitialised] = useState<boolean>(false);

    let scale = props.width / 16;


    const init = () => {
        // console.log("LossGraph init")

        createGraph();
        setInitialised(true);
    }

    useEffect(() => {
        init()
    }, []);


    useEffect(() => {
        if (!initialised) {
            init()
        } else {
            updateGraph()

        }
    }, [props.dataset]);


    const createGraph = () => {
        // console.log("Creating loss graph")

        let svg = d3.select(d3Container.currnet)

        svg.attr('width', props.width + props.margin * 2)
            .attr('height', props.height + props.margin * 2)

    }

    const updateGraph = () => {
        // console.log("Updating loss graph")
        // console.log(props.dataset)
        const svg = d3.select(d3Container.current)

        svg.selectAll(`.loss-graph`).remove();

        const graph = svg.append('g')
            .attr("class", `loss-graph`)
            .attr('transform', `translate(${props.margin}, ${props.margin})`);

        const x = d3.scaleLinear()
            .range([0, props.width])
            .domain([1, props.dataset.length]);

        let minY = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        
        props.dataset.forEach((d: [number, number]) => {
            let y = d[1];
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        })

        const y = d3.scaleLinear()
            .range([props.height, 0])
            .domain([minY, maxY]);

        // graph.append('g')
        //     .attr("class", `axis`)
        //     .attr('transform', `translate(0,${props.height})`)
        //     .call(d3.axisBottom(x));

        // graph.append('g')
        //     .attr("class", `axis`)
        //     .call(d3.axisLeft(y));

        
        let index = 1;
        graph.append("path")
            .datum(props.dataset)
            .attr("fill", "none")
            .attr("stroke", "#606060")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x((d: [number, number]) => x(d[0]) || 0)
                .y((d: [number, number]) => y(d[1]) || 0))

        // graph.selectAll(`.circle`)
        //     .data(props.dataset)
        //     .enter().append('circle')
        //     .attr('class', `circle`)
        //     .attr("r", scale / 7)
        //     .attr("fill", function (datapoint: Dataset2D): string {
        //         let colour = "black";
        //         if (datapoint.y === 1) colour = "#223781";
        //         if (datapoint.y === -1) colour = "#ff7661";

        //         return colour;
        //     })
        //     .style("stroke", "black")
        //     .attr("cx", (datapoint: Dataset2D) => (datapoint.x1 * scale) + (props.canvasWidth / 2))
        //     .attr("cy", (datapoint: Dataset2D) => -(datapoint.x2 * scale) + (props.canvasWidth / 2));

    }

    return (
                <svg
                    ref={d3Container}
                    width={props.width + props.margin * 2}
                    height={props.height + props.margin * 2}
                    //style={{ position: "absolute" }}
                />
    );
}

export default LossGraph;