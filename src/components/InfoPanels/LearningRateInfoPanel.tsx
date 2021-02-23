import React from "react";
import { NNConfig } from "../MainPage";
import { MathComponent } from "mathjax-react";

function LearningRateInfoPanel(props: NNConfig) {

    return (
        <div style={{ float: "left"}}>
            <h1>Learning Rate (&epsilon;)</h1>
            <p>The learning rate affects the rate at which the weights and biases change each epoch when training the neural network.</p>
            <h2>Usage</h2>
            <MathComponent tex={String.raw`w'=w-\epsilon\Delta J(x)`} />
           <h2>Observations</h2>
            <p>
                We observe that <b>smaller</b> learning rates lead to <b>slower learning</b> but <b>more precise decision boundaries </b>
                and <b>less fluctuating</b> around the local optima and conversely <b>larger</b> learning rates lead to <b>faster learning </b>
                but <b>less precise decision boundaries</b> and <b>more fluctuating</b> around local minima.
            </p>
            <h3>Exercise</h3>
            <p>Try different different learning rates and see how much the loss is reduced on average after 3 epochs.</p>
        </div>
    );
}

export default LearningRateInfoPanel;