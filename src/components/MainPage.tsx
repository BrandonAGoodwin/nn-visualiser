import React, { useContext, useEffect, useState } from 'react';
import * as vis from '../visControl';
import { Datapoint2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button, InputLabel, MenuItem, Select, FormControl, Typography, Divider, IconButton } from '@material-ui/core';
import * as nn from './../NeuralNet';
import styled from '@emotion/styled';
import LabeledSlider from './Slider';
import InfoButton from './InfoButton';
import DefaultInfoPanel from './InfoPanels/DefaultInfoPanel';
import LearningInfoRatePanel from './InfoPanels/LearningRateInfoPanel';
import ActivationInfoPanel from './InfoPanels/ActivationInfoPanel';
import { ArrowBackIos, ArrowForwardIos, GitHub, Home } from '@material-ui/icons';
import DatasetInfoPanel from './InfoPanels/DatasetInfoPanel';
import NeuralNetworkVis from './NeuralNetworkVis';
import LossGraph from './LossGraph';
import LossInfoPanel from './InfoPanels/LossInfoPanel';
import { DefinedTerm, DefX1, DefX2 } from './Definitions';
import { ThemeContext } from '../contexts/ThemeContext';
import ColourScale from './ColourScale';
import { NNConfig, useNetwork } from '../NetworkController';
import { InfoPanelContext } from '../contexts/InfoPanelContext';
import { DGConfig, useDatasetGenerator } from '../DatasetGenerator';
import ConfigBar from './ConfigBar';
import ControlPanel from './ControlPanel';

interface PageProps {
    xDomain: number[];
    yDomain: number[];
    numCells: number;
    updateComparisionData: (currentState: NetworkState, savedState: NetworkState) => void;
    nnConfig: NNConfig;
    dgConfig: DGConfig;
}

// const StyledButton = styled(Button)`
//     margin: 5px;
// `;

const StyledFormControl = styled(FormControl)`
    margin-left: 10px;
    min-width: 130px;
    background-color: inherit;
`;

const StyledSelect = styled(Select)`
    background-color: inherit;
`;

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
    grid-template-columns: 230px max(560px, calc(50vw + 10px)) min-content;
    grid-template-rows: 90px 1fr 80px auto;
    grid-gap: 15px;
    grid-template-areas: 
        "config-bar config-bar config-bar"
        "control-panel network nn-graph"
        "stats stats stats"
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


const NetworkPanel = styled((props: any) => <ContainerSection gridArea="network" {...props} />)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* max-width: fit-content; */
`

const GraphPanel = styled((props: any) => <ContainerSection gridArea="nn-graph" {...props} />)`
    display: block;
`

const StatsBar = styled((props: any) => <ContainerSection gridArea="stats" {...props} />)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 0px;
    justify-content: space-around;
    align-items: center;
`;

