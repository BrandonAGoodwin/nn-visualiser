import React, { useEffect, useState } from 'react';
import * as vis from '../visControl';
import { Dataset2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button, InputLabel, MenuItem, Select, CircularProgress, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Divider, IconButton } from '@material-ui/core';
import * as nn from './../NeuralNet';
import './../MainPage.css';
import styled from '@emotion/styled';
import LabeledSlider from './Slider';
import InfoButton from './InfoButton';
import DefaultInfoPanel from './InfoPanels/DefaultInfoPanel';
import LearningInfoRatePanel from './InfoPanels/LearningRateInfoPanel';
import ActivationInfoPanel from './InfoPanels/ActivationInfoPanel';
import { GitHub } from '@material-ui/icons';
import DatasetInfoPanel from './InfoPanels/DatasetInfoPanel';
import NeuralNetworkVis from './NeuralNetworkVis';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import LossGraph from './LossGraph';
import LossInfoPanel from './InfoPanels/LossInfoPanel';

export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    learningRate: number;
    inputs: {[key: string]: boolean};
    batchSize: number;
}

interface PageProps {
    xDomain: number[];
    yDomain: number[];
    numCells: number;
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
    margin: auto auto;
    display: grid;
    width: inherit;
    max-width: 1400px;
    min-height: 600px;
    padding: 20px;

