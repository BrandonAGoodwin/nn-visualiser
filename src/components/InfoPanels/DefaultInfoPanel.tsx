import React, { useContext } from "react";
import positiveLink from "../../PositiveLink.png";
import negativeLink from "../../NegativeLink.png";
import node from "../../WebpageIcon.png";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Info } from "@material-ui/icons";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

function DefaultInfoPanel() {

    const { minColourName, maxColourName } = useContext(ThemeContext);

    return (
        <div>
            <h1>How To Get Started</h1>
            <p>
                This is a tool that lets you play with a simple neural network implementation. <br/>Below are instructions on how to get started designing your own neural network and testing its performance.
                <ul>
                    <li>Train the network using the <span style={{ background: "#e0e0e0", color: "black" }}>STEP</span> or <span style={{ background: "#e0e0e0", color: "black" }}>AUTO TRAIN</span> controls found in the top right panel to form a decison boundary to separate the sample data.</li>
                    <li>Changing the variables at the top of the page will modify the network parameters.</li>
                    <li>Use the <AddCircleIcon fontSize={"small"} /> and <RemoveCircleIcon fontSize={"small"} /> buttons in the center panel to change the shape of the network.</li>
                    <li>
                        Hovering over <b>info buttons</b> <Info fontSize={"small"} /> will display a tool-tip to provide help navigating the tool. <br/>
                        <i>(<b>Note:</b> Some tool-tips can clicked to access more information at bottom of the screen)</i>
                    </li>
                    <li>There are some exercises to help show the effects of certain hyper-parameters that can be accessed via the <b>info buttons</b> <Info fontSize={"small"} /> (e.g. batch size exercise and learning rate exercise).</li>
                    <li>Use the Insights panel above to see properties of the current network configuration. </li>
                </ul>
            </p>
            <h2>Neural Network</h2>
            <h3>Nodes</h3>
            <p>Nodes (or neurons) are use by the network to define decision boundaries and are represented in the tool as shown below.</p>
            <img src={node} alt="Decision boundary" width={60} />
            <p>Each node displays the decision boundary formed at that node. Each node has a bias value that is displayed by overing over the node with the cursor.</p>
            <h3>Links</h3>
            {/* Maths font w? */}
            {/* Defined Term or google link for Gradient Descent*/}
            <p>Links (or edges) connect neurons in adjacent layers, each link has a weight value w that is updated by training the network using Gradient Descent.<br/>
            The weight of each link is displayed when hovered over using the cursor.</p>

            <h4>Magnitude</h4>
            <p>The width of a link corresponds to the absolute magnitude of its weight. Wider links have greater absolute weight values (and therefore have a stronger influence in the destination node) than narrower links.</p>
            <h4>Positive Value Link</h4>
            <img src={positiveLink} alt="Positive link" width={100} />
            <p>Links with a weight value &gt; 0 are {maxColourName}.</p>
            <h4>Negative Value Link</h4>
            <img src={negativeLink} alt="Negative link" width={100} />
            <p>Links with a weight value &lt; 0 are {minColourName}.</p>
            {/* <h4>Mention/Link to:</h4>
            <ul>
                <li>Node representation</li>
                <li>Link representation</li>
                <li>Inputs</li>
                <li>Data set</li>
                <li>Building network</li>
                <li>Training</li>
                <li>Comparision func</li>
                <li>Tool tips</li>
            </ul>
            <p></p> */}
        </div>
    );
}

export default DefaultInfoPanel;