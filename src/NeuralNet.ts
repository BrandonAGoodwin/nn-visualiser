
/** Represents a node in the neural network. */
export class Node {

    // Standardise no and num usage

    // Refactor to init variables in the constructor

    id: string;
    /** AKA phi(x) */
    activationFunction: ActivationFunction;

    linksIn: Link[] = [];
    linksOut: Link[] = [];

    /** AKA z = phi(a) */
    totalInput: number = 0.0;

    /** AKA b */
    bias: number = 0.1;
    /** AKA a */
    output: number = 0.0;

    /** AKA dc/da */
    outputDerivative: number = 0.0;
    /** AKA delta */
    inputDerivative: number = 0.0;

    /** Sum of input derivatives over multiple backpropagation iterations to be used for avarage
     * when carring out gradient decent
     */
    accInputDererivatives: number = 0.0;
    /** Number of derivatives accumulated, used to calculate average dc/db for gradient decent */
    numInputDerivatives: number = 0.0;

    /** AKA dc/dw = delta^l . a^l-1 */
    dw: number = 0;
    /** AKA dc/db =  delta^l */
    db: number = 0;

    constructor(id: string, activationFunction: ActivationFunction) {
        this.id = id;
        this.activationFunction = activationFunction;
    }

    // Figure out what happens for input layer (maybe make sure this doesn't get called)
    updateOutput(): number {
        //let prevOutput = this.output;
        this.totalInput = this.bias;
        for (let i = 0; i < this.linksIn.length; i++) {
            this.totalInput += this.linksIn[i].weight * this.linksIn[i].source.output;
        }

        this.output = this.activationFunction.output(this.totalInput);
        //(console.log(`Node ${this.id}: Updated output from ${prevOutput} to ${this.output} diff = ${this.output - prevOutput}`))
        return this.output;
    }
}

export interface ActivationFunction {
    output: (x: number) => number;
    derivative: (input: number) => number;
    range: [number, number];
}

/** Also known as an error or loss function. */
export interface CostFunction {
    cost: (output: number, y: number) => number;
    derivative: (output: number, y: number) => number;
}

