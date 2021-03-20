import * as  d3 from "d3";
import React, { useEffect, useRef, useState } from "react";

interface ColourScaleProps {
    width: number;
    height: number;
    minColour: string;
    midColour: string;
    maxColour: string;
    minValue: number;
    midValue: number;
    maxValue: number;
    numShades: number;
    horizontal: boolean;
}

function ColourScale(props: ColourScaleProps) {

    const d3ContainerRef: any = useRef<any>(null);
    const canvasRef: any = useRef<any>(null);

    const marginTop = 4;
    const marginLeft = props.horizontal ? 8 : 20;
    const marginBottom = props.horizontal ? 20 : 4;
    const marginRight = 8;

    useEffect(() => {
        createScale();
    }, [])

    const createScale = () => {
        const svg = d3.select(d3ContainerRef.current)
            .attr("width", props.width + marginLeft + marginRight)
            .attr("height", props.height + marginBottom + marginTop);

        svg.selectAll("*").remove();

        const scale = d3.scaleLinear()
            .domain([-1, 1])
            .range(props.horizontal ? [0, props.width -1] : [props.height -1, 0]);

        const colourScale = svg.append("g")
            .attr("transform", `translate(${marginLeft}, ${marginTop})`);

        colourScale.append("g")
            .attr("transform", `translate(0,${props.horizontal ? props.height : 0})`)
            .call((props.horizontal ? d3.axisBottom(scale) : d3.axisLeft(scale)).tickValues([0].concat(scale.ticks(2))).tickSize(3));

        let tmpScale = d3.scaleLinear<string, number>()
            .domain([0, 0.5, 1])
            .range([props.minColour, props.midColour, props.maxColour])
            .clamp(true);

        let numShades = props.numShades || 100;

        let colors = d3.range(0, 1 + 1E-9, 1 / numShades).map(a => {
            return tmpScale(a) || 0;
        });

        let color: any = d3.scaleQuantize()
            .domain(props.horizontal ? [0,props.width] : [0, props.height])
            .range(colors);

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context) return;
        let imageWidth = props.horizontal ? props.width : 1;
        let imageHeight = props.horizontal ? 1 : props.height;
        let imageData = context.createImageData(imageWidth, imageHeight);

        if (!imageData) return;

        const data = imageData.data;
        let iter = -1;

        for (let i = (props.horizontal ? 0 : props.height); props.horizontal ? i <= props.width : i >= 0; props.horizontal ? i++ : i--) {
            // let value: number = props.decisionBoundary[i];
            // if(props.discreetBoundary) value = value > 0 ? 1 : -1;
            let c = d3.rgb(color(i));
            data[++iter] = c.r;
            data[++iter] = c.g;
            data[++iter] = c.b;
            data[++iter] = 200;
        }
        context.putImageData(imageData, 0, 0);

        colourScale.select(".domain")
            .attr("opacity", "0");
        
        // let delta = Date.now() - start;
    }


    return (
        <div style={{ position: "relative" }}>
            <svg
                ref={d3ContainerRef}
                width={props.width + marginLeft}
                height={props.height + marginBottom + marginTop}
                style={{ position: "absolute" }}
            />
            <canvas
                ref={canvasRef}
                // id={props.id}
                // className="background"
                width={props.horizontal ? props.width : 1}
                height={props.horizontal ? 1 : props.height}
                style={{
                    width: `${props.width}px`,
                    height: `${props.height}px`,
                    paddingLeft: `${marginLeft}px`,
                    paddingTop: `${marginTop}px`,
                    paddingRight: `${marginRight}px`,
                    paddingBottom: `${marginBottom}px`,
                    // paddingRight: `${props.padding && props.paddingRight ? props.paddingRight : "0"}px`,
                    // paddingTop: `${props.padding && props.paddingTop ? props.paddingTop: "0"}px`,
                    // paddingBottom: `${props.padding && props.paddingBottom ? props.paddingBottom : "0"}px`,
                }}
            />
        </div>
    );
}

export default ColourScale;