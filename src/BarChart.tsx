import React, { Component, createRef } from 'react'
import * as d3 from 'd3'
import * as vis from './visControl'
import { Dataset2D } from './datasets';

class BarChart extends Component {
    
    //private f: void = vis.run();

    private gausData = vis.get2GaussDist();

    private canvas = createRef<HTMLDivElement>();

    componentDidMount() {
        this.drawChart(this.gausData)
        this.test();
    }

    drawChart(data : Dataset2D[]) {
        const canvasHeight = 400
        const canvasWidth = 600
        const scale = 20
        const svgCanvas = d3.select(this.canvas.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .style("border", "1px solid black")
        svgCanvas.selectAll(".circle")
            .data(data)
            .enter().append('circle')
            .attr('class','circle')
            .attr("r", 5)
            .attr("fill", function(datapoint: Dataset2D): string {
                    let color = "black";
                    if(datapoint.label === -1) color = "orange";
                    if(datapoint.label === 1) color = "blue";
                    
                    return color;
                })
                .attr("cx", (datapoint : Dataset2D) => (datapoint.x * scale) + (canvasWidth/2))
                .attr("cy", (datapoint : Dataset2D) => (datapoint.y * scale) + (canvasHeight/2))
        }
    
    test() {
        
    }

    render() { return <div ref={this.canvas}></div> }
}
export default BarChart