import React from "react";
import { MathComponent } from "mathjax-react";
import { Button } from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';



interface LearningRateInfoPanelProps {
    handleSetLearningRateExercise: () => void;
}

function LearningRateInfoPanel(props: LearningRateInfoPanelProps) {

    return (
        <div style={{ float: "left"}}>
            <h1>Learning Rate (&epsilon;)</h1>
            <p>The learning rate affects the rate at which the weights and biases change each epoch when training the neural network.</p>
            <h2>Usage</h2>
            <MathComponent tex={String.raw`w'=w-\epsilon\Delta J(x)`} />
            <h3>Exercise</h3>
            <Button
                variant="outlined"
                color="secondary"
                endIcon={<PlayArrowIcon />}
                onClick={props.handleSetLearningRateExercise}
            >
                Learning Rate Exercise
            </Button>
            <p>Try running a dozen epochs of training with the preset learning rate and save the state using the <b>Save</b> <SaveIcon fontSize={"small"} /> button, then <b>increase or decrease the learning rate to see how the learning rate affects the training performance</b> using the <b>loss graph</b>.</p>
            <h2>Observations</h2>
            <p>
                We observe that <b>smaller</b> learning rates lead to <b>slower learning</b> but <b>more precise decision boundaries </b>
                and <b>less fluctuating</b> around the local optima and conversely <b>larger</b> learning rates lead to <b>faster learning </b>
                but <b>less precise decision boundaries</b> and <b>more fluctuating</b> around local minima.
            </p>
        </div>
    );
}

export default LearningRateInfoPanel;