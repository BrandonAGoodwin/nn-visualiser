import React from "react";
import { NNConfig } from "../MainPage";

function DatasetInfoPanel(props: NNConfig) {

    return (
        <div>
            <h1>Datasets</h1>
            <p>The are the data sets you can use to train and test your network.</p>
            <h2>Gaussian</h2>
            <p>This data set is comprised of 2 2-Dimensional Gaussian (or Normal) distributed sets of points, one for each class.<br/>
            <a href="https://en.wikipedia.org/wiki/Normal_distribution" target="_blank">Read more here (Wiki)</a></p>
            <h2>XOR</h2>
            <p>This data set represents an XOR distributed set of points which cannot be classified using a straight line.</p>
        </div>
    );
}

export default DatasetInfoPanel;