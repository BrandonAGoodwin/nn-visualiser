import * as nn from "./NeuralNet";
import { generateTwoGaussianData, Dataset2D } from "./datasets";
import { NNConfig } from "./components/MainPage";
import * as d3 from "d3";

interface InputFunc {
    f: (x: number, y: number) => number;
    label: string;
}

let ACTIVATIONS: { [name: string]: nn.ActivationFunction } = {
    "ReLU" : nn.Activations.RELU,
    "Sigmoid": nn.Activations.SIGMOID,
}

let INPUTS: { [name: string]: InputFunc } = {
    "x": { f: (x, y) => x, label: "X_1" },
    "y": { f: (x, y) => y, label: "X_2" },
    // "xSquared": {f: (x, y) => x * x, label: "X_1^2"},
    // "ySquared": {f: (x, y) => y * y,  label: "X_2^2"},
    // "xTimesY": {f: (x, y) => x * y, label: "X_1X_2"},
    // "sinX": {f: (x, y) => Math.sin(x), label: "sin(X_1)"},
    // "sinY": {f: (x, y) => Math.sin(y), label: "sin(X_2)"},
};

// Unimplemented
export function generateInputIds(): string[] {
    // Hard coded for now to put all 2 input IDs

    let inputIds: string[] = ["x", "y"];

    return inputIds;
}

export function start(config: NNConfig): nn.Node[][] {

    // GenerateInputId's might beable to come back in here

    let network = nn.generateNetwork(config.networkShape, ACTIVATIONS[config.activationFunction], nn.Activations.TANH, generateInputIds());
    console.log(network);

    return network;
}


export function get2GaussDist(noSamples: number): Dataset2D[] {
    let dataset = generateTwoGaussianData(noSamples, 0);
    console.log(dataset);
    //trainingData = dataset;
    return dataset;
}

export function constructInputs(x: number, y: number): number[] {
    let inputs: number[] = [];
    for (let inputName in INPUTS) {
        inputs.push(INPUTS[inputName].f(x, y))
    }
    return inputs;

}

export function step(network: nn.Node[][], trainingData: Dataset2D[]): void {
    for (let i = 0; i < trainingData.length; i++) {
        let sample = trainingData[i];
        nn.forwardPropagate(network, constructInputs(sample.x1, sample.x2));
        nn.backPropagate(network, nn.Costs.SQUARE, sample.y);
    }
    nn.train(network, 0.03);
}

export function getCost(network: nn.Node[][], data: Dataset2D[]/* , costFunction: nn.CostFunction */): number {
    let totalCost = 0;
    for (let i = 0; i < data.length; i++) {
        let dataPoint = data[i];
        totalCost += nn.Costs.SQUARE.cost(nn.forwardPropagate(network, constructInputs(dataPoint.x1, dataPoint.x2)), dataPoint.y);
    }

    return totalCost / data.length;
}

// export function reset(): void {
//     iter = 0;
// }

// export function getOutputDecisionBoundary(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[]): number[][] {

//     let xScale = d3.scaleLinear().domain([0, density - 1]).range(xDomain);
//     let yScale = d3.scaleLinear().domain([density - 1, 0]).range(yDomain);
//     let boundary: number[][] = [];

//     for(let i = 0; i < density; i++) {
//         let temp: number[] = [];
//         boundary.push(temp);
//         for(let j = 0; j < density; j++) {
//           let x = xScale(i);
//           let y = yScale(j);
//           let input = constructInputs(x || 0, y || 0);
//           nn.forwardPropagate(network, input);

//           temp.push(nn.getOutputNode(network).output);
//         }
//       }

//     return boundary;
// }

export function getOutputDecisionBoundary(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[]): Dataset2D[] {

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let boundary: Dataset2D[] = [];

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let x = xScale(i);
            let y = yScale(j);

            let input = constructInputs(x || 0, y || 0);
            nn.forwardPropagate(network, input);

            let dataPoint: Dataset2D = { x1: x || 0, x2: y || 0, y: nn.getOutputNode(network).output }

            boundary.push(dataPoint);
        }
    }

    return boundary;
}

export function getOutputDecisionBoundary1D(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[]): number[] {

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let boundary: number[] = [];
    let iter = 0;

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let x = xScale(i);
            let y = yScale(j);
            
            let input = constructInputs(x || 0, y || 0);
            nn.forwardPropagate(network, input);

            //let dataPoint: Dataset2D = { x1: x || 0, x2: y || 0, y: nn.getOutputNode(network).output }

            boundary[iter++] = nn.getOutputNode(network).output;
        }
    }

    return boundary;
}