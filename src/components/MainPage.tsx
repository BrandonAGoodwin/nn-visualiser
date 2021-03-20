import React, { useContext, useEffect, useState } from 'react';
import * as vis from '../visControl';
import { Dataset2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button, InputLabel, MenuItem, Select, FormControl, Typography, Divider, IconButton } from '@material-ui/core';
import * as nn from './../NeuralNet';
import styled from '@emotion/styled';
import LabeledSlider from './Slider';
import InfoButton from './InfoButton';
import DefaultInfoPanel from './InfoPanels/DefaultInfoPanel';
import LearningInfoRatePanel from './InfoPanels/LearningRateInfoPanel';
import ActivationInfoPanel from './InfoPanels/ActivationInfoPanel';
import { ArrowBackIos, ArrowForwardIos, GitHub } from '@material-ui/icons';
import DatasetInfoPanel from './InfoPanels/DatasetInfoPanel';
import NeuralNetworkVis from './NeuralNetworkVis';
import LossGraph from './LossGraph';
import LossInfoPanel from './InfoPanels/LossInfoPanel';
import { DefinedTerm, DefX1, DefX2 } from './Definitions';
import { ThemeContext } from '../contexts/ThemeContext';
import ColourScale from './ColourScale';

export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    learningRate: number;
    inputs: { [key: string]: boolean };
    batchSize: number;
}

interface PageProps {
    xDomain: number[];
    yDomain: number[];
    numCells: number;
    updateComparisionData: (currentState: NetworkState, savedState: NetworkState) => void;
}

const StyledButton = styled(Button)`
    margin: 5px;
`;

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


const ContainerSection = styled("div")`
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

// Fix so that this doesn't use hard coded paddings
const ConfigBar = styled((props: any) => <ContainerSection gridArea="config-bar" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding-left: 30px;
    padding-top: 10px;
`;

const ControlPanel = styled((props: any) => <ContainerSection gridArea="control-panel" {...props} />)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: left;
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

const NeuralNetworkControls = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

export const StyledInfoButton = styled(InfoButton)`
    font-size: 14px;
`

function removeItemOnce(arr: string[], value: string) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

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
    dataset: Dataset2D[];
    config: NNConfig;
    decisionBoundaries: { [nodeId: string]: number[] };
    decisionBoundary: number[];
    loss: number;
    epochs: number;
    lossData: [number, number][];
}


