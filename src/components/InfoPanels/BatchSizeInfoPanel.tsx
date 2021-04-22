import { Button } from '@material-ui/core';
import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';


interface BatchSizeInfoPanelProps {
    handleSetBatchExercise: () => void;
}

function BatchSizeInfoPanel(props: BatchSizeInfoPanelProps) {

    // Exercise explaination could go in insights section (COULD HAVE/WON'T HAVE)

    return (
        <div style={{ float: "left", maxWidth: "80%" }}>
            <h1>Batch Size</h1>

            <p>
                The batch size specifies the number of training examples used in each epoch of <a color={"lightblue"} href="https://www.google.com/search?q=mini+batch+gradient+descent" target="_blank">Mini-Batch Gradient Descent</a>.
            </p>
            <h3>Exercise</h3>
            <Button
                variant="outlined"
                color="secondary"
                endIcon={<PlayArrowIcon />}
                onClick={props.handleSetBatchExercise}
            >
                Batch Size Exercise
            </Button>
            <p>
                Try running a couple dozen epochs with the preset batch size and save the state using the <b>Save</b> <SaveIcon fontSize={"small"} /> button, then <b>change the batch size to see how the batch size affects the training performance</b> using the <b>loss graph</b>.
            </p>
            <h2>Mini-batch Gradient Descent</h2>
            <p>
                <ul>
                    <li> Weights and biases are updated after running back propagation every n training samples where n is the batch size. </li>
                    <li> Tends to be the most effective gradient descent method yielding the fastest training results</li>
                    <li> Doesn't suffer from fluctuation as it takes multiple data samples into account</li>
                    <li> Individal epochs aren't too computationally expensive as long as the batch size is only a fraction of the training set size</li>
                </ul>
            </p>

            <h2>Stochastic Gradient Descent</h2>
            <p>
                When the batch size = 1, this is equivalent to <a color={"lightblue"} href="https://www.google.com/search?q=stochastic+gradient+descent" target="_blank">Stochastic Gradient Descent</a>.
                <ul>
                    <li>This means the weights and biases are updated every time back propagation is done with a training sample</li>
                    <li>Training generally takes fewer epochs, but takes longer as weights and biases are updated for every sample in the training set, but training will be done in less epochs</li>
                    <li>This is more computationally expensive for the same reason</li>
                    <li>This can cause the decision boundary to fluctuate because weight updates will be more extreme as they are not being updated using the average of multiple derivatives accumulated over multiple iterations of back propagation</li>
                </ul>
            </p>
            <h2>Batch Gradient Descent</h2>
            <p>
                When the batch size = the number of training samples this is equivalent to batch gradient descent
            </p>
            <ul>
                <li>This means the weights and biases are updated once after back propagation has been done with all training samples</li>
                <li>Usually requires more epochs of training than mini-batch gradient decent as weight updates use an average over the whole data set making it hard to make more nuanced updates</li>
            </ul>
        </div>
    );
}

export default BatchSizeInfoPanel;