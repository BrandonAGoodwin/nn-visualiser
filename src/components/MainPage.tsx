
import React, { useEffect, useState } from 'react';
import * as vis from '../visControl'
import { Dataset2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button, InputLabel, MenuItem, Select, CircularProgress, FormControl } from '@material-ui/core';
import * as nn from './../NeuralNet';
import './../MainPage.css'
import styled from '@emotion/styled';

export interface NNConfig {
    networkShape: number[];
    activationFunction: string;
    noise: number;
}

type PageProps = {
    xDomain: number[];
    yDomain: number[];
    numCells: number;
}

// Implement grid area layout on CSS

type SizedButtonProps = {
    color: string;
}

const SizedButton = styled("button")`
    color: ${(props: SizedButtonProps) => props.color};
`

const StyledButton = styled(Button)`
    margin: 10px;
`

const Container = styled("div")`
    margin: auto auto;
    display: grid;
    width: 800px;
    height: 600px;
    padding: 20px;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 60px 1fr 80px;
    grid-gap: 35px;//3rem;
    grid-template-areas: 
        "config-bar config-bar"
        "control-panel nn-graph"
        "stats stats";
`

const ContainerSection = styled("div")`
    grid-area: ${(props:{ gridArea: string }) => (props.gridArea)};
    background-color: white;
    margin: auto auto;
    width: 100%;
    height: 100%;
    padding: 8px; 
    /* padding-right: 15px; 
    padding-top: 15px; */
    border-radius: 30px;
    border: 2px solid #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const ConfigBar = styled((props: any) => <ContainerSection gridArea="config-bar" {...props} />)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    align-items: center;
`

const ControlPanel = styled((props: any) => <ContainerSection gridArea="control-panel" {...props} />)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

function MainPage(props: PageProps) {
    const [numSamples, setNumSamples] = useState<number>(20);
    const [dataset, setDataset] = useState<Dataset2D[]>([]);
    const [config, setConfig] = useState<NNConfig>(
        {
            networkShape: [2, 4, 4, 1],
            activationFunction: "ReLU",
            noise: 0
        }
    );
    const [network, setNetwork] = useState<nn.Node[][]>();
    const [decisionBoundary, setDecisionBoundary] = useState<number[]>([]);
    const [loss, setLoss] = useState<number>(0);

    // useEffect(() => {
    //     console.log("useEffect init MainPage");
    //     reset();
    // },[]);

    useEffect(() => {
        console.log("Config change useEffect");
        generateNetwork();
        generateDataset();
        updateDecisionBoundary();
    },[config]);

    useEffect(() => {
        console.log("Config change useEffect");
        updateDecisionBoundary();
    },[network]);

    const generateDataset = () => {
        console.log("Generating dataset");
        setDataset(vis.get2GaussDist(numSamples));
    }

    const generateNetwork = () => {
        console.log("Generating network");
        setNetwork(vis.start(config));
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        // Don't like numcells having to be the same
        if(network) {
            setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain));
            dataset && setLoss(vis.getCost(network, dataset))
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
            vis.step(network, dataset);
        }

        let delta = Date.now() - start;
        console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);
        
        console.log(loss)
        updateDecisionBoundary();
    }

    const handleActivationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setConfig({...config, activationFunction: e.target.value as string})
    }

    return (
        <Container>
            <ConfigBar>
                <FormControl variant="filled">
                    <InputLabel id="label">Activation</InputLabel>
                    <Select
                        value={config.activationFunction}
                        onChange={handleActivationChange}
                    >
                        <MenuItem value="ReLU">ReLU</MenuItem>
                        <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                    </Select>
                </FormControl>
            </ConfigBar>
            <ControlPanel>
                <StyledButton variant={"contained"} onClick={() => step(1)}> Step 1</StyledButton>
                <StyledButton variant={"contained"} onClick={() => step(100)}> Step 100</StyledButton>
                <StyledButton variant={"contained"} color={"primary"} onClick={generateDataset}> Regenerate Dataset </StyledButton>
                <StyledButton variant={"contained"} color={"secondary"} onClick={reset}> Reset </StyledButton>
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
            <ContainerSection gridArea="stats">
                <h2> Loss: {loss} </h2>
            </ContainerSection>
            
        </Container>
    );
}

// Minimum information to NNGraph to render the correct immage
// Don't necessarally want to re-render whole of NNGraph unless that is what you're supposed to do
// In something like Java I'd expect to do NNGraph.updateBackground(decisionBoundary)

export default MainPage;