function MainPage(props: PageProps) {
    const {minColour, minColourName, maxColour, maxColourName, midColour} = useContext(ThemeContext);

    const [numSamples, setNumSamples] = useState<number>(500);
    const [noise, setNoise] = useState<number>(0.2);
    const [datasetType, setDatasetType] = useState<string>("Gaussian2");
    const [dataset, setDataset] = useState<Dataset2D[]>([]);
    const [config, setConfig] = useState<NNConfig>(
        {
            networkShape: [2, 2, 2, 1],
            activationFunction: "Tanh",
            learningRate: 0.03,
            inputs: {
                "x": true,
                "y": true,
                "xSquared": false,
                "ySquared": false,
                "xTimesY": false,
                "sinX": false,
                "sinY": false
            },
            batchSize: 10, // CHange this back to 10
        }
    );
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [decisionBoundaries, setDecisionBoundaries] = useState<{ [nodeId: string]: number[] }>({});
    const [decisionBoundary, setDecisionBoundary] = useState<number[]>([]);
    const [loss, setLoss] = useState<number>(0);
    const [epochs, setEpochs] = useState<number>(0);
    const [discreetBoundary, setDiscreetBoundary] = useState<boolean>(false);
    const [lossData, setLossData] = useState<[number, number][]>([]);
    const [training, setTraining] = useState<boolean>(false);
    const [trainingInterval, setTrainingInterval] = useState<number>();
    const [networkSeed, setNetworkSeed] = useState<string>();
    const [compareMode, setCompareMode] = useState<boolean>(false);
    const [infoPanel, setInfoPanel] = useState<JSX.Element>(<DefaultInfoPanel{...config} />);
    const [networkOriginalState, setNetworkOriginalState] = useState<nn.Node[][]>();
    const [networkSaveState, setNetworkSaveState] = useState<nn.Node[][]>();
    const [infoPanelHistory, setInfoPanelHistory] = useState<JSX.Element[]>([]);
    const [infoPanelFuture, setInfoPanelFuture] = useState<JSX.Element[]>([]);

    const [comparisonData, setComaparisonData] = useState<NetworkState>();

    useEffect(() => {
        console.log("Config change useEffect");
        if (training) toggleAutoTrain();
        generateNetwork();
        generateDataset();
    }, [config])

    useEffect(() => {
        updateDecisionBoundary();
    }, [decisionBoundaries])

    useEffect(() => {
        console.log("Config change useEffect");
        updateDecisionBoundaries();
    }, [network])


    useEffect(() => {
        console.log("Dataset/Noise change useEffect");
        reset();
    }, [datasetType, noise, numSamples])

    useEffect(() => {
        if (epochs === 0 || !network) return;
        setLossData(lossData => lossData.concat([[epochs, vis.getCost(network, dataset, config.inputs)]]));
    }, [epochs])


    const generateDataset = () => {
        console.log("Generating dataset");
        setDataset(vis.getDataset(datasetType, numSamples, noise));
    }

    const generateNetwork = () => {
        console.log("Generating network");

        if (!compareMode) {
            let newNetwork = vis.start(config);
            setNetwork(newNetwork);
            let newNetworkCopy = vis.copyNetwork(newNetwork);
            console.log(newNetworkCopy);
            setNetworkOriginalState(newNetworkCopy);
        } else {
            console.log("Loading network original state");
            if (networkOriginalState) {
                console.log(networkOriginalState);
                setNetwork(vis.copyNetwork(networkOriginalState));
            }
        }
        setEpochs(0);
        setLossData([]);
    }

    const updateDecisionBoundaries = () => {
        // console.log("Updating decision boundaries");
        if (network) {
            // Don't like numcells having to be the same
            setDecisionBoundaries(vis.getAllDecisionBoundaries(network, 20, props.xDomain, props.yDomain, config.inputs));
            dataset && setLoss(vis.getCost(network, dataset, config.inputs));
        }
    }

    const updateDecisionBoundary = () => {
        // console.log("Updating decision boundary");
        network && setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain, config.inputs));
    }

    const reset = () => {
        console.log("Reset");
        if (training) toggleAutoTrain();
        generateNetwork();
        if (!compareMode) generateDataset();
    };

    const step = (noSteps: number) => {
        console.log(`MainPage step(${noSteps})`);
        if (!network || !dataset) return;

        let start = Date.now();
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, dataset, config.learningRate, config.inputs, config.batchSize);
            setEpochs(epochs => epochs + 1);
        }


        let delta = Date.now() - start;
        // console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);

        start = Date.now();
        updateDecisionBoundaries();
        delta = Date.now() - start;
        // console.log(`Finsihed updating decision boundaries (Duration ${delta}ms)`);
        // console.log(lossData);
    };

    const toggleDiscreetOutput = () => {
        setDiscreetBoundary(!discreetBoundary);
    };

    const handleActivationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setConfig({ ...config, activationFunction: e.target.value as string });
    };

    const handleLearningRateChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setConfig({ ...config, learningRate: e.target.value as number });
    };

    const handleDatasetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setDatasetType(e.target.value as string);
    };

    const handleRegenerateDataset = () => {
        generateDataset();
        if (training) toggleAutoTrain();
    };

    const handleNoiseChange = (e: any, newValue: number | number[]) => {
        setNoise(newValue as number);
    };

    const handleNumSamplesChange = (e: any, newValue: number | number[]) => {
        setNumSamples(newValue as number);
    }

    const handleInputNodeClick = (nodeId: string, active: boolean) => {
        // console.log(`Input node click (NodeId: ${nodeId}, Active: ${active})`);
        // Change this implemntation input is highly coupled with visControl
        let newInputs: { [inputId: string]: boolean } = { ...config.inputs };
        let newNetworkShape = config.networkShape;

        if (active) {
            let noActiveNodes = 0;
            Object.keys(config.inputs).forEach((inputId) => { if (config.inputs[inputId]) noActiveNodes++; });
            if (noActiveNodes > 1) {
                newInputs[nodeId] = false;
                newNetworkShape[0] = newNetworkShape[0] - 1;
            } else {
                return;
            }
        } else {
            newInputs[nodeId] = true;
            newNetworkShape[0] = newNetworkShape[0] + 1;
        }
        setConfig({ ...config, inputs: newInputs, networkShape: newNetworkShape });
    }

    const removeLayer = () => {
        console.log("Running removeLayer");
        if (config.networkShape.length > 2) {
            let newNetworkShape = config.networkShape;
            newNetworkShape.pop();
            newNetworkShape.pop();
            newNetworkShape.push(1);
            console.log(newNetworkShape);
            setConfig({ ...config, networkShape: newNetworkShape });
        }
    }

    const addLayer = () => {
        console.log("Running addLayer");
        if (config.networkShape.length < 6) {
            let newNetworkShape = config.networkShape;
            newNetworkShape.pop();
            newNetworkShape.push(newNetworkShape[newNetworkShape.length - 1]);
            newNetworkShape.push(1);
            console.log(newNetworkShape);
            setConfig({ ...config, networkShape: newNetworkShape });
        }
    }

    const removeNode = (layerNum: number) => {
        console.log("Running removeNode");
        if (config.networkShape[layerNum] > 1) {
            let newNetworkShape = config.networkShape;
            newNetworkShape[layerNum] = config.networkShape[layerNum] - 1;
            setConfig({ ...config, networkShape: newNetworkShape });
        }
    }

    const addNode = (layerNum: number) => {
        console.log("Running addNode");
        if (config.networkShape[layerNum] < 5) {
            let newNetworkShape = config.networkShape;
            newNetworkShape[layerNum] = config.networkShape[layerNum] + 1;
            setConfig({ ...config, networkShape: newNetworkShape });
        }
    }

    const saveComparisionData = () => {
        let newComparisionData: NetworkState = {
            config: config,
            dataset: dataset,
            datasetType: datasetType,
            decisionBoundaries: decisionBoundaries,
            decisionBoundary: decisionBoundary,
            epochs: epochs,
            loss: loss,
            lossData: lossData,
            noise: noise
        }

        setComaparisonData(newComparisionData);
    }

    const toggleAutoTrain = () => {
        if (training) {
            clearInterval(trainingInterval);
        } else {
            setTrainingInterval(setInterval(() => {
                step(1);
            }, 500));
        }
        setTraining(!training);
    }

    const saveNetworkState = () => {
        setCompareMode(true);
    }

    const loadOriginalState = () => {

    }

    const saveCurrentState = () => {
        saveComparisionData();
        setCompareMode(true);
    }

    const loadSavedState = () => {
        reset();
    }

    const clearNetworkState = () => {
        setComaparisonData(undefined);
        setCompareMode(false);
    }

    const setInfoPanelWrapper = (newInfoPanel: JSX.Element) => {
        console.log(newInfoPanel);
        let newInfoPanelHistory = infoPanelHistory;
        newInfoPanelHistory.push(infoPanel);
        console.log(newInfoPanelHistory);
        console.log(infoPanel)
        setInfoPanel(newInfoPanel);
        setInfoPanelHistory(newInfoPanelHistory);
        setInfoPanelFuture([]);
    }

    const handleInfoPanelForward = () => {
        if (infoPanelFuture.length !== 0) {
            let newInfoPanelHistory = infoPanelHistory;
            let newInfoPanelFuture = infoPanelFuture;
            let newPanel = newInfoPanelFuture.shift();

            newInfoPanelHistory.push(infoPanel);

            setInfoPanelHistory(newInfoPanelHistory);
            setInfoPanelFuture(newInfoPanelFuture);
            if (newPanel) setInfoPanel(newPanel);
        }
    }

    const handleInfoPanelBackward = () => {
        if (infoPanelHistory.length !== 0) {
            let newInfoPanelHistory = infoPanelHistory;
            let newInfoPanelFuture = infoPanelFuture;
            let newPanel = newInfoPanelHistory.pop();

            newInfoPanelFuture.unshift(infoPanel);

            setInfoPanelHistory(newInfoPanelHistory);
            setInfoPanelFuture(newInfoPanelFuture);
            if (newPanel) setInfoPanel(newPanel);
        }
    }

    return (
        <Container id="main-page">
            <ConfigBar>
                <StyledFormControl variant="filled">
                    <InputLabel>Activation</InputLabel>
                    <StyledSelect
                        value={config.activationFunction}
                        onChange={handleActivationChange}
                    >
                        <MenuItem value="Tanh">Tanh</MenuItem>
                        <MenuItem value="ReLU">ReLU</MenuItem>
                        <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <StyledInfoButton title="Activation Tooltip" onClick={setInfoPanelWrapper} infoPanel={<ActivationInfoPanel config={config} setInfoPanel={setInfoPanelWrapper}/>}>
                    <React.Fragment>
                        <Typography color="inherit">Activation Function (&Phi;)</Typography>
                        <Typography variant="body2">The activation defines the output of a neuron (node).</Typography><br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </StyledInfoButton>
                <Divider orientation="vertical" flexItem />
                <StyledFormControl variant="filled">
                    <InputLabel>Learning Rate</InputLabel>
                    <StyledSelect
                        value={config.learningRate}
                        onChange={handleLearningRateChange}
                    >
                        <MenuItem value="0.03">0.03</MenuItem>
                        <MenuItem value="0.005">0.005</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <StyledInfoButton title="Learning Rate Tooltip" onClick={setInfoPanelWrapper} infoPanel={<LearningInfoRatePanel {...config} />}>
                    <React.Fragment>
                        <Typography color="inherit">Learning Rate (&epsilon;)</Typography>
                        <Typography variant="body2">This affects the rate at which the weights and biases change when training the neural network.</Typography><br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </StyledInfoButton>
                <Divider orientation="vertical" flexItem />
                <StyledFormControl variant="filled">
                    <InputLabel>Dataset</InputLabel>
                    <StyledSelect
                        value={datasetType}
                        onChange={handleDatasetChange}
                    >
                        <MenuItem value="Gaussian2">2 Gaussian</MenuItem>
                        <MenuItem value="Gaussian3">3 Gaussian</MenuItem>
                        <MenuItem value="XOR">XOR</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <StyledInfoButton title="Dataset Tooltip" onClick={setInfoPanelWrapper} infoPanel={<DatasetInfoPanel {...config} />}>
                    <React.Fragment>
                        <Typography color="inherit">Datasets</Typography>
                        <Typography variant="body2">Defines the shape of the dataset we want our neural network to solve.</Typography><br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </StyledInfoButton>
                <Divider orientation="vertical" flexItem />
                <LabeledSlider
                    label="Noise"
                    min = {0}
                    step = {0.1}
                    max = {1}
                    defaultValue={noise}
                    onChange={handleNoiseChange}
                />
                <StyledInfoButton title="Noise Tooltip">
                    <React.Fragment>
                        <Typography color="inherit">Noise</Typography>
                        <Typography variant="body2">This sets the noise in the generated data set. The more noise the greater the variance in the generated data.</Typography>
                    </React.Fragment>
                </StyledInfoButton>
                <Divider orientation="vertical" flexItem />
                <LabeledSlider
                    label="Dataset Size"
                    min={10}
                    step={10}
                    max={500}
                    defaultValue={numSamples}
                    onChange={handleNumSamplesChange}

                />
                <StyledInfoButton title="Sample Size Tooltip">
                    <React.Fragment>
                        {/* <Typography color="inherit">Noise</Typography> */}
                        <Typography variant="body2">Changes the number of samples in the dataset. <br/>(Training is done using 80% of the samples and the remaining 20% are used as the test dataset. </Typography>
                    </React.Fragment>
                </StyledInfoButton>
            </ConfigBar>
            <ControlPanel>
                <StyledButton variant={"contained"} onClick={() => step(1)}> Step 1</StyledButton>
                <StyledButton variant={"contained"} onClick={() => toggleAutoTrain()}> Auto Train: <b>{training ? "On" : "Off"}</b></StyledButton>
                <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton>
                <StyledButton variant={"contained"} color={"primary"} onClick={handleRegenerateDataset}> Regenerate Dataset </StyledButton>
                <StyledButton variant={"contained"} color={"secondary"} onClick={reset}> Reset </StyledButton>
                <StyledButton variant={"contained"} onClick={saveCurrentState}> Save Current Network State </StyledButton>
                <StyledButton variant={"contained"} onClick={loadSavedState} disabled={!compareMode}> Load Network State </StyledButton>
                <StyledButton variant={"contained"} onClick={clearNetworkState}> Clear Network State </StyledButton>
            </ControlPanel>

            <GraphPanel>
                <div style={{ display: "flex", marginLeft: "25px" }}>
                    <Typography variant="h6">Output</Typography>
                    <StyledInfoButton title="Output Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<LossInfoPanel {...config} />}>
                        <React.Fragment>
                            <Typography color="inherit">Output</Typography>
                            <Typography variant="body2">This graph shows the final output of the neural network in the domain (-8, +8) for both the <DefinedTerm definition={DefX1()}>X<sub>1</sub></DefinedTerm> and <DefinedTerm definition={DefX2()}>X<sub>2</sub></DefinedTerm> features.<br /> The samples in the data sets used only have 2 classes (-1 and +1); the neural network defines a decision boundary so that points that are in<br /> {minColourName} <ColouredBox colour={minColour} /> sections of the graph are classified as class -1 and points that are in <br /> {maxColourName} <ColouredBox colour={maxColour} /> sections of the graph are classified as class +1.</Typography><br />
                        </React.Fragment>
                    </StyledInfoButton>
                </div>
                {dataset && network && <NNGraph
                    dataset={dataset}
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
                <ColourScale
                    width={20}
                    height={100}
                    maxColour={maxColour}
                    minColour={minColour}
                    midColour={midColour}
                    maxValue={1}
                    minValue={-1}
                    midValue={0}
                    numShades={100}
                />
                <div style={{ marginLeft: "10px" }}>
                    <h3 style={{ marginTop: "0px" }}> Epochs: {epochs} </h3>
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <h3 style={{ marginTop: "0px", marginBottom: "0px" }}> Loss: {loss.toFixed(3)} </h3>
                        <StyledInfoButton title="Loss Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<LossInfoPanel {...config} />}>
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
                {dataset && network && <NeuralNetworkVis
                    network={network}
                    decisionBoundaries={decisionBoundaries}
                    discreetBoundary={discreetBoundary}
                    inputs={config.inputs}
                    config={config}
                    networkWidth={650}
                    networkHeight={550}
                    handleOnClick={handleInputNodeClick}
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
                {infoPanel}
                <div style={{ position: "absolute", right: "40px", top: "30px" }}>
                    <IconButton onClick={handleInfoPanelBackward}>
                        <ArrowBackIos />
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