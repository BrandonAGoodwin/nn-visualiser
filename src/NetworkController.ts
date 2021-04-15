import { ThreeDRotationSharp } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { DGConfig } from "./DatasetGenerator";
import { Dataset, Datapoint2D, DatasetGenerator } from "./datasets";
import * as nn from "./NeuralNet";
import * as vis from "./visControl";

interface InputFunc {
    f: (x: number, y: number) => number;
    label: string;
}

let ACTIVATIONS: { [name: string]: nn.ActivationFunction } = {
    "Tanh": nn.Activations.TANH,
    "ReLU": nn.Activations.RELU,
    "Sigmoid": nn.Activations.SIGMOID,
}

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


/** Stores network and network configuration state and actions. */
export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    learningRate: number;
    inputs: { [key: string]: boolean };
    batchSize: number;
    noise: number;
    datasetType: string;
    // dataset: Datapoint2D[];
    // decisionBoundaries: { [nodeId: string]: number[] };
    // decisionBoundary: number[];
    // loss: number;
    // epochs: number;
    // lossData: [number, number][]; // Maybe loss data shouldn't be dealt with inside of NetworkController (Maybe have a whole data storage and analysis class/controller)
    numSamples: number;
}

export type LossData = [epoch: number, loss: number];

// Maybe there should only be one input 
// Maybe rename or split this up differently
// Or split this up into properties that are needed to define a network and ones that are generated by the network
export interface NetworkState {
    // noise: number;
    // datasetType: string;
    // dataset: Datapoint2D[];
    nnConfig: NNConfig;
    dgConfig: DGConfig;
    decisionBoundaries: { [nodeId: string]: number[] }; // Maybe make this a type
    decisionBoundary: number[]; // Should either be renamed to outputDecisionBoundary, removed entirely and use a get outputNodeId to access
    // loss: number; // Maybe just get the last value in lossData instead
    // epochs: number; // Maybe just get the last value in lossData instead
    // lossData: LossData[];
    analyticsData: AnalyticsData;
}

// Maybe each saved state should have it's own controller

// export class NetworkController {

//     network: nn.Node[][];
//     dataset: Datapoint2D[];

//     // Maybe instead extract config for easier access
//     // config: NNConfig;

//     compareMode: boolean;

//     trainingData: Datapoint2D[];
//     testData: Datapoint2D[];

//     networkShape: number[];
//     activationFunction: string;
//     learningRate: number;
//     inputs: { [key: string]: boolean };
//     batchSize: number;
//     noise: number;
//     datasetType: string;
//     // dataset: Datapoint2D[];
//     decisionBoundaries: { [nodeId: string]: number[] };
//     decisionBoundary: number[];
//     loss: number;
//     epochs: number;
//     lossData: [number, number][]; // Maybe loss data shouldn't be dealt with inside of NetworkController (Maybe have a whole data storage and analysis class/controller)
//     numSamples: number;

//     // REFACTOR: Maybe split this up differently
//     // networkProperties: NetworkState;

//     // constructor(config: NNConfig/* , temp: NetworkController */) {
//     //     console.log("Constructing NetworkController");
//     //     this.config = config;
//     //     /* networkProperties = temp; */
//     //     this.network = nn.generateNetwork(config.networkShape, ACTIVATIONS[config.activationFunction], nn.Activations.TANH, config.inputs);
//     //     this.dataset = this.getDataset(config.datasetType, config.numSamples, config.noise);
//     //     [this.trainingData, this.testData] = this.splitDataset(this.dataset);

//     //     this.compareMode = false;

//     //     console.log(this.network);
//     //     // this.generateNetwork();
//     // }

//     constructor(config: NNConfig/* , temp: NetworkController */) {
//         console.log("Constructing NetworkController");

