import React, { useContext, useEffect, useState } from 'react';
import * as vis from '../visControl';
import * as nn from '../NeuralNet';
import { IconButton } from '@material-ui/core';
import styled from '@emotion/styled';
import InfoButton from './InfoButton';
import { GitHub } from '@material-ui/icons';
import { ACTIVATIONS, NetworkController, NetworkState, NNConfig, useNetwork } from '../NetworkController';
import { DGConfig, useDatasetGenerator } from '../DatasetGenerator';
import ConfigBar from './ConfigBar';
import ControlPanel from './ControlPanel';
import InfoPanel from './InfoPanel';
import NetworkPanel from './NetworkPanel';
import StatsBar from './StatsBar';
import GraphPanel from './GraphPanel';
import InsightsPanel from './InsightsPanel';
import { Datapoint2D } from '../datasets';
import { BatchSizeExercise, Exercise, LearningRateExercise } from '../Exercises/Exercise';
import { config } from 'process';

const Container = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    margin: 0px auto auto auto;
    display: grid;
    width: auto;
    /* min-width: 1400px; */
    min-height: 600px;
    transition: padding 0.4s ease-in-out;
    padding: 20px;
    padding-left: 20px;
    padding-right: 20px;
    
    /* max-width: 100%; */

    // Using values from NeuralNetworkVis for middle column
    grid-template-columns: 245px max(560px, calc(50vw + 10px)) min-content;
    grid-template-rows: 100px auto 1fr auto;
    /* grid-template-rows: 90px 1fr 80px auto; */
    grid-gap: 15px;
    grid-template-areas: 
        "config-bar config-bar config-bar"
        "control-panel network nn-graph"
        "insights network nn-graph"
        "info info info";
`;

const StyledLinkButton = styled(IconButton)`
    color: #ffffff;
`;

const LinksDiv = styled("div")`
    display: flex;
    align-content: flex-end;
`;

export const ContainerSection = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    grid-area: ${(props: { gridArea: string }) => (props.gridArea)};
    background-color: white;
    margin: auto auto;
    width: 100%;
    height: 100%;
    padding: 5px;
    border-radius: 30px;
    border: 2px solid #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;


export const StyledInfoButton = styled(InfoButton)`
    font-size: 14px;
