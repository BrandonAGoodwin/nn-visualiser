import * as nn from "./NeuralNet";
import { Dataset2D, DatasetGenerator, Dataset } from "./datasets";
import { NNConfig } from "./components/MainPage";
import * as d3 from "d3";


interface InputFunc {
    f: (x: number, y: number) => number;
    label: string;
}

let ACTIVATIONS: { [name: string]: nn.ActivationFunction } = {
    "ReLU": nn.Activations.RELU,
    "Sigmoid": nn.Activations.SIGMOID,
}

let GENERATORS: { [datasetType: string]: DatasetGenerator } = {
    "Gaussian": Dataset.GAUSSIAN,
    "XOR": Dataset.XOR,
}


let INPUTS: { [name: string]: InputFunc } = {
    "x": { f: (x, y) => x, label: "X_1" },
    "y": { f: (x, y) => y, label: "X_2" },
    "xSquared": { f: (x, y) => x * x, label: "X_1^2" },
    "ySquared": { f: (x, y) => y * y, label: "X_2^2" },
    "xTimesY": { f: (x, y) => x * y, label: "X_1X_2" },
    "sinX": { f: (x, y) => Math.sin(x), label: "sin(X_1)" },
    "sinY": { f: (x, y) => Math.sin(y), label: "sin(X_2)" },
};


export function start(config: NNConfig): nn.Node[][] {

    let network = nn.generateNetwork(config.networkShape, ACTIVATIONS[config.activationFunction], nn.Activations.TANH, config.inputs);
    console.log(network);

    return network;
}

export function getDataset(datasetType: string, numSamples: number, noise: number) {
    let datasetGenerator = GENERATORS[datasetType];
    let dataset = datasetGenerator(numSamples, noise);
    console.log(dataset);
    return dataset;
}

export function constructInputs(x: number, y: number, inputs: string[]): number[] {
    let constructedInputs: number[] = [];
    for (let inputName in INPUTS) {
        if (inputs.includes(inputName)) constructedInputs.push(INPUTS[inputName].f(x, y))
    }
    return constructedInputs;

}

export function step(network: nn.Node[][], trainingData: Dataset2D[], learningRate: number, inputs: string[], batchSize: number): void {
    for (let i = 0; i < trainingData.length; i++) {
        let sample = trainingData[i];
        nn.forwardPropagate(network, constructInputs(sample.x1, sample.x2, inputs));
        nn.backPropagate(network, nn.Costs.SQUARE, sample.y);
        if ((i + 1) % batchSize === 0) nn.train(network, learningRate);
    }

}

export function getCost(network: nn.Node[][], data: Dataset2D[], inputs: string[]/* , costFunction: nn.CostFunction */): number {
    let totalCost = 0;
    for (let i = 0; i < data.length; i++) {
        let dataPoint = data[i];
        totalCost += nn.Costs.SQUARE.cost(nn.forwardPropagate(network, constructInputs(dataPoint.x1, dataPoint.x2, inputs)), dataPoint.y);
    }

    return totalCost / data.length;
}

export function getOutputDecisionBoundary(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: string[]): Dataset2D[] {

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let boundary: Dataset2D[] = [];

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let x = xScale(j);
            let y = yScale(i);

            let input = constructInputs(x || 0, y || 0, inputs);
            nn.forwardPropagate(network, input);

            let dataPoint: Dataset2D = { x1: x || 0, x2: y || 0, y: nn.getOutputNode(network).output }

            boundary.push(dataPoint);
        }
    }

    return boundary;
}

export function getOutputDecisionBoundary1D(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: string[]): number[] {

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let boundary: number[] = [];
    let iter = 0;

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let x = xScale(j);
            let y = yScale(i);

            let input = constructInputs(x || 0, y || 0, inputs);
            nn.forwardPropagate(network, input);

            boundary[iter++] = nn.getOutputNode(network).output;
        }
    }

    return boundary;
}

export function getAllDecisionBoundaries(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: string[]): { [nodeId: string]: number[] } {
    let boundaries: {[nodeId:string]: number[]} = {};

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let iter = 0;

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let x = xScale(j);
            let y = yScale(i);

            let input = constructInputs(x || 0, y || 0, inputs);
            nn.forwardPropagate(network, input);
            nn.forEachNode(network, (node: nn.Node) => {
                if (!boundaries[node.id]) boundaries[node.id] = [];
                boundaries[node.id][iter] = node.output;
            })
            iter++;
            //boundary[iter++] = nn.getOutputNode(network).output;
        }
    }

    return boundaries;

}