//         this.networkShape = config.networkShape;
//         this.activationFunction = config.activationFunction;
//         this.learningRate = config.learningRate;
//         this.inputs = config.inputs;
//         this.batchSize = config.batchSize;
//         this.noise = config.noise;
//         this.datasetType = config.datasetType;
//         // this.decisionBoundaries = config.decisionBoundaries;
//         // this.decisionBoundary = config.decisionBoundary;
//         // this.loss = config.loss;
//         // this.epochs = config.epochs;
//         // this.lossData = config.lossData;
//         this.numSamples = config.numSamples;
//         // remove all constant default values (e.g. loss will always default to 0)

//         this.network = nn.generateNetwork(this.networkShape, ACTIVATIONS[this.activationFunction], nn.Activations.TANH, this.inputs);
//         this.dataset = this.getDataset(this.datasetType, this.numSamples, this.noise);
//         [this.trainingData, this.testData] = this.splitDataset(this.dataset);

//         this.decisionBoundaries = {};
//         this.decisionBoundary = [];
//         this.loss = 0;
//         this.epochs = 0;
//         this.lossData = [];
//         this.compareMode = false;

//         console.log(this.network);
//         // this.generateNetwork();
//     }

//     // export function start(config: NNConfig): nn.Node[][] {
//     //     let network = nn.generateNetwork(config.networkShape, ACTIVATIONS[config.activationFunction], nn.Activations.TANH, config.inputs);
//     //     console.log(network);

//     //     return network;
//     // }

//     private getDataset(datasetType: string, numSamples: number, noise: number) {
//         let datasetGenerator = GENERATORS[datasetType];
//         let dataset = datasetGenerator(numSamples, noise);
//         // console.log(dataset);
//         return dataset;
//     }

//     private constructInputs(x: number, y: number, inputs: { [key: string]: boolean }): number[] {
//         let constructedInputs: number[] = [];
//         for (let inputName in INPUTS) {
//             if (inputs[inputName]) constructedInputs.push(INPUTS[inputName].f(x, y))
//         }
//         // console.log("X:" + x + " Y:"+ y)
//         // console.log(constructedInputs)
//         return constructedInputs;
//     }

//     private splitDataset(dataset: Datapoint2D[]) {
//         let testDataIndex = Math.floor(dataset.length * 0.8);
//         let trainingData = dataset.slice(0, testDataIndex);
//         let testData = dataset.slice(testDataIndex, dataset.length);
//         return [trainingData, testData];
//     }

//     //    step(network: nn.Node[][], trainingData: Datapoint2D[], learningRate: number, inputs: { [key: string]: boolean }, batchSize: number): void {
//     //         for (let i = 0; i < trainingData.length; i++) {
//     //             let sample = trainingData[i];
//     //             nn.forwardPropagate(network, constructInputs(sample.x1, sample.x2, inputs));
//     //             nn.backPropagate(network, nn.Costs.SQUARE, sample.y);
//     //             if ((i + 1) % batchSize === 0) nn.train(network, learningRate);
//     //         }

//     //     }

//     //
//     step(): void {
//         for (let i = 0; i < this.trainingData.length; i++) {
//             let sample = this.trainingData[i];
//             nn.forwardPropagate(this.network, this.constructInputs(sample.x1, sample.x2, this.inputs));
//             nn.backPropagate(this.network, nn.Costs.SQUARE, sample.y);
//             if ((i + 1) % this.batchSize === 0) nn.train(this.network, this.learningRate); // Passing by reference/value here might cause issues
//         }
//     }

//     // getCost(network: nn.Node[][], data: Datapoint2D[], inputs: { [key: string]: boolean }/* , costFunction: nn.CostFunction */): number {
//     //     let totalCost = 0;
//     //     for (let i = 0; i < data.length; i++) {
//     //         let dataPoint = data[i];
//     //         totalCost += nn.Costs.SQUARE.cost(nn.forwardPropagate(network, constructInputs(dataPoint.x1, dataPoint.x2, inputs)), dataPoint.y);
//     //     }

//     //     return totalCost / data.length;
//     // }

