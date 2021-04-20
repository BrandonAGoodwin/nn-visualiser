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

export let ACTIVATIONS: { [name: string]: nn.ActivationFunction } = {
    "Tanh": nn.Activations.TANH,
    "ReLU": nn.Activations.RELU,
    "Sigmoid": nn.Activations.SIGMOID,
    "Linear": nn.Activations.LINEAR,
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
    // noise: number;
    // datasetType: string;
    // numSamples: number;
}

export type LossData = [epoch: number, loss: number];

// Maybe there should only be one input 
// Maybe rename or split this up differently
// Or split this up into properties that are needed to define a network and ones that are generated by the network
export interface NetworkState {
    nnConfig: NNConfig;
    dgConfig: DGConfig;
    decisionBoundaries: { [nodeId: string]: number[] }; // Maybe make this a type
    decisionBoundary: number[]; // Should either be renamed to outputDecisionBoundary, removed entirely and use a get outputNodeId to access
    analyticsData: AnalyticsData;
}



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

export type NetworkController = {
    nnConfig: NNConfig,
    state: NNState,
    network: nn.Node[][] | undefined,
    analyticsData: AnalyticsData,
    setNetwork: (network: nn.Node[][]) => void;
    setActivationFunction: (activationFunction: string) => void,
    setLearningRate: (learningRate: number) => void,
    setBatchSize: (batchSize: number) => void,
    setAnalyticsData: React.Dispatch<React.SetStateAction<AnalyticsData>>,
    step: (trainingData: Datapoint2D[]) => void,
    reset: () => void,
    toggleInputNode: (nodeId: string, active: boolean) => void,
    addNode: (layerNum: number) => void,
    removeNode: (layerNum: number) => void,
    addLayer: () => void,
    removeLayer: () => void
}

// Maybe remove dataset related stuff from this
export function useNetwork(
    defaultData: NNConfig = defaultNetworkData,
    defaultState: NNState = defaultNetworkState
): NetworkController {
    const [nnConfig, setNNConfig] = useState<NNConfig>(defaultData);
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnaLyticsData);
    // const [compAnalyticsData, setCompAnalyticsData] = useState<AnalyticsData>();
    const [compareMode, setCompareMode] = useState<boolean>(false);
    const [state, setState] = useState<NNState>(defaultState); // Maybe refactor to networkState or something else


    useEffect(() => {
        // console.log("Config change useEffect");
        reset();
    }, [nnConfig]);


    // useEffect(() => {
    //     updateDecisionBoundary();
    // }, [decisionBoundaries]);

    // useEffect(() => {
    //     console.log("Config change useEffect");
    //     updateDecisionBoundaries();
    // }, [network]);

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
                return { ...prevConfig, networkShape: newNetworkShape };
            } else {
                return prevConfig;
            }
        });
    }

    const removeNode = (layerNum: number) => {
        console.log("Running removeNode");
        setNNConfig((prevConfig) => {
            if (nnConfig.networkShape[layerNum] > 1) {
                prevConfig.networkShape[layerNum] = prevConfig.networkShape[layerNum] - 1;
                return { ...prevConfig, networkShape: prevConfig.networkShape }; // Probably only remove node or add node will work
            } else {
                return prevConfig;
            }
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
                return { ...prevConfig, networkShape: newNetworkShape };
            } else {
                return prevConfig;
            }

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
                return { ...prevConfig, networkShape: newNetworkShape };
            } else {
                return prevConfig;
            }

        });
    }

    // Might not work because config values aren't aquired from setConfig function call
    const step = (trainingData: Datapoint2D[]) => {
        setNetwork((prevNetwork) => {
            prevNetwork && vis.step(prevNetwork, trainingData, nnConfig.learningRate, nnConfig.inputs, nnConfig.batchSize);
            return prevNetwork;
        });
    }

    const reset = () => {
        generateNetwork();
        setAnalyticsData(defaultAnaLyticsData); // Probably causing issues in conjuction with epochs use effectr
        // setEpochs(0);
        // setState((prevState) => ({ ...defaultNetworkState, compareMode: prevState.compareMode }));
    }

    return {
        nnConfig,
        state,
        network,
        analyticsData,
        setNetwork,
        setActivationFunction,
        setLearningRate,
        setBatchSize,
        setAnalyticsData,
        step,
        reset,
        toggleInputNode,
        addNode,
        removeNode,
        addLayer,
        removeLayer,
    }
}