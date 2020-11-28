import * as nn from "./NeuralNet";
import * as vis from "./visControl";
import { Dataset } from "./datasets";


describe("Gradient Decent", () => {
    let network: nn.Node[][];

    let trainingData = Dataset.GAUSSIAN(30, 0);
    let learningRate = 0.03;
    let noSteps = 300;
    let defaultNetworkShape = [2, 1];
    let defaultInputIds = ["x", "y"];
    let defaultOutputActivation = nn.Activations.TANH;
    let defaultBatchSize = 10;


    it("Sigmoid", () => {
        network = nn.generateNetwork(defaultNetworkShape, nn.Activations.SIGMOID, defaultOutputActivation, defaultInputIds);
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, trainingData, learningRate, defaultInputIds, defaultBatchSize);
        }

        for (let i = 0; i < trainingData.length; i++) {
            let datapoint = trainingData[i];
            let prediction = nn.forwardPropagate(network, vis.constructInputs(datapoint.x1, datapoint.x2, defaultInputIds)) > 0 ? 1 : -1;
            expect(prediction).toEqual(datapoint.y);
        }

    })

    it("ReLU", () => {
        network = nn.generateNetwork(defaultNetworkShape, nn.Activations.RELU, defaultOutputActivation, defaultInputIds);
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, trainingData, learningRate, defaultInputIds, defaultBatchSize);
        }

        for (let i = 0; i < trainingData.length; i++) {
            let datapoint = trainingData[i];
            let prediction = nn.forwardPropagate(network, vis.constructInputs(datapoint.x1, datapoint.x2, defaultInputIds)) > 0 ? 1 : -1;
            expect(prediction).toEqual(datapoint.y);
        }

    })
})
