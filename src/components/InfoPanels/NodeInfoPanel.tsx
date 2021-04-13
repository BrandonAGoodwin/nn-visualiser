import React from "react";
import { NNConfig } from "../../NetworkController";
import { MathComponent } from "mathjax-react";

function NodeInfoPanel(props: NNConfig) {

    return (
        <div>
            <h1>Nodes</h1>
            <p>Nodes are the individual functions that make up the neural network and are connected to nodes in adjacent layers by links.</p>
            <h2>Usage</h2>
        </div>
    );
}

export default NodeInfoPanel;