
import React, { useEffect, useState } from 'react';
import * as vis from '../visControl'
import { Dataset2D } from '../datasets';
import NNGraph from './NNGraph';
import { Button } from '@material-ui/core';
import * as nn from './../NeuralNet';


type PageProps = {
    xDomain: number[];
    yDomain: number[];
    noSamples: number;
    numCells: number;
}

// Implement grid area layout on CSS

function MainPage(props: PageProps) {
    const [dataset, setDataset] = useState<Dataset2D[]>([]);
    const [network, setNetwork] = useState<nn.Node[][]>([]);
    const [decisionBoundary, setDecisionBoundary] = useState<number[]>([]);
    // const xDomain = [-8, 8];
    // const yDomain = [-8, 8];
    // const noSamples = 30;
    // const gausData = vis.get2GaussDist(noSamples);
    // const network = vis.start([2, 2, 1], vis.generateInputIds());

    //const numCells = 100;
    //const container = createRef<HTMLDivElement>();

    
    // constructor(props : PageProps) {
    //     super(props)
    //     state = {
    //         decisionBoundary: vis.getOutputDecisionBoundary(network, numCells, xDomain, yDomain)
    //     };  
    // }

    useEffect(() => {
        console.log("useEffect init MainPage");
        generateNetwork();
        generateDataset();
    },[]);

    const reset = () => {
        console.log("Reset");
        generateNetwork();
        generateDataset();
        updateDecisionBoundary();
    }

    const generateDataset = () => {
        console.log("Generating dataset");
        setDataset(vis.get2GaussDist(props.noSamples));
    }
    // componentDidMount() { // HAppen after the components have rendered
    //     test();
    // }

    const generateNetwork = () => {
        console.log("Generating network");
        setNetwork(vis.start([2, 4, 4, 1], vis.generateInputIds()));
    }

    const updateDecisionBoundary = () => {
        console.log("Updating decision boundary");
        // Don't like numcells having to be the same
    //     setState({
    //         decisionBoundary: vis.getOutputDecisionBoundary(network, numCells, xDomain, yDomain)
    //     });
        network && setDecisionBoundary(vis.getOutputDecisionBoundary1D(network, props.numCells, props.xDomain, props.yDomain));
    }


    // test() {
    //     console.log(vis.getCost(network, gausData))
    //     for (let i = 0; i < 1000; i++) {
    //         //console.log("Step")
    //         vis.step(network, gausData);
    //     }
    //     console.log(network)
    //     console.log(vis.getCost(network, gausData))
    // }

    const step = (noSteps: number) => { // 1
        console.log(`MainPage step(${noSteps})`);
        let start = Date.now();
        for (let i = 0; i < noSteps; i++) {
            network && dataset && vis.step(network, dataset);
        }

        let delta = Date.now() - start;
        console.log(`Finished training step(${noSteps}) (Duration ${delta}ms)`);
        console.log(vis.getCost(network, dataset))
        updateDecisionBoundary();
    }

    return (
        <>  
        <div>
            <Button onClick={generateDataset}> Generate Dataset </Button>
            <Button onClick={reset}> Reset </Button>
        </div>
        <div>
            {dataset && <NNGraph // MAKE FUNCTIONAL COM
                //id = {"graph-1"}
                //container = {}
                dataset = {dataset}
                density = {100}
                canvasWidth = {640}
                canvasHeight = {640}
                margin = {20}
                numCells = {props.numCells}
                xDomain = {props.xDomain}
                yDomain = {props.yDomain}
                decisionBoundary = {decisionBoundary}
            />}
            {/* {dataset && <NNGraph // MAKE FUNCTIONAL COM
                id = {"graph-2"}
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
            <Button onClick={() => updateDecisionBoundary()}> Update Decision Boundary </Button>
            <Button onClick={() => step(1)}> Step 1</Button>
            <Button onClick={() => step(100)}> Step 100</Button>
        </>
    );
}
// Minimum information to NNGraph to render the correct immage
// Don't necessarally want to re-render whole of NNGraph unless that is what you're supposed to do
// In something like Java I'd expect to do NNGraph.updateBackground(decisionBoundary)

export default MainPage;