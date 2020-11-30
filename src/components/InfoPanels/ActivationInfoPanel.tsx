import styled from "@emotion/styled";
import React from "react";
import { NNConfig } from "../MainPage";
import sigmoid from "../SVGs/Sigmoid-function-2.svg";


const ActivationImg = styled("img")`
    width: 600px;
`;

function ActivationInfoPanel(props: NNConfig) {

    return (
        <div>
            <h1>Activation Functions (&epsilon;)</h1>
            <h2>Sigmoid</h2>
            <ActivationImg src={sigmoid} alt="Sigmoid Function"/>
            <p></p>
        </div>
    );
}

export default ActivationInfoPanel;