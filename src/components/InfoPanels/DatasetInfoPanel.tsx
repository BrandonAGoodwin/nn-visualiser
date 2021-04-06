import React from "react";
import { DefinedTerm, DefX1, DefX2 } from "../Definitions";
import { NNConfig } from "../../Network";

function DatasetInfoPanel(props: NNConfig) {

    return (
        <div>
            <h1>Datasets</h1>
            <p>These are the data sets you can use to train and test your network. All the points in the data sets have 2 features (<DefinedTerm definition={DefX1()}>X<sub>1</sub></DefinedTerm> and <DefinedTerm definition={DefX2()}>X<sub>2</sub></DefinedTerm>) and fall under one of two classifications (-1 or +1).</p>
            <h2>Gaussian 2</h2>
            <p>This data set is comprised of two 2-Dimensional Gaussian (or Normal) distributed sets of points, one for each class.<br/>
            <a href="https://en.wikipedia.org/wiki/Normal_distribution" target="_blank">Read more here (Wiki)</a></p>
            <h2>Gaussian 3</h2>
            <p>This data set is comprised of three 2-Dimensional Gaussian (or Normal) distributed sets of points, one group of +1 points and two groups of -1 points.</p>
            <h2>XOR</h2>
            <p>This data set represents an XOR distributed set of points which cannot be classified using a straight line.<br/>
            <a href="https://www.google.com/search?q=XOR" target="_blank">Read more here (Google)</a></p>
        </div>
    );
}

export default DatasetInfoPanel;