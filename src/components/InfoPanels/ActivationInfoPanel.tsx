import styled from "@emotion/styled";
import React from "react";
import { DefinedTerm, DefNode } from "../Definitions";
import { NNConfig } from "../MainPage";
import sigmoid from "../SVGs/Sigmoid-function-2.svg";


const ActivationImg = styled("img")`
    width: 600px;
`;

function ActivationInfoPanel(props: NNConfig) {

    return (
        <div>
            <h1>Activation Functions (&Phi;)</h1>
            <p>Activation function of a <DefinedTerm definition={DefNode()}>node</DefinedTerm></p>
            <h2>Sigmoid</h2>
            <ActivationImg src={sigmoid} alt="Sigmoid Function"/>
            <p></p>
        </div>
    );
}

export default ActivationInfoPanel;