const InfoPanel = styled((props: any) => <ContainerSection gridArea="info" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding-left: 30px;
    padding-top: 10px;
    position: relative;
    max-width: inherit;
    /* max-width: fit-content; */
`;

export const StyledInfoButton = styled(InfoButton)`
    font-size: 14px;
`

const ColouredBox = styled("div")`
    float: left;
    height: 1em;
    width: 1em;
    border: 1px solid black;
    background-color: ${((props: { colour: string }) => props.colour)};
    clear: both;
    margin-right: 5px;
`

export interface NetworkState {
    noise: number;
    datasetType: string;
    dataset: Datapoint2D[];
    config: NNConfig;
    decisionBoundaries: { [nodeId: string]: number[] };
    decisionBoundary: number[];
    loss: number;
    epochs: number;
    lossData: [number, number][];
}

function MainPage(props: PageProps) {
    const { minColour,
        minColourName,
        maxColour,
        maxColourName,
        midColour
    } = useContext(ThemeContext);

    const {
        infoPanelData,
        setInfoPanelWrapper,
        handleInfoPanelForward,
        handleInfoPanelBackward,
        handleInfoPanelHome
    } = useContext(InfoPanelContext);

    const {
        nnConfig,
        network,
        setActivationFunction,
        setLearningRate,
        setBatchSize,
        step,
        reset,
        toggleInputNode,
        addNode,
        removeNode,
        addLayer,
        removeLayer
    } = useNetwork(props.nnConfig);

    const {
        dgConfig,
        generateDataset,
        trainingData,
        testData,
        setDatasetType,
        setNoise,
        setNumSamples,
    } = useDatasetGenerator(props.dgConfig);

    const [decisionBoundaries, setDecisionBoundaries] = useState<{ [nodeId: string]: number[] }>({});
    const [decisionBoundary, setDecisionBoundary] = useState<number[]>([]);
    const [loss, setLoss] = useState<number>(0);
    const [epochs, setEpochs] = useState<number>(0);
    const [discreetBoundary, setDiscreetBoundary] = useState<boolean>(false);
    const [lossData, setLossData] = useState<[number, number][]>([]);
    const [training, setTraining] = useState<boolean>(false);
    const [trainingInterval, setTrainingInterval] = useState<number>();
    const [compareMode, setCompareMode] = useState<boolean>(false);
    // const [networkOriginalState, setNetworkOriginalState] = useState<nn.Node[][]>();
    // // const [networkSaveState, setNetworkSaveState] = useState<nn.Node[][]>();

    const [comparisonData, setComaparisonData] = useState<NetworkState>();

    useEffect(() => {
        console.log("Config change useEffect");
        if (training) toggleAutoTrain();
        // generateNetwork();
        generateDataset();
    }, [nnConfig, dgConfig]);

    useEffect(() => {
        updateDecisionBoundary();
    }, [decisionBoundaries]);

    useEffect(() => {
        console.log("Network change useEffect");
        updateDecisionBoundaries();
    }, [network]);


    // useEffect(() => {
    //     console.log("Dataset/Noise change useEffect");
    //     rese(); // Change reset implementation
    // }, [datasetType, noise, numSamples]);

    useEffect(() => {
        if (epochs === 0 || !network) return;
        setLossData(lossData => lossData.concat([[epochs, vis.getCost(network, trainingData, nnConfig.inputs)]]));
    }, [epochs]);


    // const generateDataset = () => {
    //     console.log("Generating dataset");
    //     setDataset(vis.getDataset(datasetType, numSamples, noise));
    // }

    // const generateNetwork = () => {
    //     console.log("Generating network");

    //     if (!compareMode) {
    //         let newNetwork = vis.start(config);
    //         setNetwork(newNetwork);
    //         let newNetworkCopy = vis.copyNetwork(newNetwork);
    //         console.log(newNetworkCopy);
    //         setNetworkOriginalState(newNetworkCopy);
    //     } else {
    //         console.log("Loading network original state");
    //         if (networkOriginalState) {
    //             console.log(networkOriginalState);
    //             setNetwork(vis.copyNetwork(networkOriginalState));
    //         }
    //     }
    //     setEpochs(0);
    //     setLossData([]);
    // }

    const updateDecisionBoundaries = () => {
        console.log("Updating decision boundaries");
        if (network) {
            // Don't like numcells having to be the same
            setDecisionBoundaries(vis.getAllDecisionBoundaries(network, 20, props.xDomain, props.yDomain, nnConfig.inputs));
            trainingData && setLoss(vis.getCost(network, trainingData, nnConfig.inputs));
        }
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        network && setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain, nnConfig.inputs));
    }

    const handleReset = () => {
        console.log("Reset");
        if (training) toggleAutoTrain();
        reset();// generateNetwork();
        setEpochs(0);
        setLossData([]);
        if (!compareMode) generateDataset();
    };

    const handleStep = () => {
        console.log("HandleStep")
        step(trainingData);
        setEpochs((prevEpochs) => prevEpochs + 1);
        updateDecisionBoundaries();
    }
    // const step = (noSteps: number) => {
    //     console.log(`MainPage step(${noSteps})`);
    //     if (!network || !dataset) return;

    //     let start = Date.now();
    //     for (let i = 0; i < noSteps; i++) {
    //         vis.step(network, dataset, config.learningRate, config.inputs, config.batchSize);
    //         setEpochs(epochs => epochs + 1);
    //     }

    //     let delta = Date.now() - start;
    //     // console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);

    //     start = Date.now();
    //     updateDecisionBoundaries();
    //     delta = Date.now() - start;
    //     // console.log(`Finsihed updating decision boundaries (Duration ${delta}ms)`);
    //     // console.log(lossData);
    // };

    const toggleDiscreetOutput = () => {
        setDiscreetBoundary((prevDiscreetBoundary) => !prevDiscreetBoundary);
    };

    const handleActivationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        // setConfig({ ...config, activationFunction: e.target.value as string });
        // Method 1
        setActivationFunction(e.target.value as string); // ??
        // Method 2
        // let networkController = useNetwork(props.nnConfig, props.nnState);
        // Do I want a whole new controller made or just to change the current one?
    };

    // const handleLearningRateChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    //     // setConfig({ ...config, learningRate: e.target.value as number });
    //     setLearningRate(e.target.value as number);
    // };

    // const handleDatasetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    //     setDatasetType(e.target.value as string);
    // };

    const handleRegenerateDataset = () => {
        generateDataset();
        if (training) toggleAutoTrain();
    };

    // const handleNoiseChange = (e: any, newValue: number | number[]) => {
    //     setNoise(newValue as number);
    // };

    // const handleNumSamplesChange = (e: any, newValue: number | number[]) => {
    //     setNumSamples(newValue as number);
    // }

    // const handleBatchSizeChange = (e: any, newValue: number | number[]) => {
    //     // setConfig({ ...config, batchSize: newValue as number });
    //     setBatchSize(newValue as number);
    // }

    // const handleInputNodeClick = (nodeId: string, active: boolean) => {
    //     // console.log(`Input node click (NodeId: ${nodeId}, Active: ${active})`);
    //     // Change this implemntation input is highly coupled with visControl
    //     toggleInputNode(nodeId, active);
    // }

   

    // const saveComparisionData = () => {
    //     let newComparisionData: NetworkState = {
    //         config: config,
    //         dataset: dataset,
    //         datasetType: datasetType,
    //         decisionBoundaries: decisionBoundaries,
    //         decisionBoundary: decisionBoundary,
    //         epochs: epochs,
    //         loss: loss,
    //         lossData: lossData,
    //         noise: noise
    //     }

    //     setComaparisonData(newComparisionData);
    // }

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

    // const saveNetworkState = () => {
    //     setCompareMode(true);
    // }

    // const loadOriginalState = () => {

    // }

    // const saveCurrentState = () => {
    //     saveComparisionData();
    //     setCompareMode(true);
    // }

    // const loadSavedState = () => {
    //     handleReset(); // This is defo broken
    // }

    // const clearNetworkState = () => {
    //     setComaparisonData(undefined);
    //     setCompareMode(false);
    // }



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
            />
            <ControlPanel
                training={training}
                handleStep={handleStep}
                toggleAutoTrain={toggleAutoTrain}
                toggleDiscreetOutput={toggleDiscreetOutput}
                handleRegenerateDataset={handleRegenerateDataset}
                handleReset={handleReset}
            />

            <GraphPanel>
                <div style={{ display: "flex", marginLeft: "25px" }}>
                    <Typography variant="h6">Output</Typography>
                    <StyledInfoButton title="Output Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<LossInfoPanel {...nnConfig} />}>
                        <React.Fragment>
                            <Typography color="inherit">Output</Typography>
                            <Typography variant="body2">This graph shows the final output of the neural network in the domain (-8, +8) for both the <DefinedTerm definition={DefX1()}>X<sub>1</sub></DefinedTerm> and <DefinedTerm definition={DefX2()}>X<sub>2</sub></DefinedTerm> features.<br /> The samples in the data sets used only have 2 classes (-1 and +1); the neural network defines a decision boundary so that points that are in<br /> {minColourName} <ColouredBox colour={minColour} /> sections of the graph are classified as class -1 and points that are in <br /> {maxColourName} <ColouredBox colour={maxColour} /> sections of the graph are classified as class +1.</Typography><br />
                        </React.Fragment>
                    </StyledInfoButton>
                    <ColourScale
                        width={150}
                        height={15}
                        maxColour={maxColour}
                        minColour={minColour}
                        midColour={midColour}
                        maxValue={1}
                        minValue={-1}
                        midValue={0}
                        numShades={100}
                        horizontal={true}
                    />
                </div>
                {trainingData && network && <NNGraph
                    dataset={trainingData}
                    density={25}
                    canvasWidth={250}
                    marginLeft={35}
                    marginRight={20}
                    marginTop={20}
                    marginBottom={40}
                    numCells={props.numCells}
                    xDomain={props.xDomain}
                    yDomain={props.yDomain}
                    decisionBoundary={decisionBoundary}
                    discreetBoundary={discreetBoundary}
                />}
                <div style={{ marginLeft: "10px" }}>
                    <p style={{ marginTop: "0px", marginBottom: "0px" }}> Epochs: {epochs} </p>
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <p style={{ marginTop: "0px", marginBottom: "0px" }}> Loss: {loss.toFixed(3)} </p>
                        <StyledInfoButton title="Loss Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<LossInfoPanel {...nnConfig} />}>
                            <React.Fragment>
                                <Typography color="inherit">Loss</Typography>
                                <Typography variant="body2">This is loss calculated using the <a href="https://www.google.com/search?q=sum+squared+residuals" target="_blank">sum of squared residulals</a> between the output of our neural network and the expected output from out training set.</Typography><br />
                                <u>Click the icon to get more information</u>
                            </React.Fragment>
                        </StyledInfoButton>
                    </div>
                    <LossGraph
                        height={60}
                        width={170}
                        margin={5}
                        dataset={lossData}
                        comparisionData={comparisonData?.lossData} />
                </div>
            </GraphPanel>
            <NetworkPanel>
                {trainingData && network && <NeuralNetworkVis
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
                    setInfoPanel={setInfoPanelWrapper}
                />}
            </NetworkPanel>
            <StatsBar>

            </StatsBar>
            <InfoPanel>
                {infoPanelData.infoPanel}
                <div style={{ position: "absolute", right: "40px", top: "30px" }}>
                    <IconButton onClick={handleInfoPanelBackward}>
                        <ArrowBackIos />
                    </IconButton>
                    <IconButton onClick={handleInfoPanelHome}>
                        <Home fontSize={"large"} />
                    </IconButton>
                    <IconButton onClick={handleInfoPanelForward}>
                        <ArrowForwardIos />
                    </IconButton>
                </div>
            </InfoPanel>
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