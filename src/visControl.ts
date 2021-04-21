import * as nn from "./NeuralNet";
import { Datapoint2D, DatasetGenerator, Dataset } from "./datasets";
import * as d3 from "d3";
import seedrandom from "seedrandom";
import { ACTIVATIONS, NNConfig } from "./NetworkController";


interface InputFunc {
    f: (x: number, y: number) => number;
    label: string;
}

// let ACTIVATIONS: { [name: string]: nn.ActivationFunction } = {
//     "Tanh": nn.Activations.TANH,
//     "ReLU": nn.Activations.RELU,
//     "Sigmoid": nn.Activations.SIGMOID,
//     "Linear": nn.Activations.LINEAR,
// }

let GENERATORS: { [datasetType: string]: DatasetGenerator } = {
    "Gaussian2": Dataset.GAUSSIAN_2,
    "Gaussian3": Dataset.GAUSSIAN_3,
    "XOR": Dataset.XOR,
}


export let INPUTS: { [name: string]: InputFunc } = {
    "x": { f: (x, y) => x, label: "X_1" },
    "y": { f: (x, y) => y, label: "X_2" },
    "xSquared": { f: (x, y) => x * x, label: "X_1^2" },
    "ySquared": { f: (x, y) => y * y, label: "X_2^2" },
    "xTimesY": { f: (x, y) => x * y, label: "X_1X_2" },
    "sinX": { f: (x, y) => Math.sin(x), label: "sin(X_1)" },
    "sinY": { f: (x, y) => Math.sin(y), label: "sin(X_2)" },
};


export function start(config: NNConfig): nn.Node[][] {
    let network = nn.generateNetwork(config.networkShape, ACTIVATIONS[config.activationFunction], config.activationFunction === "Linear" ? nn.Activations.LINEAR : nn.Activations.TANH, config.inputs);
    console.log(network);

    return network;
}

export function getDataset(datasetType: string, numSamples: number, noise: number) {
    let datasetGenerator = GENERATORS[datasetType];
    let dataset = datasetGenerator(numSamples, noise);
    // console.log(dataset);
    return dataset;
}

export function constructInputs(x: number, y: number, inputs: { [key: string]: boolean }): number[] {
    let constructedInputs: number[] = [];
    for (let inputName in INPUTS) {
        if (inputs[inputName]) constructedInputs.push(INPUTS[inputName].f(x, y))
    }
    // console.log("X:" + x + " Y:"+ y)
    // console.log(constructedInputs)
    return constructedInputs;

}

export function step(network: nn.Node[][], trainingData: Datapoint2D[], learningRate: number, inputs: { [key: string]: boolean }, batchSize: number): nn.Node[][] {
    for (let i = 0; i < trainingData.length; i++) {
        let sample = trainingData[i];
        nn.forwardPropagate(network, constructInputs(sample.x1, sample.x2, inputs));
        nn.backPropagate(network, nn.Costs.SQUARE, sample.y);
        if ((i + 1) % batchSize === 0) nn.train(network, learningRate);
    }
    return network;
}

export function getCost(network: nn.Node[][], data: Datapoint2D[], inputs: { [key: string]: boolean }/* , costFunction: nn.CostFunction */): number {
    let totalCost = 0;
    for (let i = 0; i < data.length; i++) {
        let dataPoint = data[i];
        totalCost += nn.Costs.SQUARE.cost(nn.forwardPropagate(network, constructInputs(dataPoint.x1, dataPoint.x2, inputs)), dataPoint.y);
    }

    return totalCost / data.length;
}

export function copyNetwork(network: nn.Node[][]): nn.Node[][] {
    return nn.copyNetwork(network);
}

export function getOutputDecisionBoundary(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: { [key: string]: boolean }): Datapoint2D[] {

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let boundary: Datapoint2D[] = [];

    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let x = xScale(j);
            let y = yScale(i);

            let input = constructInputs(x || 0, y || 0, inputs);
            nn.forwardPropagate(network, input);

            let dataPoint: Datapoint2D = { x1: x || 0, x2: y || 0, y: nn.getOutputNode(network).output }

            boundary.push(dataPoint);
        }
    }

    return boundary;
}

