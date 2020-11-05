import * as nn from "./NeuralNet";
import { generateTwoGaussianData, Dataset2D } from "./datasets";

interface InputFunc {
    f: (x: number, y:number) => number;
    label: string;
}

//let trainingData: Dataset2D[];
let iter: number = 0;

let INPUTS: {[name: string]: InputFunc} = {
    "x": {f: (x, y) => x, label: "X_1"},
    "y": {f: (x, y) => y, label: "X_2"},
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

export function start(networkShape: number[], inputIds: string[]): nn.Node[][] {
    
    // GenerateInputId's might beable to come back in here

    let network = nn.generateNetwork(networkShape, nn.Activations.SIGMOID, inputIds);

    console.log(network);

    return network;
}

//export function step()

export function get2GaussDist(): Dataset2D[] {
    let dataset = generateTwoGaussianData(200, 0);
    console.log(dataset);
    //trainingData = dataset;
    return dataset;
}

export function constructInputs(x: number, y: number): number[] {
    let inputs: number[] = [];
    for(let inputName in INPUTS) {
        inputs.push(INPUTS[inputName].f(x, y))
    }
    return inputs;

}

export function updateDecisionBoundary(network: nn.Node[][], firstTime: boolean) {


}

export function step(network: nn.Node[][], trainingData: Dataset2D[]): void {
    iter++;
    for(let i = 0; i < trainingData.length; i++) {
        let sample = trainingData[i];
        nn.forwardPropagate(network, constructInputs(sample.x1, sample.x2));
        nn.backPropagate(network, nn.Costs.SQUARE, sample.y)
    }
}

export function reset(): void { 
    iter = 0;
}