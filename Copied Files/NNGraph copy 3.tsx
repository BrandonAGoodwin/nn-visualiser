import React, { createRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Dataset2D } from '../datasets';

type GraphProps = {
    container: any,
    dataset: Dataset2D[],
    density: number,
    canvasWidth: number;
    canvasHeight: number;
    margin: number,
    numCells: number;
    xDomain: number[];
    yDomain: number[];
    decisionBoundary?: Dataset2D[];
}

// type GraphState = {
//     decisionBoundary: Dataset2D[]
//     graph: d3.Selection<SVGGElement, unknown, null, undefined>
// }

//let graph: any;
let initialised = false;

//
//
//
//
//
//  Use containers to implent SVGs again
//
//
//
//
//


function NNGraph (props: GraphProps): JSX.Element {

    //const [graph, setGraph] = useState<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();
    const graphRef = createRef<SVGGElement>()
    const graph = d3.select(graphRef.current)
    const [initialised, setInitialised] = useState<boolean>(false);
    //let id = `graph-${props.id}`
    //let noSamples = 30
    //let gausData = vis.get2GaussDist(noSamples)
    //let network = vis.start([2, 2, 1], vis.generateInputIds())

    //let initalised = false;

    // let DENSITY = 100
    //let margin = props.margin
    //let canvasWidth = 640
    //let canvasHeight = props.canvasWidth
    let scale = props.canvasHeight / 16
    // let xCentre = canvasWidth / 2 + margin
    // let yCentre = canvasHeight / 2 + margin
    //let graph: any;
    
    // Use effect watches for change in the decision boundary then calls updatebackground
    //  Delete all d3 objects that are updated, can be done by using the classing

    const init = () => {
        console.log("NNGraph init")
        // graph = d3.select(container.current)
        // .append("svg")
        // .attr("width", canvasWidth + margin * 2)
        // .attr("height", canvasHeight + margin * 2)
        // //.style("border", "1px solid black")
        // .append('g')
        // .attr('transform', `translate(${margin}, ${margin})`)
        //setDecisionBoundary(props.decisionBoundary || []);
        createGraph();
        setInitialised(true);
    }

    useEffect(() => {
        console.log("NNGraph inital useEffect")
        init()
    }, [])

    useEffect(() => {
        console.log("props and props.decisionboundary NNGraph useEffect")
        if(!initialised) {
            init()
        } else {
            updateGraph()
            //updateBackground(graph, props.decisionBoundary, false)
        }
    }, [props, props.decisionBoundary])

    //const [decisionBoundary, setDecisionBoundary] = useState<Dataset2D[]>([])

    const createGraph = () => {
        console.log("Creating graph")
        //let g: d3.Selection<SVGGElement, unknown, HTMLElement, any> = d3.select(`.${props.id}`);
        //setGraph(g)
        if(!graph) return;
        //d3.select(graph)
        //let graph = d3.select(`#${props.id}`)
        console.log(graph)
        //if(!graph) return;
        graph.attr('width', props.canvasWidth + props.margin * 2)
        .attr('height', props.canvasWidth + props.margin * 2)
        .append('g')
        .attr('transform', `translate(${props.margin}, ${props.margin})`);
    }

    const updateGraph = () => {
        console.log("Updating graph")
        if(!graph) return;
        // const DENSITY = 100;
        // const margin = 20;
        // const canvasHeight = 640;
        // const canvasWidth = canvasHeight;
        // const scale = canvasHeight / 16;
        // const xCentre = canvasWidth / 2 + margin;
        // const yCentre = canvasHeight / 2 + margin
        // const graph = d3.select(container.current)
        //     .append("svg")
        //     .attr("width", canvasWidth + margin * 2)
        //     .attr("height", canvasHeight + margin * 2)
        //     //.style("border", "1px solid black")
        //     .append('g')
        //     .attr('transform', `translate(${margin}, ${margin})`)

        d3.selectAll(`.circle-${props.id}`).remove();
        d3.selectAll(`.rect-${props.id}`).remove();
        d3.selectAll(`.axis-${props.id}`).remove();
        // d3.selectAll(".circle").remove();
        // d3.selectAll(".circle").remove();


        const x = d3.scaleLinear().range([0, props.canvasWidth])
        const y = d3.scaleLinear().range([props.canvasHeight, 0])

        x.domain([-8, 8])
        y.domain([-8, 8])

        graph.append('g')
            .attr("class", `axis-${props.id}`)
            .attr('transform', `translate(0,${props.canvasHeight})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())))

        graph.append('g')
            .attr("class", `axis-${props.id}`)
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())))

        props.decisionBoundary && updateBackground(graph, props.decisionBoundary, false)

        graph.selectAll(`.circle-${props.id}`)
            .data(props.dataset)
            .enter().append('circle')
            .attr('class', `circle-${props.id}`)
            .attr("r", 5)
            .attr("fill", function (datapoint: Dataset2D): string {
                let colour = "black";
                if (datapoint.y === 1) colour = "#621fa2";
                //if(datapoint.y === -1) color = "#F50000";//"#fbfb39";
                if (datapoint.y === -1) colour = "#fbfb39";

                return colour;
            })
            .style("stroke", "white")
            .attr("cx", (datapoint: Dataset2D) => (datapoint.x1 * scale) + (props.canvasWidth / 2) + props.margin)
            .attr("cy", (datapoint: Dataset2D) => -(datapoint.x2 * scale) + (props.canvasHeight / 2) + props.margin)


    }

    const updateBackground = (graph: d3.Selection<SVGGElement | null, unknown, null, undefined>, data: Dataset2D[], discretize: boolean): void => {
        console.log("Update background")
        //graph.selectAll("rect").remove()

        let start = Date.now();

        let cellWidth = (props.canvasWidth / (props.numCells)) // this.scale
        let cellHeight = cellWidth

        console.log(data)

        let tmpScale = d3.scaleLinear<string, number>()
            .domain([0, 0.5, 1])
            .range(["#fbfb39", "#FFFFFF", "#621fa2"])
            .clamp(true);

        let numShades = 20;

        let colors = d3.range(0, 1 + 1E-9, 1 / numShades).map(a => {
            return tmpScale(a) || 0;
        });

        let color = d3.scaleQuantize()
            .domain([-1, 1])
            .range(colors);

        let halfCanvasWidth = props.canvasWidth / 2;

        graph.selectAll(`.rect-${props.id}`)
            .data(data)
            .enter().append("rect")
            .attr("class", `rect-${props.id}`)
            .attr("x", (datapoint: Dataset2D) => (datapoint.x1 * scale) + halfCanvasWidth)
            .attr("y", (datapoint: Dataset2D) => -(datapoint.x2 * scale) + halfCanvasWidth) // Note will probably need to be flipped
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .attr("fill", (datapoint: Dataset2D) => {
                let value = datapoint.y < 0 ? -1 : 1
                return color(value) || "#FF0000"
            })
        
        let delta = Date.now() - start;
        console.log(`Finsihed updating background (Duration: ${delta}ms)`)

    }


    // test() {
    //     console.log(vis.getCost(this.network, this.gausData))
    //     for (let i = 0; i < 1000; i++) {
    //         //console.log("Step")
    //         vis.step(this.network, this.gausData);
    //     }
    //     console.log(this.network)
    //     console.log(vis.getCost(this.network, this.gausData))
    // }

    //drawChart();

    return (
        //<div ref={container} />
        <>
            <div><svg className="graph"/></div>
            <div><canvas className="canvas"/></div>
        </>
    );
}
export default NNGraph