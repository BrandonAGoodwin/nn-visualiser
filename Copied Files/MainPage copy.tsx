export class S {
}
// import React, { Component, createRef } from 'react';
// import * as d3 from 'd3';
// import * as vis from '../visControl'
// import { Dataset2D } from '../datasets';
// import NNGraph from './NNGraph';
// import { Button } from '@material-ui/core';


// type PageProps = {

// }

// type PageState = {
//     decisionBoundary: Dataset2D[];
// }

// class MainPage extends React.Component<PageProps, PageState> {

//     private xDomain = [-8, 8];
//     private yDomain = [-8, 8];
//     private noSamples = 30;
//     private gausData = vis.get2GaussDist(this.noSamples);
//     private network = vis.start([2, 2, 1], vis.generateInputIds());

//     private numCells = 100;
//     private container = createRef<HTMLDivElement>();

//     constructor(props : PageProps) {
//         super(props)
//         this.state = {
//             decisionBoundary: vis.getOutputDecisionBoundary(this.network, this.numCells, this.xDomain, this.yDomain)
//         };  
//     }


//     // componentDidMount() { // HAppen after the components have rendered
//     //     this.test();
//     // }

//     updateDecisionBoundary() {
//         // Don't like numcells having to be the same
//         this.setState({
//             decisionBoundary: vis.getOutputDecisionBoundary(this.network, this.numCells, this.xDomain, this.yDomain)
//         });
//     }


//     test() {
//         console.log(vis.getCost(this.network, this.gausData))
//         for (let i = 0; i < 1000; i++) {
//             //console.log("Step")
//             vis.step(this.network, this.gausData);
//         }
//         console.log(this.network)
//         console.log(vis.getCost(this.network, this.gausData))
//     }

//     step() { // 1
//         vis.step(this.network, this.gausData);
//         this.updateDecisionBoundary();
//     }

//     render() {
//         return (
//             <>
//                 <NNGraph // MAKE FUNCTIONAL COM
//                     dataset = {this.gausData}
//                     density = {100}
//                     canvasWidth = {640}
//                     margin = {20}
//                     numCells = {this.numCells}
//                     xDomain = {this.xDomain}
//                     yDomain = {this.yDomain}
//                     decisionBoundary = {this.state.decisionBoundary}
//                 />
//                 <Button onClick={() => this.updateDecisionBoundary()}> Update Decision Boundary </Button>
//                 <Button onClick={() => this.step()}> Step </Button>
//             </>
//         );
//     }
// }
// // Minimum information to NNGraph to render the correct immage
// // Don't necessarally want to re-render whole of NNGraph unless that is what you're supposed to do
// // In something like Java I'd expect to do NNGraph.updateBackground(decisionBoundary)

// export default MainPage;