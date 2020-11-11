import React, { Component, createRef } from 'react'
import * as d3 from 'd3'
import * as vis from '../visControl'
import { Dataset2D } from '../datasets';

class NNGraph extends Component {

    private noSamples = 200
    private gausData = vis.get2GaussDist(this.noSamples)
    private network = vis.start([2, 2, 1], vis.generateInputIds())

    private DENSITY = 100
    private margin = 20
    private canvasHeight = 640
    private canvasWidth = this.canvasHeight
    private scale = this.canvasHeight / 16
    private xCentre = this.canvasWidth / 2 + this.margin
    private yCentre = this.canvasHeight / 2 + this.margin
    private numCells = 100
    private container = createRef<HTMLDivElement>()

    async componentDidMount() {
        await this.test()
        this.drawChart(this.gausData)

    }

    drawChart(data: Dataset2D[]) {

        // const DENSITY = 100;
        // const margin = 20;
        // const canvasHeight = 640;
        // const canvasWidth = canvasHeight;
        // const scale = canvasHeight / 16;
        // const xCentre = canvasWidth / 2 + margin;
        // const yCentre = canvasHeight / 2 + margin
        const svgCanvas = d3.select(this.container.current)
            .append("svg")
            .attr("width", this.canvasWidth + this.margin * 2)
            .attr("height", this.canvasHeight + this.margin * 2)
            //.style("border", "1px solid black")
            .append('g')
            .attr('transform', `translate(${this.margin}, ${this.margin})`)

        const x = d3.scaleLinear().range([0, this.canvasWidth])
        const y = d3.scaleLinear().range([this.canvasHeight, 0])

        x.domain([-8, 8])
        y.domain([-8, 8])

        svgCanvas.append('g')
            .attr('transform', `translate(0,${this.canvasHeight})`)
            .call(d3.axisBottom(x).tickValues([0].concat(x.ticks())))

        svgCanvas.append('g')
            .call(d3.axisLeft(y).tickValues([0].concat(y.ticks())))


        // const f:(x: number) => number = (x: number) => {
        //     let y: number;

        //     y = x;

        //     return y;
        // }

        // const mine: [number, number][] = d3.range(-10, 10)
        //     .map(function(x) {
        //         return [x, f(x)];
        // }); 

        // console.log(mine);

        // // Make " and ' usage consistent   

        // //Could cause issues
        // const line = d3.line()
        //     .x(function(d) {
        //         return x(d[0]) || 0;
        //     })
        //     .y(function(d: number[]) {
        //         return y(d[1]) || 0;
        //     })
        //     .curve(d3.curveBasis);


        this.updateBackground(svgCanvas, vis.getOutputDecisionBoundary(this.network, this.numCells, x.domain(), y.domain()), false)

        // svgCanvas.append('path')
        // .datum(mine)
        // .attr('d', line)
        // .attr('stroke', 'black')
        // .attr('stroke-width', '1')
        // .attr('fill', 'none');

        svgCanvas.selectAll(".circle")
            .data(data)
            .enter().append('circle')
            .attr('class', 'circle')
            .attr("r", 5)
            .attr("fill", function (datapoint: Dataset2D): string {
                let colour = "black";
                if (datapoint.y === 1) colour = "#621fa2";
                //if(datapoint.y === -1) color = "#F50000";//"#fbfb39";
                if (datapoint.y === 0) colour = "#fbfb39";

                return colour;
            })
            .style("stroke", "white")
            .attr("cx", (datapoint: Dataset2D) => (datapoint.x1 * this.scale) + (this.canvasWidth / 2) + this.margin)
            .attr("cy", (datapoint: Dataset2D) => -(datapoint.x2 * this.scale) + (this.canvasHeight / 2) + this.margin)


    }

    updateBackground(svgCanvas: d3.Selection<SVGGElement, unknown, null, undefined>, data: Dataset2D[], discretize: boolean): void {
        //let test = d3.this.container.current
        let cellWidth = (this.canvasWidth / (this.numCells)) // this.scale
        let cellHeight = cellWidth
        let diff = ((this.canvasWidth / (this.numCells)) - (this.canvasWidth / (this.numCells + 1)))

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
            .domain([0, 1])
            .range(colors);

        let scale = d3.scaleLinear().domain([-8, 8]).range([0, this.DENSITY - 1])

        svgCanvas.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", (datapoint: Dataset2D) => (datapoint.x1 * this.scale) + (this.canvasWidth / 2))
            .attr("y", (datapoint: Dataset2D) => -(datapoint.x2 * this.scale) + (this.canvasHeight / 2)) // Note will probably need to be flipped
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .attr("fill", (datapoint: Dataset2D) => {
                let value = datapoint.y < 0.5 ? 0 : 1
                return color(value) || "#FF0000"
            })

    }


    test() {
        console.log(vis.getCost(this.network, this.gausData))
        for (let i = 0; i < 1000; i++) {
            //console.log("Step")
            vis.step(this.network, this.gausData);
        }
        console.log(this.network)
        console.log(vis.getCost(this.network, this.gausData))
    }

    render() {
        return (
            <div ref={this.container} />
        );
    }
}
export default NNGraph