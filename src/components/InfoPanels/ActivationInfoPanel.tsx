import styled from "@emotion/styled";
import React from "react";
import { DefinedTerm, DefNode } from "../Definitions";
import { NNConfig } from "../../NetworkController";
import sigmoid from "../SVGs/Sigmoid-function-2.svg";
import NodeInfoPanel from "./NodeInfoPanel";


const ActivationImg = styled("img")`
    width: 600px;
`;

function ActivationInfoPanel(props: {config: NNConfig, setInfoPanel: (infoPanel: JSX.Element) => void}) {

    return (
        <div>
            <h1>Activation Functions (&Phi;)</h1>
            <p>Activation function of a <DefinedTerm definition={DefNode()} onClick={props.setInfoPanel} infoPanel={<NodeInfoPanel {...props.config} />}>node</DefinedTerm></p>
            <h2>Sigmoid</h2>
            <ActivationImg src={sigmoid} alt="Sigmoid Function" />
            <p></p>
        </div>
    );
}

export default ActivationInfoPanel;