//     // Maybe this should be private
//     getCost(dataset: Datapoint2D[]): number {
//         let totalCost = 0;
//         for (let i = 0; i < dataset.length; i++) {
//             let dataPoint = dataset[i];
//             totalCost += nn.Costs.SQUARE.cost(nn.forwardPropagate(this.network, this.constructInputs(dataPoint.x1, dataPoint.x2, this.inputs)), dataPoint.y);
//         }
//         return totalCost / dataset.length;
//     }

//     // Careful about each of these changes inside the function triggering useEffect multiple times
//     // Could be fixed if I find a pass by value implementation
//     addLayer(): void {
//         console.log("Running addLayer");
//         if (this.networkShape.length < 6) { // Maybe make constants for these constant values (magic numbers)
//             let networkShape = this.networkShape;
//             networkShape.pop();
//             networkShape.push(networkShape[networkShape.length - 1]);
//             networkShape.push(1);
//             // console.log(networkShape);
//             this.networkShape = networkShape;
//         }
//     }

//     removeLayer(): void {
//         console.log("Running removeLayer");
//         if (this.networkShape.length > 2) {
//             let networkShape = this.networkShape;
//             networkShape.pop();
//             networkShape.pop();
//             networkShape.push(1);
//             // console.log(newNetworkShape);
//             this.networkShape = networkShape;
//         }
//     }



//     addNode(layerNum: number): void {
//         console.log("Running addNode");
//         if (this.networkShape[layerNum] < 5) this.networkShape[layerNum] = this.networkShape[layerNum] + 1;
//     }

//     removeNode(layerNum: number): void {
//         console.log("Running removeNode");
//         if (this.networkShape[layerNum] > 1) this.networkShape[layerNum] = this.networkShape[layerNum] - 1;
//     }

//     // export function copyNetwork(network: nn.Node[][]): nn.Node[][] {
//     //     return nn.copyNetwork(network);
//     // }

//     // export function getOutputDecisionBoundary(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: { [key: string]: boolean }): Datapoint2D[] {

//     //     let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
//     //     let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
//     //     let boundary: Datapoint2D[] = [];

//     //     for (let i = 0; i < density; i++) {
//     //         for (let j = 0; j < density; j++) {
//     //             let x = xScale(j);
//     //             let y = yScale(i);

//     //             let input = constructInputs(x || 0, y || 0, inputs);
//     //             nn.forwardPropagate(network, input);

//     //             let dataPoint: Datapoint2D = { x1: x || 0, x2: y || 0, y: nn.getOutputNode(network).output }

//     //             boundary.push(dataPoint);
//     //         }
//     //     }

//     //     return boundary;
//     // }

//     // Maybe this should be private and replace get with generate
//     // getOutputDecisionBoundary(): Datapoint2D[] {

//     //     let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
//     //     let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
//     //     let boundary: Datapoint2D[] = [];

//     //     for (let i = 0; i < density; i++) {
//     //         for (let j = 0; j < density; j++) {
//     //             let x = xScale(j);
//     //             let y = yScale(i);

//     //             let input = constructInputs(x || 0, y || 0, inputs);
//     //             nn.forwardPropagate(network, input);

//     //             let dataPoint: Datapoint2D = { x1: x || 0, x2: y || 0, y: nn.getOutputNode(network).output }

//     //             boundary.push(dataPoint);
//     //         }
//     //     }


//     //     return boundary;
//     // }

//     // export function getOutputDecisionBoundary1D(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: { [key: string]: boolean }): number[] {

//     //     let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
//     //     let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
//     //     let boundary: number[] = [];
//     //     let iter = 0;

//     //     for (let i = 0; i < density; i++) {
//     //         for (let j = 0; j < density; j++) {
//     //             let x = xScale(j);
//     //             let y = yScale(i);

//     //             let input = constructInputs(x || 0, y || 0, inputs);
//     //             nn.forwardPropagate(network, input);

//     //             boundary[iter++] = nn.getOutputNode(network).output;
//     //         }
//     //     }

//     //     return boundary;
//     // }

