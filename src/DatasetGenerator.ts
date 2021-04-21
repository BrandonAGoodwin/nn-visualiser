import { useEffect, useState } from "react"
import { Dataset, Datapoint2D, DatasetGenerator } from "./datasets";

let GENERATORS: { [datasetType: string]: DatasetGenerator } = {
    "Gaussian2": Dataset.GAUSSIAN_2,
    "Gaussian3": Dataset.GAUSSIAN_3,
    "XOR": Dataset.XOR,
}

const defaultDGConfig = {
    datasetType: "Gaussian2", // Possibly change to use genertor type
    noise: 0.2,
    numSamples: 100
}

export interface DGConfig {
    datasetType: string;
    noise: number;
    numSamples: number;
}

export function useDatasetGenerator(defaultConfig: DGConfig = defaultDGConfig) {
    const [dgConfig, setDGConfig] = useState<DGConfig>(defaultConfig);
    // const [dataset, setDataset] = useState<Datapoint2D[]>([]);
    const [trainingData, setTrainingData] = useState<Datapoint2D[]>([]);
    const [testData, setTestData] = useState<Datapoint2D[]>([]);

    // useEffect(() => {
    //     generateDataset();
    // }, [dgConfig]);


    const generateDataset = () => {
        console.log("Generating dataset");
        let { datasetType, numSamples, noise } = dgConfig;
        let datasetGenerator = GENERATORS[datasetType];
        
        let [newTrainingData, newTestData]: [Datapoint2D[], Datapoint2D[]] = [[], []];
        let negativeClassFlag: boolean = false;
        let positiveClassFlag: boolean = false;
        let counter = 0;
        do {
            negativeClassFlag = false;
            positiveClassFlag = false;
            let dataset = datasetGenerator(numSamples, noise);
            [newTrainingData, newTestData] = splitDataset(dataset);
            newTestData.forEach((d: Datapoint2D) => {
                if(d.y === -1) negativeClassFlag = true;
                if(d.y === 1) positiveClassFlag = true;
            })
            counter++;
        } while ((!negativeClassFlag || !positiveClassFlag) && (counter < 20))
        setTrainingData(newTrainingData);
        setTestData(newTestData);
        // setDataset(dataset)
        // console.log(dataset);
        // return dataset;
    }

    const setDatasetType = (datasetType: string) => {
        setDGConfig((prevConfig) => ({ ...prevConfig, datasetType: datasetType }));
    }

    const setNoise = (noise: number) => {
        setDGConfig((prevConfig) => ({ ...prevConfig, noise: noise }));
    }

    const setNumSamples = (numSamples: number) => {
        setDGConfig((prevConfig) => ({ ...prevConfig, numSamples: numSamples }));
    }

    const splitDataset = (dataset: Datapoint2D[]) => {
        let testDataIndex = Math.floor(dataset.length * 0.8);
        let trainingData = dataset.slice(0, testDataIndex);
        let testData = dataset.slice(testDataIndex, dataset.length);
        return [trainingData, testData];
    }

    return {
        dgConfig,
        generateDataset,
        trainingData,
        testData,
        setDGConfig,
        setTrainingData,
        setTestData,
        setDatasetType,
        setNoise,
        setNumSamples
    }
}