export function getOutputDecisionBoundary1D(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: { [key: string]: boolean }): number[] {

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

export function getAllDecisionBoundaries(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: { [key: string]: boolean }): { [nodeId: string]: number[] } {
    let boundaries: { [nodeId: string]: number[] } = {};

    let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
    let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
    let iter = 0;

    let inputNodeIds = Object.keys(INPUTS);

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
            inputNodeIds.forEach((nodeId) => {
                if (!boundaries[nodeId]) boundaries[nodeId] = [];
                boundaries[nodeId][iter] = INPUTS[nodeId].f(x || 0, y || 0);
            })
            iter++;
            //boundary[iter++] = nn.getOutputNode(network).output;
        }
    }

    return boundaries;

}

export function NetworkToJSON(network: Node[][]): string {
    let json = "";
    JSON.stringify(network);
    let numLayers = network.length;

    var cache: any = [];
    json = JSON.stringify(network, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Duplicate reference found, discard key
            if (cache.includes(value)) return;

            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection

    // for(let i = 0; i < numLayers; i++) {

    // }

    return json;
}

interface NetworkData {
    nnConfig: NNConfig;
    nodeStore:  { [nodeId: string]: number };
    linkStore: { [linkId: string]: number };
}

export function NetworkToString(network: nn.Node[][], nnConfig: NNConfig): string {
    console.log("Network to string")
    let networkShape: number[] = [];
    let nodeStore: { [nodeId: string]: number } = {};
    let linkStore: { [linkId: string]: number } = {};
    let numLayers = network.length;

    for (let layerNum = 0; layerNum < numLayers; layerNum++) {
        let currentLayer = network[layerNum];
        let numNodes = currentLayer.length;

        networkShape.push(numNodes);

        if (layerNum > 0) {
            for (let i = 0; i < numNodes; i++) {
                let node = currentLayer[i];

                nodeStore[node.id] = node.bias;

                // const {
                //     activationFunction, 
                //     ...nodeData
                // } = node;

                let linksIn = node.linksIn;
                for (let j = 0; j < linksIn.length; j++) {
                    let link = linksIn[j];
                    linkStore[link.id] = link.weight;
                }
                // let nodeData = {
                //     // id: node.id,
                //     // bias: node.bias,
                //     ...node,

                // };
            }
        }
    }

    let networkData = {
        nnConfig: nnConfig,
        nodeStore: nodeStore,
        linkStore: linkStore,
    };
    let networkString = JSON.stringify(networkData);

    console.log(networkString)
    return networkString;
}

export function StringToNetwork(networkString: string): [NNConfig, nn.Node[][]] {
    console.log("String to network");
    let network: nn.Node[][] = [];
    console.log(networkString)
    let networkData: NetworkData = JSON.parse(networkString);
    console.log(networkData);
    // let nnConfig = networkData.nnConfig;
    let {
        nnConfig,
        nodeStore,
        linkStore,
    } = networkData;

    let activationFunction = ACTIVATIONS[nnConfig.activationFunction];

    let inputIds: string[] = [];
    let id = 1;
    Object.keys(nnConfig.inputs).forEach((inputId) => {
        if (nnConfig.inputs[inputId]) inputIds.push(inputId);
    });

    let numLayers = nnConfig.networkShape.length;
    for (let layerNum = 0; layerNum < numLayers; layerNum++) {
        let currentLayer: nn.Node[] = [];

        network.push(currentLayer);

        let numNodes = nnConfig.networkShape[layerNum];
        let isInputLayer = layerNum === 0;
        for (let i = 0; i < numNodes; i++) {
            let nodeId = isInputLayer ? inputIds[i] : (id++).toString();

            let isOutputNode = layerNum === numLayers - 1 && i === 0;
            let isLinear = nnConfig.activationFunction !== "Linear";

            let node = new nn.Node(nodeId, (isOutputNode && isLinear) ? nn.Activations.TANH : activationFunction, !isInputLayer ? nodeStore[nodeId] : undefined);

            currentLayer.push(node);

            if (!isInputLayer) {
                let prevLayer = network[layerNum - 1]
                for (let j = 0; j < prevLayer.length; j++) {
                    let prevNode = prevLayer[j];
                    let link = new nn.Link(prevNode, node, linkStore[`${prevNode.id}-${node.id}`]);
                    prevNode.linksOut.push(link);
                    node.linksIn.push(link);
                }
            }
        }
    }
    console.log(network);


    return [nnConfig, network];
}