//     // export function getAllDecisionBoundaries(network: nn.Node[][], density: number, xDomain: number[], yDomain: number[], inputs: { [key: string]: boolean }): { [nodeId: string]: number[] } {
//     //     let boundaries: { [nodeId: string]: number[] } = {};

//     //     let xScale = d3.scaleLinear().domain([0, density]).range(xDomain);
//     //     let yScale = d3.scaleLinear().domain([density, 0]).range(yDomain);
//     //     let iter = 0;

//     //     let inputNodeIds = Object.keys(INPUTS);

//     //     for (let i = 0; i < density; i++) {
//     //         for (let j = 0; j < density; j++) {
//     //             let x = xScale(j);
//     //             let y = yScale(i);

//     //             let input = constructInputs(x || 0, y || 0, inputs);
//     //             nn.forwardPropagate(network, input);
//     //             nn.forEachNode(network, (node: nn.Node) => {
//     //                 if (!boundaries[node.id]) boundaries[node.id] = [];
//     //                 boundaries[node.id][iter] = node.output;
//     //             })
//     //             inputNodeIds.forEach((nodeId) => {
//     //                 if (!boundaries[nodeId]) boundaries[nodeId] = [];
//     //                 boundaries[nodeId][iter] = INPUTS[nodeId].f(x || 0, y || 0);
//     //             })
//     //             iter++;
//     //             //boundary[iter++] = nn.getOutputNode(network).output;
//     //         }
//     //     }

//     //     return boundaries;

//     // }



//     generateNetwork(): void {
//         // this.net
//     }

//     generateDataset(): void {

//     }

//     reset(): void {
//         this.network = nn.generateNetwork(this.networkShape, ACTIVATIONS[this.activationFunction], nn.Activations.TANH, this.inputs);
//         this.dataset = this.getDataset(this.datasetType, this.numSamples, this.noise);
//         [this.trainingData, this.testData] = this.splitDataset(this.dataset);
//     }


// }

// function useNetworkController(defaultData) {
//     const [networkController, setNetworkController] = useState<NetworkController>(defaultData);

//     const addNode = () => {
//         setNetworkController(())
//     }

//     return {
//         config,
//         addNode,
//     }
// }


//Change NNConfig to NetworkConfig or NetworkState to NNState
export interface NNState {
    compareMode: boolean;
    decisionBoundaries: { [nodeId: string]: number[] };
    decisionBoundary: number[];
}

const defaultNetworkData = {
    networkShape: [2, 2, 2, 1],
    activationFunction: "Tanh",
    learningRate: 0.03,
    inputs: {
        "x": true,
        "y": true,
        "xSquared": false,
        "ySquared": false,
        "xTimesY": false,
        "sinX": false,
        "sinY": false
    },
    batchSize: 10,
    datasetType: "Gaussian2",
    numSamples: 100,
    noise: 0.2
};

export interface AnalyticsData {
    trainingLossData: [epoch: number, loss: number][]; // maybe use loss data type
    testLossData: [epoch: number, loss: number][];
    epochs: number;
}

const defaultAnaLyticsData: AnalyticsData = {
    trainingLossData: [],
    testLossData: [],
    epochs: 0
}

const defaultNetworkState = {
    compareMode: false,
    decisionBoundaries: {}, // Maybe remove decision boundary stuff outside of useNetwork
    decisionBoundary: []
}

// GAME PLAN
// - INSTEAD JUST COPY AND PASTE ALL NN FUNCTIONALITY FROM MAINPAGE TO NEW USENETWORK HOOK
// - CREATE THE HOOK IN THE APP AND PUT IT INTO A CONTEXT SO THAT ONLY NECESSARY FUNCTIONS HAVE TO BE MANUALLY PASSED DOWN THE COMPONENT TREE
// - REFACTOR MAIN PAGE SO THAT EACH PANEL IN THE GRID IS IT'S OWN COMPONENT
// - USE USETRACKED TO ACCESS CONTEXT IN EACH CHILD COMPONENT
// - CUSTOM HOOK JUST FOR CONFIG


