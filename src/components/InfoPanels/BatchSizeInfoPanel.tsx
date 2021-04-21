import { Button } from '@material-ui/core';
import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

interface BatchSizeInfoPanelProps {
    handleSetBatchExercise: () => void;
}

function BatchSizeInfoPanel(props: BatchSizeInfoPanelProps) {


    return (
        <div style={{ float: "left" }}>
            <h1>Batch Size</h1>
            <p>The batch size Specifies the number of training examples used in each epoch of <a color={"lightblue"} href="https://www.google.com/search?q=mini+batch+gradient+descent" target="_blank">Mini-Batch Gradient Decent</a>.<br />
            (When batch size = 1, this is equivalent to <a color={"lightblue"} href="https://www.google.com/search?q=stochastic+gradient+descent" target="_blank">Stochastic Gradient Decent</a></p>
            <Button variant="outlined" color="secondary" endIcon={<PlayArrowIcon/>} onClick={props.handleSetBatchExercise}>Batch Size Exercise</Button>
        </div>
    );
}

export default BatchSizeInfoPanel;