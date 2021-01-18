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

export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    learningRate: number;
    inputs: string[];
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
    margin: 10px;
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
    padding-right: 100px;
    padding-left: 100px;
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
    //background-color: #131516;
    background-color: white;
    margin: auto auto;
    width: 100%;
    height: 100%;
    padding: 10px;
    //padding: 30px; 
    border-radius: 30px;
    border: 2px solid #bdbdbd;
    //border: 2px solid #353a3c;
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

const StatsBar = styled((props: any) => <ContainerSection gridArea="stats" {...props} />)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 0px;
    justify-content: space-around;
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
`;

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
            networkShape: [2,4, 4,1],
            activationFunction: "ReLU",
            learningRate: 0.03,
            inputs: ["x", "y"],
            batchSize: 10,
        }
    );
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [decisionBoundaries, setDecisionBoundaries] = useState<{ [nodeId: string]: number[] }>({});
    const [decisionBoundary, setDecisionBoundary] = useState<number[]>([]);
    const [loss, setLoss] = useState<number>(0);
    const [epochs, setEpochs] = useState<number>(0);
    const [discreetBoundary, setDiscreetBoundary] = useState<boolean>(false);

    const [infoPanel, setInfoPanel] = useState<JSX.Element>(<DefaultInfoPanel{...config} />);

    useEffect(() => {
        console.log("Config change useEffect");
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
        generateDataset();
    }, [datasetType, noise])




    const generateDataset = () => {
        console.log("Generating dataset");
        setDataset(vis.getDataset(datasetType, numSamples, noise));
    }

    const generateNetwork = () => {
        console.log("Generating network");
        setNetwork(vis.start(config));
        setEpochs(0);
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
        generateNetwork();
        generateDataset();
        updateDecisionBoundaries();
    };

    const step = (noSteps: number) => {
        console.log(`MainPage step(${noSteps})`);
        if (!network || !dataset) return;

        let start = Date.now();

        for (let i = 0; i < noSteps; i++) {
            vis.step(network, dataset, config.learningRate, config.inputs, config.batchSize);
        }

        setEpochs(epochs + noSteps);

        let delta = Date.now() - start;
        console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);

        console.log(network);

        start = Date.now();
        updateDecisionBoundaries();
        delta = Date.now() - start;
        console.log(`Finsihed updating decision boundaries (Duration ${delta}ms)`);
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

    const handleNoiseChange = (e: any, newValue: number | number[]) => {
        setNoise(newValue as number);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const input = e.target.name;

        // Change this implemntation input is highly coupled with visControl
        let newInputs: string[];

        if (checked) {
            config.inputs.push(input);
            newInputs = config.inputs;
        } else {
            newInputs = removeItemOnce(config.inputs, input);
        }

        let newNetworkShape = config.networkShape;
        newNetworkShape[0] = newInputs.length;
        setConfig({ ...config, inputs: newInputs, networkShape: newNetworkShape });
    };

    const handleInputNodeClick = (nodeId: string, active: boolean) => {
        console.log(`Input node click (NodeId: ${nodeId}, Active: ${active})`);
        console.log(config.inputs) 
        // Change this implemntation input is highly coupled with visControl
         let newInputs: string[];

         if (!active) {
             config.inputs.push(nodeId);
             newInputs = config.inputs;
         } else {
             newInputs = removeItemOnce(config.inputs, nodeId);
         }
 
         let newNetworkShape = config.networkShape;
         newNetworkShape[0] = newInputs.length;
         setConfig({ ...config, inputs: newInputs, networkShape: newNetworkShape });
    }

    const removeLayer = () => {
        console.log("Running removeLayer");
        if(config.networkShape.length > 2) {
            let newNetworkShape = config.networkShape;
            newNetworkShape.pop();
            newNetworkShape.pop();
            newNetworkShape.push(1);
            console.log(newNetworkShape);
            setConfig({ ...config, networkShape: newNetworkShape});
        }
    }

    const addLayer = () => {
        console.log("Running addLayer");
        if(config.networkShape.length < 6) {
            let newNetworkShape = config.networkShape;
            newNetworkShape.pop();
            newNetworkShape.push(newNetworkShape[newNetworkShape.length-1]);
            newNetworkShape.push(1);
            console.log(newNetworkShape);
            setConfig({ ...config, networkShape: newNetworkShape});
        }
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
                <InfoButton title="Activation Tooltip" setInfoPanel={setInfoPanel} infoPanel={<ActivationInfoPanel {...config} />}>
                    <React.Fragment>
                        <Typography color="inherit">Activation Function (&Phi;)</Typography>
                        This effects the rate at which the weights and biases change when training the neural network.<br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </InfoButton>
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
                <InfoButton title="Learning Rate Tooltip" setInfoPanel={setInfoPanel} infoPanel={<LearningInfoRatePanel {...config} />}>
                    <React.Fragment>
                        <Typography color="inherit">Learning Rate (&epsilon;)</Typography>
                        This affects the rate at which the weights and biases change when training the neural network.<br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </InfoButton>
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
                <InfoButton title="Dataset Tooltip" setInfoPanel={setInfoPanel} infoPanel={<DatasetInfoPanel {...config} />}>
                    <React.Fragment>
                        <Typography color="inherit">Datasets</Typography>
                        Defines the shape of the dataset we want our neural network to solve.<br />
                        <u>Click the icon to get more information</u>
                    </React.Fragment>
                </InfoButton>
                <Divider orientation="vertical" flexItem />
                <LabeledSlider
                    label="Noise"
                    defaultValue={noise}
                    onChange={handleNoiseChange}
                />
                <InfoButton title="Noise Tooltip">
                    <React.Fragment>
                        <Typography color="inherit">Noise</Typography>
                        This sets the noise in the generated data set. The more noise the greater the variance in the generated data.
                    </React.Fragment>
                </InfoButton>
            </ConfigBar>
            <ControlPanel>
                <StyledButton variant={"contained"} onClick={() => step(1)}> Step 1</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(10)}> Step 10</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(100)}> Step 100</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(10000)}> Step 10000</StyledButton>
                <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton>
                <StyledButton variant={"contained"} color={"primary"} onClick={generateDataset}> Regenerate Dataset </StyledButton>
                <StyledButton variant={"contained"} color={"secondary"} onClick={reset}> Reset </StyledButton>
                {/* <FormControl component="fieldset" style={{ marginTop: "10px" }}>
                    <FormLabel> Inputs </FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={config.inputs.includes("x")} onChange={handleInputChange} name="x" />}
                            label="y"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={config.inputs.includes("y")} onChange={handleInputChange} name="y" />}
                            label="x"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={config.inputs.includes("xSquared")} onChange={handleInputChange} name="xSquared" />}
                            label="ySquared"
                        />
                    </FormGroup>
                </FormControl> */}
            </ControlPanel>
            <NetworkPanel>
                <NeuralNetworkControls>
                    <IconButton onClick={removeLayer}>
                        <RemoveCircleIcon/>
                    </IconButton>
                    <IconButton onClick={addLayer}>
                        <AddCircleIcon/>
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
                />}
            </NetworkPanel>
            <ContainerSection gridArea="nn-graph">
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
                {(!dataset || !network) && <CircularProgress />}
            </ContainerSection>
            <StatsBar>
                <h2> Epochs: {epochs} </h2>
                <h2> Loss: {(new Intl.NumberFormat("en-UK", { maximumSignificantDigits: 3 }).format(loss))} </h2>
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