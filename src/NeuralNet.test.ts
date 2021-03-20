import * as nn from "./NeuralNet";
import * as vis from "./visControl";
import { Dataset2D } from "./datasets";


describe("Forward Propagation", () => {
    let network: nn.Node[][];
    let inputIds = {
        "x": true,
        "y": false,
        "xSquared": false,
        "ySquared": false,
        "xTimesY": false,
        "sinX": false,
        "sinY": false
    };

    beforeEach(() => {
        network = nn.generateNetwork([1,1], nn.Activations.SIGMOID, nn.Activations.TANH, inputIds);
    })

    it("Valid network provided", () => {
        let input = [0, 0];

        expect(input.length).not.toEqual(network[0].length);
        expect(() => nn.forwardPropagate(network, [0, 0])).toThrow(Error);
    })
})


describe("Back Propagation", () => {
    let network: nn.Node[][];
    let trainingData: Dataset2D[] = [
        {x1: -4, x2: 0, y: -1},
        {x1: 4, x2: 0, y: 1}
    ];
    let learningRate = 0.03;
    let inputs = {
        "x": true,
        "y": false,
        "xSquared": false,
        "ySquared": false,
        "xTimesY": false,
        "sinX": false,
        "sinY": false
    };
    let batchSize = 1;

    beforeEach(() => {
        network = nn.generateNetwork([1,1], nn.Activations.SIGMOID, nn.Activations.TANH, inputs);
    })

    it("Check accumulators change", () => {
        let startWeightAcc = network[1][0].linksIn[0].derAcc;
        let startNoWeightAcc = network[1][0].linksIn[0].noAccDers;

        let startBiasAcc = network[1][0].accInputDererivatives;
        let startNoBiasAcc = network[1][0].numInputDerivatives;

        let sample = trainingData[0]

        vis.step(network, trainingData, learningRate, inputs, batchSize);
        nn.forwardPropagate(network, [sample.x1]);
        nn.backPropagate(network, nn.Costs.SQUARE, sample.y)

        let newWeightAcc = network[1][0].linksIn[0].derAcc;
        let newNoWeightAcc = network[1][0].linksIn[0].noAccDers;

        let newBiasAcc = network[1][0].accInputDererivatives;
        let newNoBiasAcc = network[1][0].numInputDerivatives;

        expect(newWeightAcc).not.toEqual(startWeightAcc);
        expect(newNoWeightAcc).not.toEqual(startNoWeightAcc);
        expect(newNoWeightAcc).toEqual(1);

        expect(newBiasAcc).not.toEqual(startBiasAcc);
        expect(newNoBiasAcc).not.toEqual(startNoBiasAcc);
        expect(newNoBiasAcc).toEqual(1);

    })
})


describe("SGD", () => {
    let network: nn.Node[][];
    let trainingData: Dataset2D[] = [
        {x1: -4, x2: 0, y: -1},
        {x1: 4, x2: 0, y: 1}
    ];
    let learningRate = 0.03;
    let batchSize = 1;
    let inputs = {
        "x": true,
        "y": false,
        "xSquared": false,
        "ySquared": false,
        "xTimesY": false,
        "sinX": false,
        "sinY": false
    };

    beforeEach(() => {
        network = nn.generateNetwork([1,1], nn.Activations.SIGMOID, nn.Activations.TANH, inputs);
    })

    it("Weights change", () => {
        let startWeight = network[1][0].linksIn[0].weight;
        let startBias = network[1][0].bias;

        vis.step(network, trainingData, learningRate, inputs, batchSize);

        let newWeight = network[1][0].linksIn[0].weight;
        let newBias = network[1][0].bias;
        expect(newWeight).not.toEqual(startWeight);
        expect(newBias).not.toEqual(startBias);
    })
})



describe("Network Building", () => {
    let network: nn.Node[][];
    let trainingData: Dataset2D[] = [
        {x1: -4, x2: 0, y: -1},
        {x1: 4, x2: 0, y: 1}
    ];
    let learningRate = 0.03;
    let inputs = {
        "x": true,
        "y": false,
        "xSquared": false,
        "ySquared": false,
        "xTimesY": false,
        "sinX": false,
        "sinY": false
    };

    beforeEach(() => {
        network = nn.generateNetwork([1,1], nn.Activations.SIGMOID, nn.Activations.TANH, inputs);
    })

    it("Correct Input Nodes", () => {

    })
})