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
}

export type LossData = [epoch: number, loss: number];

export interface NetworkState {
    nnConfig: NNConfig;
    dgConfig: DGConfig;
    decisionBoundaries: { [nodeId: string]: number[] }; 
    decisionBoundary: number[]; 
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

export type NetworkController = {
    nnConfig: NNConfig,
    // state: NNState,
    network: nn.Node[][] | undefined,
    analyticsData: AnalyticsData,
    setNNConfig: React.Dispatch<React.SetStateAction<NNConfig>>,
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

export function useNetwork(
    defaultData: NNConfig = defaultNetworkData,
): NetworkController {
    const [nnConfig, setNNConfig] = useState<NNConfig>(defaultData);
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnaLyticsData);

    useEffect(() => {
    }, [nnConfig]);

    const generateNetwork = () => {
        console.log("Generating network");

        setNetwork((prevNetwork) => {
            let newNetwork = vis.start(nnConfig);

            return newNetwork;
        }); 
    }

    const setActivationFunction = (activationFunction: string) => {
        setNNConfig((prev) => {
            if(activationFunction === "Linear" && prev.learningRate > 0.03) {
                return {...prev, activationFunction: activationFunction, learningRate: 0.03}
            }
            return { ...prev, activationFunction: activationFunction }
        });
    }

    const setLearningRate = (learningRate: number) => {
        setNNConfig((prev) => ({ ...prev, learningRate: learningRate }));
    }


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
                return { ...prevConfig, networkShape: prevConfig.networkShape }; 
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

    const step = (trainingData: Datapoint2D[]) => {
        setNetwork((prevNetwork) => {
            prevNetwork && vis.step(prevNetwork, trainingData, nnConfig.learningRate, nnConfig.inputs, nnConfig.batchSize);
            return prevNetwork;
        });
    }

    const reset = () => {
        generateNetwork();
        setAnalyticsData(defaultAnaLyticsData); 
    }

    return {
        nnConfig,
        network,
        analyticsData,
        setNNConfig,
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