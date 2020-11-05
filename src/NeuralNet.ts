
/** Represents a node in the neural network. */
export class Node {
    id: string;
    activationFunction: ActivationFunction;

    linksIn: Link[] = [];
    linksOut: Link[] = [];

    totalInput: number;

    bias: number;
    output: number;

    constructor(id: string, activationFunction: ActivationFunction){
        this.id = id;
        this.activationFunction = activationFunction;
    }

    // Figure out what happens for input layer (maybe make suyre this doesn't get called)
    updateOutput(): number {
        this.totalInput = this.bias;
        for(let i = 0; i < this.linksIn.length; i++) {
            this.totalInput += this.linksIn[i].weight * this.linksIn[i].source.output; 
        }

        this.output = this.activationFunction.output(this.totalInput);

        return this.output;
    }
}

export interface ActivationFunction {
    output: (x: number) => number;
    derivative: (input: number) => number;
}

/** Also known as an error or loss function. */
export interface CostFunction {
    cost: (output: number, y: number) => number;
    derivative: (output: number, y: number) => number;
}

/** Built in activation functions */
export class Activations {
    public static SIGMOID: ActivationFunction = {
        output: (x: number) => 1.0 / (1.0 + Math.exp(-x)), // Check that this evaluates to higher than 1 d.p.
        derivative: (x: number) => {
            let output = Activations.SIGMOID.output(x);
            return output * (1 - output)
        }
    };
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
    source: Node;
    dest: Node;
    weight: number;

    constructor(source: Node, dest: Node) {
        this.source = source;
        this.dest = dest;
        this.weight = 0.0;
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
    inputIds: string[],
): Node[][] {
    let numlayers = networkShape.length;
    let network: Node[][] = [];

    let id = 1;

    for(let layerNum = 0; layerNum < numlayers; layerNum++) {
        let currentLayer: Node[];

        network.push(currentLayer);

        let numNodes = networkShape[layerNum];
        let isInputLayer = layerNum === 0;
        let isOutputLayer = layerNum === numlayers - 1;

        for(let i = 0; i < numNodes; i++) {
            let nodeId = isInputLayer ? inputIds[i] : (id++).toString();

            let node = new Node(nodeId, activationFunction);
            currentLayer.push(node);

            if(!isInputLayer) {
                // Link nodes from previous layer
                let prevLayer = network[layerNum - 1]
                for(let j = 0; j < prevLayer.length; j++) {
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