`

interface MainPageProps {
    xDomain: number[];
    yDomain: number[];
    numCells: number;
    updateComparisionData: (currentState: NetworkState, savedState: NetworkState | undefined) => void;
    dgConfig: DGConfig;
    networkController: NetworkController;
}

function MainPage(props: MainPageProps) {

    const {
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
        removeLayer
    } = props.networkController;

    const {
        dgConfig,
        generateDataset,
        trainingData,
        testData,
        setDGConfig,
        setTrainingData,
        setTestData,
        setDatasetType,
        setNoise,
        setNumSamples,
    } = useDatasetGenerator(props.dgConfig);

    const [decisionBoundaries, setDecisionBoundaries] = useState<{ [nodeId: string]: number[] }>({});
    const [decisionBoundary, setDecisionBoundary] = useState<number[]>([]);
    const [epochs, setEpochs] = useState<number>(0);
    const [discreetBoundary, setDiscreetBoundary] = useState<boolean>(false);
    const [training, setTraining] = useState<boolean>(false);
    const [trainingInterval, setTrainingInterval] = useState<number>();
    const [compareMode, setCompareMode] = useState<boolean>(false);
    const [networkOriginalState, setNetworkOriginalState] = useState<nn.Node[][]>();
    // // const [networkSaveState, setNetworkSaveState] = useState<nn.Node[][]>();
    // const [comparisonAnalyticsData, setComparisonAnalyticsData] = useState<AnalyticsData>()
    const [comparisonData, setComaparisonData] = useState<NetworkState>();
    const [importedFile, setImportedFile] = useState<any>();
    const [importedNetwork, setImportedNetwork] = useState<nn.Node[][]>();
    const [importedDataset, setImportedDataset] = useState<[Datapoint2D[], Datapoint2D[]]>();
    const [exercise, setExercise] = useState<Exercise>();

    useEffect(() => {
        updateDecisionBoundary();
    }, [decisionBoundaries]);

    useEffect(() => {
        console.log("Network change useEffect");
        updateDecisionBoundaries();
        (!compareMode) && network && setNetworkOriginalState(vis.copyNetwork(network));
    }, [network]);


    useEffect(() => {
        console.log("Dataset/Noise change useEffect");
        if (!importedNetwork && !exercise) {
            handleReset(false);
            const numTrainingSamples = Math.floor(dgConfig.numSamples * 0.8);
            if (nnConfig.batchSize > numTrainingSamples) {
                setBatchSize(numTrainingSamples);
            }
        } else {
            console.log("Setting imported network");


            if (exercise) {
                handleReset(false);
            } else {
                importedNetwork && setNetwork(importedNetwork);
                setImportedNetwork(undefined);
            }
            setEpochs(0);
        }
    }, [nnConfig]);


    useEffect(() => {
        if (!importedDataset && !exercise) {
            generateDataset();
            loadNetworkState();
        } else {
            console.log("Setting imported dataset");
            if (importedDataset) {
                console.log("hi")
                let [importedTrainingData, importedTestData] = importedDataset;
                setTrainingData(importedTrainingData);
                setTestData(importedTestData);
                setImportedDataset(undefined);
            }
        }

    }, [dgConfig]);


    useEffect(() => {
        network && (epochs != 0) && setAnalyticsData((prevAnalyticsData) => {
            if (prevAnalyticsData) {
                const { trainingLossData, testLossData } = prevAnalyticsData;
                let newTrainingLossData = trainingLossData.concat([[epochs, vis.getCost(network, trainingData, nnConfig.inputs)]]);
                let newTestLossData = testLossData.concat([[epochs, vis.getCost(network, testData, nnConfig.inputs)]]);
                return { trainingLossData: newTrainingLossData, testLossData: newTestLossData, epochs: epochs };
            }
            return prevAnalyticsData;
        });

    }, [epochs]);


    useEffect(() => {
        props.updateComparisionData(getNetworkState, comparisonData);
    }, [analyticsData, comparisonData]);


    useEffect(() => {
        if (importedFile && !exercise) {
            let fileReader = new FileReader();
            fileReader.onloadend = function (e) {

                const networkString = fileReader.result;
                // console.log(networkString);

                if (typeof networkString === "string") {
                    const { nnConfig, dgConfig } = vis.StringToNetwork(networkString);

                    setNNConfig(nnConfig);
                    setDGConfig(dgConfig);
                }
            }
            fileReader.readAsText(importedFile);
            setImportedFile(undefined);
        }
    }, [importedFile]);


    useEffect(() => {
        if (exercise) {
            const { networkString } = exercise;

            const { nnConfig, dgConfig } = vis.StringToNetwork(networkString);
            setNNConfig(nnConfig);
            setDGConfig(dgConfig);

        } else {
            setImportedNetwork(undefined);
            updateDecisionBoundaries();
        }
    }, [exercise]);

    const updateDecisionBoundaries = () => {
        console.log("Updating decision boundaries");
        if (network) {
            setDecisionBoundaries(vis.getAllDecisionBoundaries(network, 20, props.xDomain, props.yDomain, nnConfig.inputs));
        }
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        network && setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain, nnConfig.inputs));
    }

    const handleReset = (resetDataset: boolean = true) => {
        console.log("Reset");
        if (training) toggleAutoTrain();
        if (exercise) {
            console.log(importedNetwork)
            importedNetwork && setNetwork(vis.copyNetwork(importedNetwork));
            setAnalyticsData({ trainingLossData: [], testLossData: [], epochs: 0 });
        } else {
            reset();
            // if(networkOriginalState) {
            // networkOriginalState && loadNetworkState();
            // } else {
            //     reset();
            // }
        }
        setEpochs(0);
        if (!compareMode && resetDataset && !exercise) generateDataset();
    };

    const handleStep = () => {
        console.log("HandleStep")
        step(trainingData);
        setEpochs((prevEpochs) => prevEpochs + 1);
        updateDecisionBoundaries();
    }

    const downloadNetwork = () => {
        if (network) {
            const element = document.createElement("a");
            const file = new Blob([vis.NetworkToString(network, nnConfig, dgConfig, trainingData, testData)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "NetworkConfig.txt";
            document.body.appendChild(element);
            element.click();
        }
    }

    const downloadOriginalNetwork = () => {
        if (networkOriginalState) {
            const element = document.createElement("a");
            const file = new Blob([vis.NetworkToString(networkOriginalState, nnConfig, dgConfig, trainingData, testData)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "NetworkConfig.txt";
            document.body.appendChild(element);
            element.click();
        }
    }


    const importNetworkConfig = (file: File) => {
        setImportedFile(file);
        let fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            const networkString = fileReader.result;
            // console.log(networkString);
            if (typeof networkString === "string") {
                const { network, trainingData, testData } = vis.StringToNetwork(networkString);
                setImportedNetwork(network);
                setImportedDataset([trainingData, testData]);
            }
        }
        fileReader.readAsText(file);
        if (training) toggleAutoTrain();
        setEpochs(0);
        setAnalyticsData({ trainingLossData: [], testLossData: [], epochs: 0 });
    }



    const toggleDiscreetOutput = () => {
        setDiscreetBoundary((prevDiscreetBoundary) => !prevDiscreetBoundary);
    }

    const handleRegenerateDataset = () => {
        generateDataset();
        if (training) toggleAutoTrain();
    }

    const saveComparisionData = () => {
        let newComparisionData: NetworkState = {
            nnConfig: nnConfig,
            dgConfig: dgConfig,
            decisionBoundaries: decisionBoundaries,
            decisionBoundary: decisionBoundary,
            analyticsData: analyticsData
        }

        setComaparisonData(newComparisionData);
    }

    const getNetworkState = ({
        nnConfig: nnConfig,
        dgConfig: dgConfig,
        decisionBoundaries: decisionBoundaries,
        decisionBoundary: decisionBoundary,
        analyticsData: analyticsData
    });


    const toggleAutoTrain = () => {
        setTraining((training) => {
            if (training) {
                clearInterval(trainingInterval);
            } else {
                setTrainingInterval(setInterval(() => {
                    handleStep();
                }, 500));
            }
            return !training;
        })
    }

    const saveNetworkState = () => {
        saveComparisionData();
        setCompareMode(true);
    }

    const loadNetworkState = () => {
        networkOriginalState && setNetwork(vis.copyNetwork(networkOriginalState));
        setEpochs(0);
        setAnalyticsData({ trainingLossData: [], testLossData: [], epochs: 0 });
        // Maybe load in original data set too (maybe make it a separate button)
    }

    const clearNetworkState = () => {
        setComaparisonData(undefined);
        setCompareMode(false);
    }

    const closeExercise = () => {
        setExercise(undefined);
    }

    const startExercise = (exercise: Exercise) => {
        clearNetworkState();
        setExercise(exercise);
        const { networkString } = exercise;
        let { network, trainingData, testData } = vis.StringToNetwork(networkString)
        setImportedNetwork(network);
        setImportedDataset([trainingData, testData]);
    }

    const setBatchSizeExercise = () => {
        startExercise(BatchSizeExercise);
    }

    const setLearningRateExercise = () => {
        startExercise(LearningRateExercise);
    }

    return (
        <Container id="main-page">
            <ConfigBar
                nnConfig={nnConfig}
                dgConfig={dgConfig}
                setActivationFunction={setActivationFunction}
                setLearningRate={setLearningRate}
                setDatasetType={setDatasetType}
                setNoise={setNoise}
                setNumSamples={setNumSamples}
                setBatchSize={setBatchSize}
                handleRegenerateDataset={generateDataset}
                downloadNetwork={downloadNetwork}
                downloadOriginalNetwork={downloadOriginalNetwork}
                importNetworkConfig={importNetworkConfig}
                setBatchSizeExercise={setBatchSizeExercise}
                setLearningRateExercise={setLearningRateExercise}
                exercise={exercise}
            />
            <ControlPanel
                training={training}
                compareMode={compareMode}
                handleStep={handleStep}
                toggleAutoTrain={toggleAutoTrain}
                toggleDiscreetOutput={toggleDiscreetOutput}
                handleRegenerateDataset={handleRegenerateDataset}
                handleReset={handleReset}
                saveNetworkState={saveNetworkState}
                loadNetworkState={loadNetworkState}
                clearNetworkState={clearNetworkState}
            />
            <InsightsPanel
                nnConfig={nnConfig}
                dgConfig={dgConfig}
                analyticsData={analyticsData}
                exercise={exercise}
                handleSetLearningRateExercise={setLearningRateExercise}
            />
            <GraphPanel
                network={network}
                trainingData={trainingData}
                testData={testData}
                numCells={props.numCells}
                xDomain={props.xDomain}
                yDomain={props.yDomain}
                decisionBoundary={decisionBoundary}
                discreetBoundary={discreetBoundary}
                toggleDiscreetBoundary={toggleDiscreetOutput}
                analyticsData={analyticsData}
                comparisonAnalyticsData={comparisonData?.analyticsData}
                comparisonData={comparisonData}
                domain={ACTIVATIONS["Tanh"].range}
            />
            { network && <NetworkPanel
                network={network}
                decisionBoundaries={decisionBoundaries}
                discreetBoundary={discreetBoundary}
                inputs={nnConfig.inputs}
                config={nnConfig}
                networkWidth={650}
                networkHeight={550}
                handleOnClick={toggleInputNode}
                addNode={addNode}
                removeNode={removeNode}
                addLayer={addLayer}
                removeLayer={removeLayer}
                hiddenDomain={ACTIVATIONS[nnConfig.activationFunction].range}
                outputDomain={ACTIVATIONS["Tanh"].range}
                exercise={exercise}
                closeExercise={closeExercise}
            />}
            <InfoPanel />
            <LinksDiv>
                <a href="https://git-teaching.cs.bham.ac.uk/mod-ug-proj-2020/bxg796" target="_blank">
                    <StyledLinkButton>
                        <GitHub color="inherit" />
                    </StyledLinkButton>
                </a>
            </LinksDiv>
        </Container>
    );
}

export default MainPage;

// function defaultAnalyticsData(defaultAnalyticsData: any) {
//     throw new Error('Function not implemented.');
// }
