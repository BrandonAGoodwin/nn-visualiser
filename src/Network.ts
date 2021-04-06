export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    learningRate: number;
    inputs: { [key: string]: boolean };
    batchSize: number;
}