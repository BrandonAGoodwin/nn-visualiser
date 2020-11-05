import * as nn from "./NeuralNet";
import { generateTwoGaussianData, Dataset2D } from "./datasets";

export function run(): void {
    interface InputFunc {
        f: (x: number, y:number) => number;
        label: string;
    }
    
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
    function generateInputIds(): string[] {
        // Hard coded for now to put all 2 input IDs
    
        let inputIds: string[] = ["x", "y"];
    
        return inputIds;
    }
    let network = nn.generateNetwork([2,2,1], nn.Activations.SIGMOID, generateInputIds());

    console.log(network);
}

//export function step()

export function get2GaussDist(): Dataset2D[] {
    let dataset = generateTwoGaussianData(20, 0);
    console.log(dataset);
    return dataset;
}