/** Polyfill for TANH */
(Math as any).tanh = (Math as any).tanh || function (x: number) {
    if (x === Infinity) {
        return 1;
    } else if (x === -Infinity) {
        return -1;
    } else {
        let e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
};


/** Built in activation functions */
export class Activations {
    public static SIGMOID: ActivationFunction = {
        output: (x: number) => 1.0 / (1.0 + Math.exp(-x)), // Check that this evaluates to higher than 1 d.p.
        derivative: (x: number) => {
            let output = Activations.SIGMOID.output(x);
            return output * (1.0 - output)
        },
        range: [0, 1]
    };
    public static RELU: ActivationFunction = {
        output: (x: number) => Math.max(0, x),
        derivative: (x: number) => x > 0 ? 1 : 0,
        range: [0, 1]
    };
    public static TANH: ActivationFunction = {
        // output: (x: number) => Math.tanh(x),
        output: (x: number) => (Math as any).tanh(x),
        derivative: (x: number) => {
            let output = Activations.TANH.output(x);
            return 1 - output * output;
        },
        range: [-1, 1]
    }
    public static LINEAR: ActivationFunction = {
        output: (x: number) => x,
        derivative: (x: number) => 0,
        range: [-1, 1]
    }
}

/** Built in cost functions (Only using SQUARE for now) */
export class Costs {
    public static SQUARE: CostFunction = {
        cost: (output: number, y: number) => 0.5 * Math.pow(output - y, 2),
        derivative: (output: number, y: number) => output - y
    }
}

/** 
 * Links Nodes together and carries the weight associated with the connected nodes
 * (for now weights are initialised to 0)
 */
export class Link {
    /** Linked node in the previous layer. */
    source: Node;
    /** Linked node in the next layer. */
    dest: Node;

    /** Weight associated to this link.
     *  AKA w
     */
    weight: number;
    /** current cost derivative */
    costDer: number;
    /** Accumulated derivatives */
    derAcc: number;
    /** Number of accumulated derivatives */
    noAccDers: number;

    // Careful of copying a network while acc values aren't zero
    constructor(source: Node, dest: Node, startWeight?: number) {
        this.source = source;
        this.dest = dest;
        this.weight = startWeight ? startWeight : Math.random() - 0.5;
        this.costDer = 0.0;
        this.derAcc = 0.0;
        this.noAccDers = 0.0;
    }
}

/**
 * Builds a neural network. 
 * (Currently without any differing output activation or regularization)
 * @param networkShape The shape of a network where each value in the list
 *      represents the number of neurons in the respective layer.
 * @param activationFunction The activation function for the ouput of each node.
 * @param inputIds List of ids for the input nodes.
 */
export function generateNetwork(
    networkShape: number[],
    activationFunction: ActivationFunction,
    outputActivationFunction: ActivationFunction,
    inputs: { [id: string]: boolean },
): Node[][] {
    let numlayers = networkShape.length;
    let network: Node[][] = [];

    let inputIds: string[] = [];
    Object.keys(inputs).forEach((inputId) => {
        if (inputs[inputId]) inputIds.push(inputId);
    });

    let id = 1;
    // console.log(inputIds)
    for (let layerNum = 0; layerNum < numlayers; layerNum++) {
        let currentLayer: Node[] = [];

        network.push(currentLayer);

        let numNodes = networkShape[layerNum];
        let isInputLayer = layerNum === 0;

        for (let i = 0; i < numNodes; i++) {
            let nodeId = isInputLayer ? inputIds[i] : (id++).toString();
            let isOutputNode = layerNum === numlayers - 1 && i === 0;
            let node = new Node(nodeId, isOutputNode ? outputActivationFunction : activationFunction);
            currentLayer.push(node);

            if (!isInputLayer) {
                // Link nodes from previous layer
                let prevLayer = network[layerNum - 1]
                for (let j = 0; j < prevLayer.length; j++) {
                    let prevNode = prevLayer[j];
                    let link = new Link(prevNode, node);
                    prevNode.linksOut.push(link);
                    node.linksIn.push(link);
                }
            }
        }
    }

    return network;
}

export function forwardPropagate(network: Node[][], inputs: number[]): number {
    let numLayers = network.length;
    let inputLayer = network[0];
    let outputlayer = network[numLayers - 1];

    if (inputLayer.length !== inputs.length) {
        // Check the number of inputs is equal to the number of nodes in the first layer
        throw new Error("Then number of inputs should equal the number of input neurons");
    }

    for (let i = 0; i < inputLayer.length; i++) {
        let node = inputLayer[i];
        node.output = inputs[i];
    }

    for (let layerNum = 1; layerNum < numLayers; layerNum++) {
        let currentLayer = network[layerNum];
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            node.updateOutput();
        }
    }

    return outputlayer[0].output;
}

/**
 * Back propagation algorithm.
 * @param network The neural network to run backprogation on.
 * @param costFunction The cost function used to determing how well the neural network performs.
 * @param y The expected out put of the neural network.
 */