    grid-template-columns: 230px 1fr auto;
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
    width: auto;
    height: auto;
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
`;

const NeuralNetworkControls = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

const StyledInfoButton = styled(InfoButton)`
    font-size: 14px;
`

function removeItemOnce(arr: string[], value: string) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}


function MainPage(props: PageProps) {
    const [numSamples, setNumSamples] = useState<number>(100);
    const [noise, setNoise] = useState<number>(0.2);
    const [datasetType, setDatasetType] = useState<string>("Gaussian");
    const [dataset, setDataset] = useState<Dataset2D[]>([]);
    const [config, setConfig] = useState<NNConfig>(
        {
            networkShape: [2, 2, 2, 1],
            activationFunction: "ReLU",
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
            batchSize: 10,
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

    const [infoPanel, setInfoPanel] = useState<JSX.Element>(<DefaultInfoPanel{...config} />);

    useEffect(() => {
        console.log("Config change useEffect");
        if(training) toggleAutoTrain();
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
        // if(training) toggleAutoTrain();
        // setEpochs(0);
        // setLossData([]);
        // generateDataset();
        reset();

    }, [datasetType, noise])

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
        setNetwork(vis.start(config));
        setEpochs(0);
        setLossData([]);
    }

    const updateDecisionBoundaries = () => {
        console.log("Updating decision boundaries");
        if (network) {
            // Don't like numcells having to be the same
            setDecisionBoundaries(vis.getAllDecisionBoundaries(network, 20, props.xDomain, props.yDomain, config.inputs));
            dataset && setLoss(vis.getCost(network, dataset, config.inputs));
        }
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        //network && setDecisionBoundary(decisionBoundaries[nn.getOutputNode(network).id]);
        network && setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain, config.inputs));
    }

    const reset = () => {
        console.log("Reset");
        if (training) toggleAutoTrain();
        generateNetwork();
        generateDataset();
        updateDecisionBoundaries();
    };

    const step = (noSteps: number) => {
        console.log(`MainPage step(${noSteps})`);
        if (!network || !dataset) return;

        let start = Date.now();
        let newLossData: [number, number][] = [];
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, dataset, config.learningRate, config.inputs, config.batchSize);
            // newLossData.push([epochs + i + 1, vis.getCost(network, dataset, config.inputs)])
            setEpochs(epochs => epochs + 1);
        }


        // setLossData(() => lossData.concat(newLossData));
        let delta = Date.now() - start;
        console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);

        console.log(network);

        start = Date.now();
        updateDecisionBoundaries();
        delta = Date.now() - start;
        console.log(`Finsihed updating decision boundaries (Duration ${delta}ms)`);
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

    const handleInputNodeClick = (nodeId: string, active: boolean) => {
        // console.log(`Input node click (NodeId: ${nodeId}, Active: ${active})`);
        // console.log(config.inputs) 
        // Change this implemntation input is highly coupled with visControl
        // let newInputs: string[];
        let newInputs: {[inputId: string] : boolean} = {...config.inputs};
        let newNetworkShape = config.networkShape;

        if (active) {
            let noActiveNodes = 0;
            Object.keys(config.inputs).forEach((inputId) => { if(config.inputs[inputId]) noActiveNodes++; });
            if(noActiveNodes > 1) {
                // newInputs = removeItemOnce(config.inputs, nodeId);
                newInputs[nodeId] = false;
                newNetworkShape[0] = newNetworkShape[0] - 1;
            } else {
                return;
            }
        } else {
            // config.inputs.push(nodeId);
            newInputs[nodeId] = true;
            newNetworkShape[0] = newNetworkShape[0] + 1;
        }

        // if(training) toggleAutoTrain();

        
        // newNetworkShape[0] = newInputs.length;
        setConfig({ ...config, inputs: newInputs, networkShape: newNetworkShape });
    }

    // const handleHover = (nodeId: string, active: boolean) => {

    // }

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

    return (
        <Container>
            <ConfigBar>
                <StyledFormControl variant="filled">
                    <InputLabel>Activation</InputLabel>
                    <StyledSelect
                        value={config.activationFunction}
                        onChange={handleActivationChange}
                    >
                        <MenuItem value="ReLU">ReLU</MenuItem>
                        <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <StyledInfoButton title="Activation Tooltip" onClick={setInfoPanel} infoPanel={<ActivationInfoPanel {...config} />}>
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
                <StyledInfoButton title="Learning Rate Tooltip" onClick={setInfoPanel} infoPanel={<LearningInfoRatePanel {...config} />}>
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
                        <MenuItem value="Gaussian">Gaussian</MenuItem>
                        <MenuItem value="XOR">XOR</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <StyledInfoButton title="Dataset Tooltip" onClick={setInfoPanel} infoPanel={<DatasetInfoPanel {...config} />}>
                    <React.Fragment>
                        <Typography color="inherit">Datasets</Typography>
                        <Typography variant="body2">Defines the shape of the dataset we want our neural network to solve.</Typography><br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </StyledInfoButton>
                <Divider orientation="vertical" flexItem />
                <LabeledSlider
                    label="Noise"
                    defaultValue={noise}
                    onChange={handleNoiseChange}
                />
                <StyledInfoButton title="Noise Tooltip">
                    <React.Fragment>
                        <Typography color="inherit">Noise</Typography>
                        <Typography variant="body2">This sets the noise in the generated data set. The more noise the greater the variance in the generated data.</Typography>
                    </React.Fragment>
                </StyledInfoButton>
            </ConfigBar>
            <ControlPanel>
                <StyledButton variant={"contained"} onClick={() => step(1)}> Step 1</StyledButton>
                {/* <StyledButton variant={"contained"} onClick={() => step(10)}> Step 10</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(100)}> Step 100</StyledButton> */}
                <StyledButton variant={"contained"} onClick={() => toggleAutoTrain()}> Auto Train: <b>{training ? "On" : "Off"}</b></StyledButton>
                <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton>
                <StyledButton variant={"contained"} color={"primary"} onClick={handleRegenerateDataset}> Regenerate Dataset </StyledButton>
                <StyledButton variant={"contained"} color={"secondary"} onClick={reset}> Reset </StyledButton>
            </ControlPanel>
            <NetworkPanel>
                <NeuralNetworkControls>
                    <IconButton onClick={removeLayer}>
                        <RemoveCircleIcon />
                    </IconButton>
                    <Typography> Hidden Layers: {config.networkShape.length - 2}</Typography>
                    <IconButton onClick={addLayer}>
                        <AddCircleIcon />
                    </IconButton>
                </NeuralNetworkControls>
                {dataset && network && <NeuralNetworkVis
                    network={network}
                    decisionBoundaries={decisionBoundaries}
                    discreetBoundary={discreetBoundary}
                    inputs={config.inputs}
                    networkWidth={650}
                    networkHeight={550}
                    handleOnClick={handleInputNodeClick}
                    addNode={addNode}
                    removeNode={removeNode}
                // handleOnHover={handleHover}
                />}
            </NetworkPanel>
            <GraphPanel>
                {dataset && network && <NNGraph
                    dataset={dataset}
                    density={25}
                    canvasWidth={275}
                    margin={20}
                    numCells={props.numCells}
                    xDomain={props.xDomain}
                    yDomain={props.yDomain}
                    decisionBoundary={decisionBoundary}
                    discreetBoundary={discreetBoundary}
                />}
                {/* {(!dataset || !network) && <CircularProgress />} */}
                <h3> Epochs: {epochs} </h3>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <h3> Loss: {loss.toFixed(3)} </h3>
                    <StyledInfoButton title="Loss Tooltip" onClick={setInfoPanel} infoPanel={<LossInfoPanel {...config} />}>
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
                    dataset={lossData} />
            </GraphPanel>
            <StatsBar>
                {/* <h2> Epochs: {epochs} </h2>
                <h2 style={{minWidth: 200}}> Loss: {(new Intl.NumberFormat("en-UK", { maximumSignificantDigits: 3 }).format(loss))} </h2>
                <LossGraph
                    height={30}
                    width={100}
                    margin={5}
                    dataset={lossData}/> */}
            </StatsBar>
            <InfoPanel>
                {infoPanel}
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