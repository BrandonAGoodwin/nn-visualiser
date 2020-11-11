import * as nn from "./NeuralNet";

describe("Forward Propagation: ", () => {
    let network: nn.Node[][];

    beforeEach(() => {
        network = [[]];
    })

    it("Valid network provided", () => {
        expect(nn.forwardPropagate(network, [2])).toThrowError();
    })
})