export function backPropagate(network: Node[][], costFunction: CostFunction, y: number): void {

    // Special Case: Last Layer (Single output node) /////////////////////////////////////////

    let outputNode = network[network.length - 1][0];

    // outputDerivative = dc/da
    outputNode.outputDerivative = costFunction.derivative(outputNode.output, y);

    // General Case: Hidden Layers //////////////////////////////////////////////////////////

    for (let layerNum = network.length - 1; layerNum > 0; layerNum--) {
        let currentLayer = network[layerNum];

        // Parse through nodes and calculate input derivatives
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];

            // Calculate input derivative for current node
            // inputDerivative = dc/dz = dc/da . phi_d(z)
            node.inputDerivative = node.outputDerivative * node.activationFunction.derivative(node.totalInput);

            // For average in gradient decent
            // dc/db for the bias on the current node
            node.accInputDererivatives += node.inputDerivative;
            node.numInputDerivatives++;

        }

        // Parse through nodes again to calculate weight derivative for link
        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];
            // dc/dw for each weight comming in
            for (let j = 0; j < node.linksIn.length; j++) {
                let link = node.linksIn[j];

                link.costDer = link.source.output * node.inputDerivative;
                link.derAcc += link.costDer;
                link.noAccDers++;
            }
        }

        // Don't bother computing ouput derivatives for input nodes (Saves on compuiation)
        if (layerNum === 1) continue;

        // Parse through the previous layer and calculate output derivative all the nodes
        let previousLayer = network[layerNum - 1];
        for (let i = 0; i < previousLayer.length; i++) {
            let node = previousLayer[i];
            // Compute the error derivative with respect to each node's output.
            node.outputDerivative = 0;
            for (let j = 0; j < node.linksOut.length; j++) {
                let link = node.linksOut[j];
                node.outputDerivative += link.dest.inputDerivative * link.weight;
            }
        }
    }

}

/**
 * 
 * @param network 
 * @param trainingData 
 * @param costFunction 
 * @param learningRate The hyperparameter that determines how much weights a biases change on each iteration (AKA epsilon)
 */
export function train(network: Node[][], learningRate: number) {

    for (let layerNum = 1; layerNum < network.length; layerNum++) {

        let currentLayer = network[layerNum];

        for (let i = 0; i < currentLayer.length; i++) {
            let node = currentLayer[i];

            for (let j = 0; j < node.linksIn.length; j++) {
                let link = node.linksIn[j];

                if (link.noAccDers > 0) {
                    let averageWeightGradient = link.derAcc / link.noAccDers;
                    link.weight = link.weight - (learningRate * averageWeightGradient);

                    link.derAcc = 0;
                    link.noAccDers = 0;
                }
            }
            if (node.numInputDerivatives > 0) {
                let averageBiasGradient = node.accInputDererivatives / node.numInputDerivatives;

                node.bias = node.bias - (learningRate * averageBiasGradient);

                node.accInputDererivatives = 0;
                node.numInputDerivatives = 0;
            }

        }
    }
}

export function forEachNode(network: Node[][], f: (node: Node) => void, ignoreInputs?: boolean): void {
    for (let layerNum = ignoreInputs ? 1 : 0; layerNum < network.length; layerNum++) {
        let currentLayer = network[layerNum];
        for (let i = 0; i < currentLayer.length; i++) {
            f(currentLayer[i]);
        }
    }
}

export function getOutputNode(network: Node[][]): Node {
    return network[network.length - 1][0];
}

export function copyNetwork(network: Node[][]): Node[][] {
    let networkCopy: Node[][] = [];
    
    for (let layerNum = 0; layerNum < network.length; layerNum++) {
        let currentLayerCopy: Node[] = [];

        networkCopy.push(currentLayerCopy);

        let isInputLayer = layerNum === 0;

        for (let i = 0; i < network[layerNum].length; i++) {
            let nodeOriginal = network[layerNum][i];
            let nodeCopy = new Node(nodeOriginal.id, nodeOriginal.activationFunction);
            currentLayerCopy.push(nodeCopy);

            if (!isInputLayer) {
                let prevLayerCopy = networkCopy[layerNum - 1]
                for (let j = 0; j < prevLayerCopy.length; j++) {
                    let prevNodeCopy = prevLayerCopy[j];

                    let linkOriginal = nodeOriginal.linksIn[j];

                    let linkCopy = new Link(prevNodeCopy, nodeCopy, linkOriginal.weight);
                    prevNodeCopy.linksOut.push(linkCopy);
                    nodeCopy.linksIn.push(linkCopy);
                }
            }
        }
    }

    return networkCopy;
}