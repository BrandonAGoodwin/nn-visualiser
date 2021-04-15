import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Datapoint2D } from '../datasets';
import BackgroundCanvas from './BackgroundCanvas';
import { AnalyticsData, LossData } from '../NetworkController';

// export type LossData = {
//     epoch: number;
//     trainingLoss: number;
// }

interface GraphProps {
    // dataset: LossData[];
    // comparisionDataset?: LossData[];
    analyticsData: AnalyticsData;
    comparisonAnalyticsData?: AnalyticsData;
    width: number;
    height: number;
    margin: number;
    showTestData?: boolean;
    // xDomain: number[];
    // yDomain: number[];
}

function getBounds(lossDatasets: LossData[][]) {
    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;
    let lossData: LossData[];
    for (lossData of lossDatasets) {
        lossData.forEach((d: LossData) => {
            let y = d[1];
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });
    }
    return [minY, maxY]
}

function LossGraph(props: GraphProps) {

    const {
        analyticsData,
        comparisonAnalyticsData,
        showTestData
    } = props;
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
            updateGraphs()

        }
    }, [props]);


    const createGraph = () => {
        // console.log("Creating loss graph")

        let svg = d3.select(d3Container.currnet)

        svg.attr('width', props.width + props.margin * 2)
            .attr('height', props.height + props.margin * 2)

    }

    const drawGraph = (
        lossData: LossData[],
        colour: string,
        graph: any,
        x: d3.ScaleLinear<number, number>,
        y: d3.ScaleLinear<number, number>,
        // bounds: { minY: number, maxY: number }
    ) => {

        // const graph = svg.append('g')
        //     .attr("class", `loss-graph`)
        //     .attr('transform', `translate(${props.margin}, ${props.margin})`);

        // const x = d3.scaleLinear()
        //     .range([0, props.width])
        //     .domain([1, Math.max(props.dataset.length, props.comparisionDataset?.length || 0)]);

        // const x = d3.scaleLinear()
        //     .range([0, props.width])
        //     .domain([1, Math.max(epochs, compEpochs || 0)]); // Maybe domain should start from 0 if we get initial loss

        // let minY = Number.MAX_VALUE;
        // let maxY = Number.MIN_VALUE;

        // props.dataset.forEach((d: LossData) => {
        //     let y = d[1];
        //     minY = Math.min(minY, y);
        //     maxY = Math.max(maxY, y);
        // });

        // lossData.forEach((d: LossData) => {
        //     let y = d[1];
        //     minY = Math.min(minY, y);
        //     maxY = Math.max(maxY, y);
        // });

        // if (props.comparisionDataset) {
        //     props.comparisionDataset.forEach((d: LossData) => {
        //         let y = d[1];
        //         minY = Math.min(minY, y);
        //         maxY = Math.max(maxY, y);
        //     });
        // }

        // if (props.analyticsData.) {
        //     props.comparisionDataset.forEach((d: LossData) => {
        //         let y = d[1];
        //         minY = Math.min(minY, y);
        //         maxY = Math.max(maxY, y);
        //     });
        // }

        // const y = d3.scaleLinear()
        //     .range([props.height, 0])
        //     .domain([minY, maxY]);

        // graph.append('g')
        //     .attr("class", `axis`)
        //     .attr('transform', `translate(0,${props.height})`)
        //     .call(d3.axisBottom(x));

        // graph.append('g')
        //     .attr("class", `axis`)
        //     .call(d3.axisLeft(y));


        // let index = 1;
        graph.append("path")
            .datum(lossData)
            .attr("fill", "none")
            .attr("stroke", colour)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x((d: [number, number]) => x(d[0]) || 0)
                .y((d: [number, number]) => y(d[1]) || 0))

        // if (props.comparisionDataset) {
        //     graph.append("path")
        //         .datum(props.comparisionDataset)
        //         .attr("fill", "none")
        //         .attr("stroke", "red")
        //         .attr("stroke-width", 1.5)
        //         .attr("d", d3.line()
        //             .x((d: [number, number]) => x(d[0]) || 0)
        //             .y((d: [number, number]) => y(d[1]) || 0))
        // }
    }

    const updateGraphs = () => {
        console.log("Updating loss graph")
        const { trainingLossData, testLossData, epochs } = analyticsData;
        const compTrainingLossData = comparisonAnalyticsData?.trainingLossData;
        const compTestLossData = comparisonAnalyticsData?.testLossData;
        const compEpochs = comparisonAnalyticsData?.epochs;
        console.log(trainingLossData)
        const svg = d3.select(d3Container.current)

        svg.selectAll(`.loss-graph`).remove();

        const graph = svg.append('g')
            .attr("class", `loss-graph`)
            .attr("width", props.width)
            .attr("height", props.height)
            .attr('transform', `translate(${props.margin}, ${props.margin})`);

        // let minY = Number.MAX_VALUE;
        // let maxY = Number.MIN_VALUE;

        const lossDatasets = [trainingLossData];
        props.showTestData && lossDatasets.push(testLossData);
        compTrainingLossData && lossDatasets.push(compTrainingLossData);
        props.showTestData && compTestLossData && lossDatasets.push(compTestLossData);

        const x = d3.scaleLinear()
            .range([0, props.width])
            .domain([1, Math.max(epochs, compEpochs || 0)]); // Maybe domain should start from 0 if we get initial loss

        const y = d3.scaleLinear()
            .range([props.height, 0])
            .domain([0,(getBounds(lossDatasets))[1]]);

        // let bounds = { minY: Number.MAX_VALUE, maxY: Number.MIN_VALUE };

        graph.append('g')
            .attr("class", `axis`)
            .attr('transform', `translate(0,${props.height})`)
            .call(d3.axisBottom(x));

        graph.append('g')
            .attr("class", `axis`)
            .call(d3.axisLeft(y));

        drawGraph(trainingLossData, "#606060", graph, x, y);
        showTestData && drawGraph(testLossData, "blue", graph, x, y);
        compTrainingLossData && drawGraph(compTrainingLossData, "red", graph, x, y);
        // const x = d3.scaleLinear()
        //     .range([0, props.width])
        //     .domain([1, Math.max(props.dataset.length, props.comparisionDataset?.length || 0)]);

        // const x = d3.scaleLinear()
        //     .range([0, props.width])
        //     .domain([1, Math.max(epochs, compEpochs || 0)]); // Maybe domain should start from 0 if we get initial loss

        // let minY = Number.MAX_VALUE;
        // let maxY = Number.MIN_VALUE;

        // props.dataset.forEach((d: LossData) => {
        //     let y = d[1];
        //     minY = Math.min(minY, y);
        //     maxY = Math.max(maxY, y);
        // });

        // testD.forEach((d: LossData) => {
        //     let y = d[1];
        //     minY = Math.min(minY, y);
        //     maxY = Math.max(maxY, y);
        // });

        // if (props.comparisionDataset) {
        //     props.comparisionDataset.forEach((d: LossData) => {
        //         let y = d[1];
        //         minY = Math.min(minY, y);
        //         maxY = Math.max(maxY, y);
        //     });
        // }

        // if (props.analyticsData.) {
        //     props.comparisionDataset.forEach((d: LossData) => {
        //         let y = d[1];
        //         minY = Math.min(minY, y);
        //         maxY = Math.max(maxY, y);
        //     });
        // }



        // graph.append('g')
        //     .attr("class", `axis`)
        //     .attr('transform', `translate(0,${props.height})`)
        //     .call(d3.axisBottom(x));

        // graph.append('g')
        //     .attr("class", `axis`)
        //     .call(d3.axisLeft(y));


        // let index = 1;
        // graph.append("path")
        //     .datum(props.dataset)
        //     .attr("fill", "none")
        //     .attr("stroke", "#606060")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", d3.line()
        //         .x((d: LossData) => x(d[0]) || 0)
        //         .y((d: LossData) => y(d[1]) || 0))

        // if (props.comparisionDataset) {
        //     graph.append("path")
        //         .datum(props.comparisionDataset)
        //         .attr("fill", "none")
        //         .attr("stroke", "red")
        //         .attr("stroke-width", 1.5)
        //         .attr("d", d3.line()
        //             .x((d: [number, number]) => x(d[0]) || 0)
        //             .y((d: [number, number]) => y(d[1]) || 0))
        // }
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