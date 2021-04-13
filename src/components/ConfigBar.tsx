import React from "react";
import { NNConfig, useNetwork } from "../NetworkController";

interface ConfigBarProps {
    nnConfig: NNConfig;
}

function ConfigBar(props: ConfigBarProps) {
    const {
        config,
        setActivationFunction,
        setLearningRate,
        setBatchSize
    } = useNetwork(props.nnConfig);
    return(
        <div>
            <p>hi</p>
        </div>
    );
}

export default ConfigBar;