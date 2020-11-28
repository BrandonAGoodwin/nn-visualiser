
import React, { useEffect, useState } from 'react';
import * as vis from '../visControl'
import { Dataset2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button, InputLabel, MenuItem, Select, CircularProgress, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import * as nn from './../NeuralNet';
import './../MainPage.css'
import styled from '@emotion/styled';
import LabeledSlider from './Slider'

export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    noise: number;
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
`

const StyledFormControl = styled(FormControl)`
    margin: 5px;
    min-width: 130px;
`

const Container = styled("div")`
    margin: auto auto;
    display: grid;
    width: 800px;
    height: 600px;
    padding: 20px;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 90px 1fr 80px;
    grid-gap: 15px;
    grid-template-areas: 
        "config-bar config-bar"
        "control-panel nn-graph"
        "stats stats";
`

const ContainerSection = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    grid-area: ${(props:{ gridArea: string }) => (props.gridArea)};
    background-color: white;
    margin: auto auto;
    width: 100%;
    height: 100%;
    padding: 10px;
    //padding: 30px; 
    border-radius: 30px;
    border: 2px solid #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

// Fix so that this doesn't use hard coded paddings
const ConfigBar = styled((props: any) => <ContainerSection gridArea="config-bar" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding-left: 30px;
    padding-top: 10px;
`

const ControlPanel = styled((props: any) => <ContainerSection gridArea="control-panel" {...props} />)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: left;
`

const StatsBar = styled((props: any) => <ContainerSection gridArea="stats" {...props} />)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 0px;
    justify-content: space-around;
`

function removeItemOnce(arr: string[], value: string) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

function InputsGroup() {
    const inputs = Object.keys(vis.INPUTS);
    console.log(inputs)
    const [checkedItems, setCheckedItems] = useState(new Map<string,boolean>())

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const input = e.target.name;
        setCheckedItems(checkedItems.set(input, checked));
    }

    return (
        <FormControl component="fieldset">
            <FormLabel> Inputs </FormLabel>
            <FormGroup>
                {inputs.map(input => {
                    <FormControlLabel
                        control={<Checkbox checked={checkedItems.get(input) || false} onChange={handleOnChange} name={input}/>}
                        label={vis.INPUTS[input].label}
                    />
                })}
            </FormGroup>
        </FormControl>
    );
}