// Maybe remove dataset related stuff from this
export function useNetwork(
    defaultData: NNConfig = defaultNetworkData,
    defaultState: NNState = defaultNetworkState
) {
    const [nnConfig, setNNConfig] = useState<NNConfig>(defaultData);
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnaLyticsData);
    const [state, setState] = useState<NNState>(defaultState); // Maybe refactor to networkState or something else
    const [init, setInit] = useState<boolean>(false);

    // useEffect(() => {
    //     setConfig(defaultData);
    //     setState()
    // }, []);

    useEffect(() => {
        console.log("Config change useEffect");
        // if (training) toggleAutoTrain();
        // setState(defaultState);
        reset();
        // generateNetwork();
        // generateDataset();
    }, [nnConfig]);



    // useEffect(() => {
    //     setNetworkController(new NetworkController(config));
    // }, [config]);

    // useEffect(() => {
    //     updateDecisionBoundary();
    // }, [decisionBoundaries]);

    // useEffect(() => {
    //     console.log("Config change useEffect");
    //     updateDecisionBoundaries();
    // }, [network]);

    // const updateDecisionBoundaries = () => {
    //     // console.log("Updating decision boundaries");
    //     if (network) {
    //         // Don't like numcells having to be the same
    //         setDecisionBoundaries(vis.getAllDecisionBoundaries(network, 20, props.xDomain, props.yDomain, config.inputs));
    //         dataset && setLoss(vis.getCost(network, dataset, config.inputs));
    //     }
    // }

    // const updateDecisionBoundary = () => {
    //     // console.log("Updating decision boundary");
    //     network && setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain, config.inputs));
    // }


    // const generateDataset = () => {
    //     console.log("Generating dataset");
    //     setDataset(vis.getDataset(datasetType, numSamples, noise));
    // }

    const generateNetwork = () => {
        console.log("Generating network");

        setNetwork((prevNetwork) => {
            let newNetwork = vis.start(nnConfig);

            return newNetwork;
        }); // maybe move this from vis into network controller

        // if (!state.compareMode) {
        //     let newNetwork = vis.start(config);
        //     setNetwork(newNetwork);
        //     let newNetworkCopy = vis.copyNetwork(newNetwork);
        //     console.log(newNetworkCopy);
        //     setNetworkOriginalState(newNetworkCopy);
        // } else {
        //     console.log("Loading network original state");
        //     if (networkOriginalState) {
        //         console.log(networkOriginalState);
        //         setNetwork(vis.copyNetwork(networkOriginalState));
        //     }
        // }
        // setEpochs(0);
        // setLossData([]);
    }

    const setActivationFunction = (activationFunction: string) => {
        setNNConfig((prev) => ({ ...prev, activationFunction: activationFunction }));
    }

    const setLearningRate = (learningRate: number) => {
        setNNConfig((prev) => ({ ...prev, learningRate: learningRate }));
    }

    // const setInputs = ()

    const setBatchSize = ((batchSize: number) => {
        setNNConfig((prev) => ({ ...prev, batchSize: batchSize }));
    })

    const toggleInputNode = (nodeId: string, active: boolean) => {
        setNNConfig((prevConfig) => {
            let inputs = prevConfig.inputs;
            let networkShape = prevConfig.networkShape;

            if (active) {
                let noActiveNodes = 0;
                Object.keys(nnConfig.inputs).forEach((inputId) => { if (nnConfig.inputs[inputId]) noActiveNodes++; });
                if (noActiveNodes > 1) {
                    inputs[nodeId] = false;
                    networkShape[0] = networkShape[0] - 1;
                } else {
                    return prevConfig;
                }
            } else {
                inputs[nodeId] = true;
                networkShape[0] = networkShape[0] + 1;
            }

            return { ...prevConfig, inputs: inputs, networkShape: networkShape };
        });
    }


    const addNode = (layerNum: number) => {
        console.log("Running addNode");
        setNNConfig((prevConfig) => {
            let newNetworkShape = prevConfig.networkShape;
            if (prevConfig.networkShape[layerNum] < 5) {
                let newNetworkShape = prevConfig.networkShape;
                newNetworkShape[layerNum] = prevConfig.networkShape[layerNum] + 1;
                // setConfig({ ...config, networkShape: newNetworkShape });
            }
            //return {...data, networkShape: newNetworkShape};
            return { ...prevConfig, networkShape: newNetworkShape };
        });
    }

    const removeNode = (layerNum: number) => {
        console.log("Running removeNode");
        setNNConfig((prevConfig) => {
            if (nnConfig.networkShape[layerNum] > 1) {
                prevConfig.networkShape[layerNum] = prevConfig.networkShape[layerNum] - 1;
                // setConfig({ ...config, networkShape: newNetworkShape });
            }
            return { ...prevConfig, networkShape: prevConfig.networkShape }; // Probably only remove node or add node will work
        });
    }

    const addLayer = () => {
        console.log("Running addLayer");
        setNNConfig((prevConfig) => {
            let newNetworkShape = prevConfig.networkShape;
            if (newNetworkShape.length < 6) {
                newNetworkShape.pop();
                newNetworkShape.push(newNetworkShape[newNetworkShape.length - 1]);
                newNetworkShape.push(1);
                // console.log(newNetworkShape);
                // setConfig({ ...config, networkShape: newNetworkShape });
            }
            return { ...prevConfig, networkShape: newNetworkShape };
        });
    }

    const removeLayer = () => {
        console.log("Running removeLayer");
        setNNConfig((prevConfig) => {
            let newNetworkShape = prevConfig.networkShape;
            if (newNetworkShape.length > 2) {
                newNetworkShape.pop();
                newNetworkShape.pop();
                newNetworkShape.push(1);
                // console.log(newNetworkShape);
                // setConfig({ ...config, networkShape: newNetworkShape });
            }
            return { ...prevConfig, networkShape: newNetworkShape };
        });
    }

    // Might not work because config values aren't aquired from setConfig function call
    const step = (trainingData: Datapoint2D[], testData: Datapoint2D[]) => {
        setNetwork((prevNetwork) => {
            console.log("Running step insid netowrk controller");
            console.log(prevNetwork);
            if (prevNetwork) {

                let updatedNetwork = vis.step(prevNetwork, trainingData, nnConfig.learningRate, nnConfig.inputs, nnConfig.batchSize);
                setAnalyticsData((prevAnalyticsData) => {
                    if (prevAnalyticsData) {
                        const { trainingLossData, testLossData, epochs } = prevAnalyticsData;

                        //return { epochs: prevAnalyticsData?.epochs + 1, trainingLossData: prevAnalyticsData}
                        // let trainingLoss = vis.getCost(updatedNetwork, trainingData, nnConfig.inputs);
                        // let testLoss = vis.getCost(updatedNetwork, testData, nnConfig.inputs);
                        let epoch = epochs + 1;
                        trainingLossData.push([epoch, vis.getCost(updatedNetwork, trainingData, nnConfig.inputs)]);
                        testLossData.push([epoch, vis.getCost(updatedNetwork, testData, nnConfig.inputs)]);
                        return { trainingLossData: trainingLossData, testLossData: testLossData, epochs: epochs + 1 };
                    }
                    return prevAnalyticsData;
                });

                //return vis.step(prevNetwork, trainingData, nnConfig.learningRate, nnConfig.inputs, nnConfig.batchSize); // maybe move step from vis to here
                // let network = vis.step(prevNetwork, dataset, config.learningRate, config.inputs, config.batchSize)
                // return [...network];
            }
            return prevNetwork;
        });
    }

    const reset = () => {
        generateNetwork();
        // setState((prevState) => ({ ...defaultNetworkState, compareMode: prevState.compareMode }));
    }

    return {
        nnConfig,
        state,
        network,
        analyticsData,
        setActivationFunction,
        setLearningRate,
        // setInputs,
        setBatchSize,
        step,
        reset,
        toggleInputNode,
        addNode,
        removeNode,
        addLayer,
        removeLayer,
        // discreet
    }
}