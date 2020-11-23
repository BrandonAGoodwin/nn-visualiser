import styled from "@emotion/styled";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface CanvasProps {
    width: number;
    height: number;
    numCells: number;
    numShades?: number;
    decisionBoundary?: number[];
    discreetBoundary: boolean;
}


const CustomCanvas = styled.canvas`
    width: ${(props: CanvasProps) => props.numCells};
    height: ${(props: CanvasProps) => props.numCells};
`

function BackgroundCanvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        init()
        
    }, []);

    const init = () => {

    }

    useEffect(() => {
        console.log(`BackgroundCanvas decisionBoundary useEffect`);
        updateCanvas()
    }, [props.decisionBoundary, props.discreetBoundary])
    
    const updateCanvas = () => {

        console.log("Update canvas");

        let start = Date.now();

        let tmpScale = d3.scaleLinear<string, number>()
            .domain([0, 0.5, 1])
            .range(["#621fa2", "#FFFFFF", "#fbfb39"])
            .clamp(true);

        let numShades = props.numShades || 100;

        let colors = d3.range(0, 1 + 1E-9, 1 / numShades).map(a => {
            return tmpScale(a) || 0;
        });

        let color: any = d3.scaleQuantize()
            .domain([-1, 1])
            .range(colors);

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if(!props.decisionBoundary || !context) return
        let imageData = context.createImageData(props.numCells, props.numCells);

        if(!imageData) return;

        const data = imageData.data;
        let iter = -1;
        for(let i = 0; i < props.decisionBoundary.length; i++) {
            let value: number = props.decisionBoundary[i];
            if(props.discreetBoundary) value = value > 0 ? 1 : -1;
            let c = d3.rgb(color(value))
            data[++iter] = c.r;
            data[++iter] = c.g;
            data[++iter] = c.b;
            data[++iter] = 200;
        }
        context.putImageData(imageData, 0, 0);

        let delta = Date.now() - start;
        console.log(`Finsihed updating canvas (Duration: ${delta}ms)`);
    }

    return (
        <canvas
            ref={canvasRef}
            id={`${props.width}`}
            className="background"
            width={props.numCells}
            height={props.numCells}
            style={{
                width: `${props.width}px`,
                height: `${props.height}px`,
                padding: "20px"
            }}
        />);
}

export default BackgroundCanvas;