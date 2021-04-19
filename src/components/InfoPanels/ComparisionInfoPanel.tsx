import React from "react";
import SaveIcon from '@material-ui/icons/Save';
import ReplayIcon from '@material-ui/icons/Replay';
import DeleteIcon from '@material-ui/icons/Delete';

interface ComparisionInfoPanelProps {

}

function ComparisionInfoPanel(props: ComparisionInfoPanelProps) {

    return (
        <div style={{ maxWidth: "80%" }}>
            <h1>Comparing Networks</h1>
            <p>
                The comparison tools allow you to save your current network configuration so that you can save and modify a neural network to see the modifications affect the performance of the neural network.
            </p>
            <h2>Save <SaveIcon /></h2>
            <p>
                Saving <b>saves all the parameters of the network</b> (i.e. learning rate, activation function, shape), <b> the current state of the neural network</b> (i.e. weight + bias values and loss data) <b>and the current data set + configuration</b>.<br />
                <ul>
                    <li>While a network is saved the loss graph at the bottom of the right most panel will show the loss data of both the current network and the saved network.</li>
                    <li>If the network is <span style={{ background: "#F50057", color: "#FFFFFF" }}>RESET</span> the (untrained) network is reset with the saved configuration and the data set is not regenerated.</li>
                </ul>

            </p>
            <h2>Load <ReplayIcon /></h2>
            <p>
                Loading <b>loads in the saved network parameters</b> (i.e. learning rate, activation function, shape), <b> the saved state of the neural network</b> (i.e. weights and bias values) <b>and the saved data set + configuration</b>.<br />
                <ul>
                    <li>Use the load function to reset the network back to the saved state to try another modification. <br/>(Warning: This will reset the unsaved loss data)</li>
                </ul>
            </p>
            <h2>Clear <DeleteIcon /></h2>
            <p>
                Clearing <b>deletes the saved network state, configuration and data set permanently</b>.
                <ul>
                    <li>This also <b>deletes the saved loss data</b> removing it from the loss graph</li>
                </ul>
            </p>
        </div>
    );
}

export default ComparisionInfoPanel;