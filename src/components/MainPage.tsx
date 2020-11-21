
import React, { useEffect, useState } from 'react';
import * as vis from '../visControl'
import { Dataset2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button, InputLabel, MenuItem, Select } from '@material-ui/core';
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
    noSamples: number;
    numCells: number;
    
}

// Implement grid area layout on CSS

type SizedButtonProps = {
    color: string;
}

const SizedButton = styled("button")`
    color: ${(props: SizedButtonProps) => props.color};
`

function MainPage(props: PageProps) {
    const [dataset, setDataset] = useState<Dataset2D[]>([]);
    const [config, setConfig] = useState<NNConfig>(
        {
            networkShape: [2, 4, 4, 1],
            activationFunction: "ReLU",
            noise: 0
        }
    );
    const [network, setNetwork] = useState<nn.Node[][]>(vis.start(config));
    const [decisionBoundary, setDecisionBoundary] = useState<Dataset2D[]>(vis.getOutputDecisionBoundary(network, props.numCells, props.xDomain, props.yDomain));
    const [loss, setLoss] = useState<number>(vis.getCost(network, dataset));

    // useEffect(() => {
    //     console.log("useEffect init MainPage");
    //     generateNetwork();
    //     generateDataset();
    // },[]);

    useEffect(() => {
        console.log("Config change useEffect");
        generateNetwork();
        generateDataset();
        updateDecisionBoundary();
    },[config]);

    const generateDataset = () => {
        console.log("Generating dataset");
        setDataset(vis.get2GaussDist(props.noSamples));
    }

    const generateNetwork = () => {
        console.log("Generating network");
        setNetwork(vis.start(config));
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        // Don't like numcells having to be the same
        network && setDecisionBoundary(vis.getOutputDecisionBoundary(network, props.numCells, props.xDomain, props.yDomain));
    }

    const reset = () => {
        console.log("Reset");
        generateNetwork();
        generateDataset();
        //updateDecisionBoundary();
    }


    const step = (noSteps: number) => { // 1
        console.log(`MainPage step(${noSteps})`);
        let start = Date.now();
        for (let i = 0; i < noSteps; i++) {
            network && dataset && vis.step(network, dataset);
        }

        let delta = Date.now() - start;
        console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);
        setLoss(vis.getCost(network, dataset))
        console.log(loss)
        updateDecisionBoundary();
    }

    const handleActivationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setConfig({...config, activationFunction: e.target.value as string})
    }

    return (
        <div className="container">
            <div className="config-bar">
                <InputLabel id="label">Activation Function</InputLabel>
                <Select id="select" value={config.activationFunction} onChange={handleActivationChange}>
                    <MenuItem value="ReLU">ReLU</MenuItem>
                    <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                </Select>
                <Button variant={"contained"} color={"primary"} onClick={generateDataset}> Generate Dataset </Button>
                <Button variant={"contained"} color={"secondary"} onClick={reset}> Reset </Button>
                <Button variant={"contained"} onClick={() => step(1)}> Step 1</Button>
                <Button variant={"contained"} onClick={() => step(100)}> Step 100</Button>
            </div>
            <div className="network"></div>
            <div className="nn-graph">
                {dataset && <NNGraph 
                    dataset = {dataset}
                    density = {100}
                    canvasWidth = {160}
                    margin = {20}
                    numCells = {props.numCells}
                    xDomain = {props.xDomain}
                    yDomain = {props.yDomain}
                    decisionBoundary = {decisionBoundary}
                />}
                {/* {dataset && <NNGraph 
                    dataset = {dataset}
                    density = {100}
                    canvasWidth = {320}
                    canvasHeight = {320}
                    margin = {20}
                    numCells = {props.numCells}
                    xDomain = {props.xDomain}
                    yDomain = {props.yDomain}
                    decisionBoundary = {decisionBoundary}
                />} */}
            </div>
            <div className="stats">
                <h2>Loss: {loss}</h2>
            </div>
            
        </div>
    );
}
// Minimum information to NNGraph to render the correct immage
// Don't necessarally want to re-render whole of NNGraph unless that is what you're supposed to do
// In something like Java I'd expect to do NNGraph.updateBackground(decisionBoundary)

export default MainPage;