import * as d3 from "d3";
import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../contexts/ThemeContext";


interface DecisionBoundaryCanvasProps {
    id?: string;
    width: number;
    height: number;
    numCells: number;
    numShades?: number;
    padding: boolean;
    decisionBoundary?: number[];
    discreetBoundary: boolean;
    disabled: boolean;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    domain: [number, number];
}


function DecisionBoundaryCanvas(props: DecisionBoundaryCanvasProps) {
    const {minColour, midColour, maxColour} = useContext(ThemeContext);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        updateCanvas();
    }, [props.decisionBoundary, props.discreetBoundary]);
    
    const updateCanvas = () => {

        let start = Date.now();

        let tmpScale = d3.scaleLinear<string, number>()
            .domain([0, 0.5, 1])
            .range(props.disabled ? ["#606060", "#FFFFFF", "#202020" ] : [minColour, midColour, maxColour])
            .clamp(true);

        let numShades = props.numShades || 100;

        let colors = d3.range(0, 1 + 1E-9, 1 / numShades).map(a => {
            return tmpScale(a) || 0;
        });

        let color: any = d3.scaleQuantize()
            .domain(props.domain)
            .range(colors);

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if(!props.decisionBoundary || !context) return;
        let imageData = context.createImageData(props.numCells, props.numCells);

        if(!imageData) return;

        const data = imageData.data;
        let iter = -1;

        let lowerBound = props.domain[0];
        let upperBound = props.domain[1];

        for(let i = 0; i < props.decisionBoundary.length; i++) {
            let value: number = props.decisionBoundary[i];
            if(props.discreetBoundary) value = value > (lowerBound + upperBound) / 2 ? props.domain[1] : props.domain[0];
            let c = d3.rgb(color(value));
            data[++iter] = c.r;
            data[++iter] = c.g;
            data[++iter] = c.b;
            data[++iter] = 200;
        }
        context.putImageData(imageData, 0, 0);

        let delta = Date.now() - start;
        //console.log(`Finsihed updating canvas (Duration: ${delta}ms)`);
    };

    return (
        <canvas
            ref={canvasRef}
            id={props.id}
            className="background"
            width={props.numCells}
            height={props.numCells}
            style={{
                width: `${props.width}px`,
                height: `${props.height}px`,
                paddingLeft: `${props.padding && props.paddingLeft ? props.paddingLeft : "0"}px`,
                paddingRight: `${props.padding && props.paddingRight ? props.paddingRight : "0"}px`,
                paddingTop: `${props.padding && props.paddingTop ? props.paddingTop: "0"}px`,
                paddingBottom: `${props.padding && props.paddingBottom ? props.paddingBottom : "0"}px`,
            }}
        />);
}

export default DecisionBoundaryCanvas;