import * as nn from "./NeuralNet";
import * as vis from "./visControl";
import { Dataset } from "./datasets";


describe("Gradient Decent", () => {
    let network: nn.Node[][];

    let trainingData = Dataset.GAUSSIAN_2(30, 0);
    let learningRate = 0.03;
    let noSteps = 300;
    let defaultNetworkShape = [2, 1];
    let defaultInputs = {
        "x": true,
        "y": true,
        "xSquared": false,
        "ySquared": false,
        "xTimesY": false,
        "sinX": false,
        "sinY": false
    };
    let defaultOutputActivation = nn.Activations.TANH;
    let defaultBatchSize = 10;


    it("Sigmoid", () => {
        network = nn.generateNetwork(defaultNetworkShape, nn.Activations.SIGMOID, defaultOutputActivation, defaultInputs);
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, trainingData, learningRate, defaultInputs, defaultBatchSize);
        }

        for (let i = 0; i < trainingData.length; i++) {
            let datapoint = trainingData[i];
            let prediction = nn.forwardPropagate(network, vis.constructInputs(datapoint.x1, datapoint.x2, defaultInputs)) > 0 ? 1 : -1;
            expect(prediction).toEqual(datapoint.y);
        }

    })

    it("ReLU", () => {
        network = nn.generateNetwork(defaultNetworkShape, nn.Activations.RELU, defaultOutputActivation, defaultInputs);
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, trainingData, learningRate, defaultInputs, defaultBatchSize);
        }

        for (let i = 0; i < trainingData.length; i++) {
            let datapoint = trainingData[i];
            let prediction = nn.forwardPropagate(network, vis.constructInputs(datapoint.x1, datapoint.x2, defaultInputs)) > 0 ? 1 : -1;
            expect(prediction).toEqual(datapoint.y);
        }

    })

    it("Long ReLU", () => {
        let longNetworkShape = [2, 1, 1, 1];
        network = nn.generateNetwork(longNetworkShape, nn.Activations.RELU, defaultOutputActivation, defaultInputs);
        for (let i = 0; i < 50; i++) {
            vis.step(network, trainingData, learningRate, defaultInputs, defaultBatchSize);
        }

        for (let i = 0; i < trainingData.length; i++) {
            let datapoint = trainingData[i];
            let prediction = nn.forwardPropagate(network, vis.constructInputs(datapoint.x1, datapoint.x2, defaultInputs)) > 0 ? 1 : -1;
            expect(prediction).toEqual(datapoint.y);
        }

    })
})
