import React, { Component, createRef } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {

    private canvas = createRef<HTMLDivElement>();

    componentDidMount() {
        const data = [ 2, 4, 2, 6, 8 ]
        this.drawBarChart(data)
        this.test();
    }

    drawBarChart(data : number[]) {
        const canvasHeight = 400
        const canvasWidth = 600
        const scale = 20
        const svgCanvas = d3.select(this.canvas.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .style("border", "1px solid black")
        svgCanvas.selectAll("rect")
            .data(data).enter()
                .append("rect")
                .attr("width", 40)
                .attr("height", (datapoint : number) => datapoint * scale)
                .attr("fill", "orange")
                .attr("x", (datapoint, iteration) => iteration * 45)
                .attr("y", (datapoint : number) => canvasHeight - datapoint * scale)
        }
    
    test() {
        
    }

    render() { return <div ref={this.canvas}></div> }
}
export default BarChart