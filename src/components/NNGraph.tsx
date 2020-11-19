import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import { Dataset2D } from '../datasets';

type GraphProps = {
    container?: any,
    dataset: Dataset2D[],
    density: number,
    canvasWidth: number;
    //canvasHeight: number;
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
    const d3Container: any = useRef<any>(null);
    //const graph: any = d3.select(graphRef.current).append("svg")
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
    let scale = props.canvasWidth / 16
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

    // useEffect(() => {
    //     if(props.dataset && d3Container.current) {
            
    //     }
    // })

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
        //graph = d3.select(".graph")

        //if(!graph) return;
        //d3.select(graph)
        //let graph = d3.select(`#${props.id}`)
        // console.log(graph)
        //if(!graph) return;

        let svg = d3.select(d3Container.currnet)

        //let graph = svg.append("g")

        svg.attr('width', props.canvasWidth + props.margin * 2)
        .attr('height', props.canvasWidth + props.margin * 2)

        // let graph = svg
        // .append('g')
        // .attr('transform', `translate(${props.margin}, ${props.margin})`);
        // console.log(graph)
    }

    const updateGraph = () => {
        console.log("Updating graph")
        //if(!graph) return;
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

        const svg = d3.select(d3Container.current)

        const graph = svg.append('g')
            .attr('transform', `translate(${props.margin}, ${props.margin})`)

        svg.selectAll(`.circle`).remove();
        svg.selectAll(`.rect`).remove();
        svg.selectAll(`.axis`).remove();

        const x = d3.scaleLinear().range([0, props.canvasWidth])
        const y = d3.scaleLinear().range([props.canvasWidth, 0])

        x.domain([-8, 8])
        y.domain([-8, 8])

        graph.append('g')
            .attr("class", `axis`)
            .attr('transform', `translate(0,${props.canvasWidth})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())))

        graph.append('g')
            .attr("class", `axis`)
            //.attr('transform', `translate(0,0)`)
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())))

        props.decisionBoundary && updateBackground(graph, props.decisionBoundary, false)

        graph.selectAll(`.circle`)
            .data(props.dataset)
            .enter().append('circle')
            .attr('class', `circle`)
            .attr("r", scale / 3)
            .attr("fill", function (datapoint: Dataset2D): string {
                let colour = "black";
                if (datapoint.y === 1) colour = "#621fa2";
                //if(datapoint.y === -1) color = "#F50000";//"#fbfb39";
                if (datapoint.y === -1) colour = "#fbfb39";

                return colour;
            })
            .style("stroke", "black")
            .attr("cx", (datapoint: Dataset2D) => (datapoint.x1 * scale) + (props.canvasWidth / 2))
            .attr("cy", (datapoint: Dataset2D) => -(datapoint.x2 * scale) + (props.canvasWidth / 2))
        
        //graph.exit().exit().remove()

    }

    const updateBackground = (graph: any/*  d3.Selection<SVGGElement | null, unknown, null, undefined> */, data: Dataset2D[], discretize: boolean): void => {
        console.log("Update background")
        //graph.selectAll("rect").remove()

        let start = Date.now();

        let cellWidth = (props.canvasWidth / (props.numCells)) // this.scale
        let cellHeight = cellWidth

        console.log(data)

        let tmpScale = d3.scaleLinear<string, number>()
            .domain([0, 0.5, 1])
            .range(["#fbfb397F", "#FFFFFF7F", "#621fa27F"])
            .clamp(true);

        let numShades = 20;

        let colors = d3.range(0, 1 + 1E-9, 1 / numShades).map(a => {
            return tmpScale(a) || 0;
        });

        let color = d3.scaleQuantize()
            .domain([-1, 1])
            .range(colors);

        let halfCanvasWidth = props.canvasWidth / 2;

        graph.selectAll(`.rect`)
            .data(data)
            .enter().append("rect")
            .attr("class", `rect`)
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
            <div>
                <svg
                    className="graph"
                    ref={d3Container}
                    width={props.canvasWidth + props.margin * 2}
                    height={props.canvasWidth + props.margin * 2}
                />
            </div>
           {/*  <div ref={() => (graphRef)}/> */}
            {/* <div><canvas className="canvas"/></div> */}
        </>
    );
}
export default NNGraph