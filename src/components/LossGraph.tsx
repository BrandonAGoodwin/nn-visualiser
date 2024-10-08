import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { AnalyticsData, LossData } from '../NetworkController';
import styled from '@emotion/styled';


const Tooltip = styled("div")`
    position: absolute;			
    text-align: center;			
    width: 60px;					
    height: 28px;					
    padding: 2px;				
    font: 12px sans-serif;		
    background: lightsteelblue;	
    border: 0px;		
    border-radius: 8px;			
    pointer-events: none;	
`

interface GraphProps {
    analyticsData: AnalyticsData;
    comparisonAnalyticsData?: AnalyticsData;
    width: number;
    height: number;
    margin: number;
    showTestData?: boolean;
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
        updateGraphs();
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
    }, [analyticsData, comparisonAnalyticsData, showTestData]);


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
        label: string
    ) => {

        let path = graph.append("path")
            .datum(lossData)
            .attr("fill", "none")
            .attr("stroke", colour)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x((d: [number, number]) => x(d[0]) || 0)
                .y((d: [number, number]) => y(d[1]) || 0))

    }

    const updateGraphs = () => {
        console.log("Updating loss graph")
        const { trainingLossData, testLossData, epochs } = analyticsData;
        const compTrainingLossData = comparisonAnalyticsData?.trainingLossData;
        const compTestLossData = comparisonAnalyticsData?.testLossData;
        const compEpochs = comparisonAnalyticsData?.epochs;

        const svg = d3.select(d3Container.current);

        svg.selectAll(`.loss-graph`).remove();
        d3.select("body").selectAll(`.loss-graph.tooltip`).remove();


        const graph = svg.append('g')
            .attr("class", `loss-graph`)
            .attr("width", props.width)
            .attr("height", props.height)
            .attr('transform', `translate(${props.margin}, ${props.margin})`);


        const lossDatasets = [trainingLossData];
        props.showTestData && lossDatasets.push(testLossData);
        compTrainingLossData && lossDatasets.push(compTrainingLossData);
        props.showTestData && compTestLossData && lossDatasets.push(compTestLossData);

        const x = d3.scaleLinear()
            .range([0, props.width])
            .domain([1, Math.max(epochs, compEpochs || 0)]); 

        const y = d3.scaleLinear()
            .range([props.height, 0])
            .domain([0, (getBounds(lossDatasets))[1]]);

        graph.append('g')
            .attr("class", `axis`)
            .attr('transform', `translate(0,${props.height})`)
            .call(d3.axisBottom(x));

        graph.append('g')
            .attr("class", `axis`)
            .call(d3.axisLeft(y));

        // Draw training loss data
        drawGraph(trainingLossData, "#606060", graph, x, y, "Training loss");

        // Draw test loss data
        showTestData && drawGraph(testLossData, "blue", graph, x, y, "Test loss");

        // Draw saved/comparison training loss data
        compTrainingLossData && drawGraph(compTrainingLossData, "red", graph, x, y, "Saved training loss");

        // Draw saved/comparison test loss data
        showTestData && compTestLossData && drawGraph(compTestLossData, "green", graph, x, y, "Saved test loss");
    }

    return (
        <svg
            ref={d3Container}
            width={props.width + props.margin * 2}
            height={props.height + props.margin * 2}
        />
    );
}

export default LossGraph;