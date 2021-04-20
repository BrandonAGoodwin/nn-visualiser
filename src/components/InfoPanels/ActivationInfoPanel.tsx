import styled from "@emotion/styled";
import React, { useContext } from "react";
import { DefinedTerm, DefNode } from "../Definitions";
import { NNConfig } from "../../NetworkController";
import sigmoid from "../SVGs/Sigmoid-function-2.svg";
import NodeInfoPanel from "./NodeInfoPanel";
import { InfoPanelContext } from "../../contexts/InfoPanelContext";


const ActivationImg = styled("img")`
    width: 600px;
`;

function ActivationInfoPanel() {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    return (
        <div>
            <h1>Activation Functions (&Phi;)</h1>
            <p>Activation function of a <DefinedTerm definition={DefNode()} onClick={setInfoPanelWrapper} infoPanel={<NodeInfoPanel />}>node</DefinedTerm></p>
            <h2>Sigmoid</h2>
            <ActivationImg src={sigmoid} alt="Sigmoid Function" />
            <p></p>
        </div>
    );
}

export default ActivationInfoPanel;