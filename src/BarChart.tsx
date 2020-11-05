import React, { Component, createRef } from 'react'
import * as d3 from 'd3'
import * as vis from './visControl'
import { Dataset2D } from './datasets';

class BarChart extends Component {
    
    //private f: void = vis.run();

    private gausData = vis.get2GaussDist()
    private network = vis.start([2,2,1], vis.generateInputIds())
    private canvas = createRef<HTMLDivElement>()

    componentDidMount() {
        this.drawChart(this.gausData)

        this.test()
    }

    drawChart(data : Dataset2D[]) {
        const margin = 20;
        const canvasHeight = 640;
        const canvasWidth = canvasHeight;
        const scale = canvasHeight / 16;
        const xCentre = canvasWidth / 2 + margin;
        const yCentre = canvasHeight / 2 + margin
        const svgCanvas = d3.select(this.canvas.current)
            .append("svg")
            .attr("width", canvasWidth + margin * 2)
            .attr("height", canvasHeight + margin * 2)
            //.style("border", "1px solid black")
            .append('g')
            .attr('transform', `translate(${margin}, ${margin})`)

        const x = d3.scaleLinear().range([0, canvasWidth])
        const y = d3.scaleLinear().range([canvasHeight, 0])

        x.domain([-8, 8])
        y.domain([-8, 8])

        svgCanvas.append('g')
            .attr('transform', `translate(0,${canvasHeight})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())))

        svgCanvas.append('g')
            //.attr('transform', `translate(${canvasWidth},0)`)
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())))

        svgCanvas.selectAll(".circle")
            .data(data)
            .enter().append('circle')
            .attr('class','circle')
            .attr("r", 5)
            .attr("fill", function(datapoint: Dataset2D): string {
                    let color = "black";
                    if(datapoint.y === 1) color = "#621fa2";
                    if(datapoint.y === -1) color = "#fbfb39";
                    
                    return color;
                })
                .attr("cx", (datapoint : Dataset2D) => (datapoint.x1 * scale) + (canvasWidth/2) + margin)
                .attr("cy", (datapoint : Dataset2D) => -(datapoint.x2 * scale) + (canvasHeight/2) + margin)
        }
    
    test() {
        vis.step(this.network, this.gausData);
    }

    render() { return <div ref={this.canvas}></div> }
}
export default BarChart