function MainPage(props: PageProps) {
    const [numSamples, setNumSamples] = useState<number>(100);
    const [noise, setNoise] = useState<number>(0);
    const [datasetType, setDatasetType] = useState<string>("Gaussian");
    const [dataset, setDataset] = useState<Dataset2D[]>([]);
    const [config, setConfig] = useState<NNConfig>(
        {
            networkShape: [2, 1],
            activationFunction: "ReLU",
            noise: 0,
            learningRate: 0.03,
            inputs: ["x", "y"],
            batchSize: 10,
        }
    );
    const [network, setNetwork]                     = useState<nn.Node[][]>();
    const [decisionBoundary, setDecisionBoundary]   = useState<number[]>([]);
    const [loss, setLoss]                           = useState<number>(0);
    const [epochs, setEpochs]                       = useState<number>(0);
    const [discreetBoundary, setDiscreetBoundary]   = useState<boolean>(true);

    useEffect(() => {
        console.log("Config change useEffect");
        generateNetwork();
        generateDataset();
        //updateDecisionBoundary();
    }, [config]);

    useEffect(() => {
        console.log("Config change useEffect");
        updateDecisionBoundary();
    }, [network]);

    useEffect(() => {
        generateDataset();
    }, [datasetType, noise]);


    const generateDataset = () => {
        console.log("Generating dataset");
        setDataset(vis.getDataset(datasetType, numSamples, noise));
    }

    const generateNetwork = () => {
        console.log("Generating network");
        setNetwork(vis.start(config));
        setEpochs(0);
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        // Don't like numcells having to be the same
        if(network) {
            setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain, config.inputs));
            dataset && setLoss(vis.getCost(network, dataset, config.inputs));
        }
    }

    const reset = () => {
        console.log("Reset");
        generateNetwork();
        generateDataset();
        updateDecisionBoundary();
    }

    const step = (noSteps: number) => {
        console.log(`MainPage step(${noSteps})`);
        if(!network ||!dataset) return;

        let start = Date.now();
        
        for (let i = 0; i < noSteps; i++) {
            vis.step(network, dataset, config.learningRate, config.inputs, config.batchSize);
        }

        setEpochs(epochs + noSteps);

        let delta = Date.now() - start;
        console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);
        
        console.log(loss)
        console.log(network)
        updateDecisionBoundary();
    }

    const toggleDiscreetOutput = () => {
        setDiscreetBoundary(!discreetBoundary)
    }

    const handleActivationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setConfig({...config, activationFunction: e.target.value as string});
    }

    const handleLearningRateChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setConfig({...config, learningRate: e.target.value as number});
    }

    const handleDatasetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setDatasetType(e.target.value as string);
    }

    const handleNoiseChange = (e: any, newValue: number | number[]) => {
        setNoise(newValue as number);
    }

    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const input = e.target.name;

        // THIS HAS GOT TO GOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
        // let newNetworkShape = config.networkShape;
        let newInputs: string[];

        if(checked) {
            config.inputs.push(input)
            newInputs = config.inputs;
        } else {
            newInputs = removeItemOnce(config.inputs, input)
        }
        let newNetworkShape = config.networkShape;
        newNetworkShape[0] = newInputs.length;
        console.log(newNetworkShape);
        console.log(newInputs)
        setConfig({...config, inputs: newInputs, networkShape: newNetworkShape})
        
    }


    return (
        <Container>
            <ConfigBar>
                <StyledFormControl variant="filled">
                    <InputLabel>Activation</InputLabel>
                    <Select
                        value={config.activationFunction}
                        onChange={handleActivationChange}
                    >
                        <MenuItem value="ReLU">ReLU</MenuItem>
                        <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                    </Select>
                </StyledFormControl>
                <StyledFormControl variant="filled">
                    <InputLabel>Learning Rate</InputLabel>
                    <Select
                        value={config.learningRate}
                        onChange={handleLearningRateChange}
                    >
                        <MenuItem value="0.03">0.03</MenuItem>
                        <MenuItem value="0.005">0.005</MenuItem>
                    </Select>
                </StyledFormControl>
                <StyledFormControl variant="filled">
                    <InputLabel>Dataset</InputLabel>
                    <Select
                        value={datasetType}
                        onChange={handleDatasetChange}
                    >
                        <MenuItem value="Gaussian">Gaussian</MenuItem>
                        <MenuItem value="XOR">XOR</MenuItem>
                    </Select>
                </StyledFormControl>
                <LabeledSlider
                    label="Noise"
                    defaultValue={noise}
                    f={handleNoiseChange}
                />
            </ConfigBar>
            <ControlPanel>
                <StyledButton variant={"contained"} onClick={() => step(1)}> Step 1</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(10)}> Step 10</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(100)}> Step 100</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(10000)}> Step 10000</StyledButton>
                <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton>
                <StyledButton variant={"contained"} color={"primary"} onClick={generateDataset}> Regenerate Dataset </StyledButton>
                <StyledButton variant={"contained"} color={"secondary"} onClick={reset}> Reset </StyledButton>
                {/* <InputsGroup/> */}
                <FormControl component="fieldset">
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
                </FormControl>
            </ControlPanel>
            <ContainerSection gridArea="nn-graph">
                {dataset && network && <NNGraph 
                    dataset = {dataset}
                    density = {100}
                    canvasWidth = {500}
                    margin = {20}
                    numCells = {props.numCells}
                    xDomain = {props.xDomain}
                    yDomain = {props.yDomain}
                    decisionBoundary = {decisionBoundary}
                    discreetBoundary = {discreetBoundary}
                />}
                {(!dataset || !network) && <CircularProgress/>}
                 {/* {dataset && <NNGraph 

                    dataset = {dataset}
                    density = {100}
                    canvasWidth = {80}
                    margin = {20}
                    numCells = {props.numCells}
                    xDomain = {props.xDomain}
                    yDomain = {props.yDomain}
                    decisionBoundary = {decisionBoundary}
                />} */}
            </ContainerSection>
            <StatsBar>
                <h2> Epochs: {epochs} </h2>
                <h2> Loss: {(new Intl.NumberFormat("en-UK", { maximumSignificantDigits: 3 }).format(loss))} </h2>
            </StatsBar>
            
        </Container>
    );
}

// Minimum information to NNGraph to render the correct immage
// Don't necessarally want to re-render whole of NNGraph unless that is what you're supposed to do
// In something like Java I'd expect to do NNGraph.updateBackground(decisionBoundary)

export default MainPage;