import React, { useEffect, useRef } from "react";

type CanvasProps = {
    width: number;
    height: number;
    numCells: number;
    numShades?: number;
}

function BackgroundCanvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if(context) {
            context.fillStyle = "#129c4c"
            context.fillRect(0, 0, props.width, props.height)
        }   
    }, []);
    

    return (
        <canvas
            ref={canvasRef}
            width={props.width}
        />);
}

export default BackgroundCanvas;