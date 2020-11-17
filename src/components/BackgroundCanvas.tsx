import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { Dataset2D } from "../datasets";

type CanvasProps = {
    width: number;
    height: number;
    numCells: number;
    numShades?: number;
    decisionBoundary?: number[];
}

function BackgroundCanvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log("canvas")
        const context = canvas?.getContext("2d");

        if(context) {
            context.fillStyle = "#129c4c"
            context.fillRect(0, 0, props.width, props.height)
        }   
    }, []);

    useEffect(() => {
        updateCanvas()
    }, [props.decisionBoundary])
    
    const updateCanvas = () => {

        console.log("Update canvas")
        //graph.selectAll("rect").remove()

        let start = Date.now();

        // let cellWidth = (props.canvasWidth / (props.numCells)) // this.scale
        // let cellHeight = cellWidth

        // console.log(data)

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

        //let halfCanvasWidth = props.canvasWidth / 2;

        // graph.selectAll(`.rect`)
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("class", `rect`)
        //     .attr("x", (datapoint: Dataset2D) => (datapoint.x1 * scale) + halfCanvasWidth)
        //     .attr("y", (datapoint: Dataset2D) => -(datapoint.x2 * scale) + halfCanvasWidth) // Note will probably need to be flipped
        //     .attr("width", cellWidth)
        //     .attr("height", cellHeight)
        //     .attr("fill", (datapoint: Dataset2D) => {
        //         let value = datapoint.y < 0 ? -1 : 1
        //         return color(value) || "#FF0000"
        //     })
        
        


        const canvas = canvasRef.current;
        if(!props.decisionBoundary || !canvas) return
        const context = canvas.getContext("2d")
        let imageData = context?.createImageData(props.width, props.height)
        for(let i = 0; i < props.decisionBoundary.length; i++) {
            //let datapoint = props.decisionBoundary[i]
            let value: number = props.decisionBoundary[i];
            console.log(color(value))
            console.log(color(value)?.toLocaleString)
            //let c = d3.rgb(color(value))
        }
        let delta = Date.now() - start;
        console.log(`Finsihed updating canvas (Duration: ${delta}ms)`)
    }

    return (
        <canvas
            ref={canvasRef}
            width={props.width}
            height={props.height}
        />);
}

export default BackgroundCanvas;