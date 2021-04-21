import styled from "@emotion/styled";
import React, { useContext } from "react";
import { DefinedTerm, DefNode } from "../Definitions";

import sigmoid from "../SVGs/Sigmoid-function-2.svg";
import reLU from "../SVGs/Activation_rectified_linear.svg";
import NodeInfoPanel from "./NodeInfoPanel";
import { InfoPanelContext } from "../../contexts/InfoPanelContext";
import { MathComponent } from "mathjax-react";


const ActivationImg = styled("img")`
    width: 300px;
`;

function ActivationInfoPanel() {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    return (
        <div>
        <h1>Activation Functions (&Phi;)</h1>
        <p>
            The activation function of a <DefinedTerm definition={DefNode()} onClick={setInfoPanelWrapper} infoPanel={<NodeInfoPanel />}>node</DefinedTerm> defines the output of the node given a set of inputs. Non-linear activation functions allow small networks to compute nontrivial problems.
        </p>
        <h2>Sigmoid</h2>
        <p>
        <MathComponent display={false} tex={String.raw`S(x)=\frac{1}{1+e^{-x}}`} /> <br/><br/>
        The sigmoid activation function is a non linear activation function that has a range between 0 and 1.
        </p>

        <ActivationImg src={sigmoid} alt="Sigmoid Function" />
        <h2>ReLU</h2>
        <MathComponent display={false} tex={String.raw`x \le 0: 0`} /> <br/>
        <MathComponent display={false} tex={String.raw`x > 0: x`} /> <br/>
        <p>The rectified linear function is another non-linear function that ranges between 0 and &infin;.</p>
        <ActivationImg src={reLU} alt="ReLU" />
    </div>
    );
}

export default ActivationInfoPanel;