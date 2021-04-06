import { Action, Reducer } from "@reduxjs/toolkit";
import { NetworkActionTypes, ADD_LAYER, REMOVE_LAYER } from "./actions";
import { NNConfig } from "./Network";

export interface NetworkState {
    config: NNConfig
}

const defaultNetworkState: NetworkState = {
    config: {
        networkShape: [2, 2, 2, 1],
        activationFunction: "Tanh",
        learningRate: 0.03,
        inputs: {
            "x": true,
            "y": true,
            "xSquared": false,
            "ySquared": false,
            "xTimesY": false,
            "sinX": false,
            "sinY": false
        },
       batchSize: 10
    }
}

const addLayer = (state: NetworkState) => {
    const { networkShape } = state.config;
    // console.log("Running addLayer");
    if (networkShape.length < 6) {
        // let newNetworkShape = networkShape;
        networkShape.pop();
        networkShape.push(networkShape[networkShape.length - 1]);
        networkShape.push(1);
        // console.log(newNetworkShape);
        // setConfig({ ...state, networkShape: newNetworkShape });
    }
    return state;
}

const removeLayer = (state: NetworkState) => {
    const { networkShape } = state.config;
    // console.log("Running removeLayer");
    if (networkShape.length > 2) {
        // let newNetworkShape = config.networkShape;
        networkShape.pop();
        networkShape.pop();
        networkShape.push(1);
        // console.log(newNetworkShape);
        // setConfig({ ...config, networkShape: newNetworkShape });
    }
    return state;
}

export const networkReducer: Reducer<NetworkState, Action> = (state = defaultNetworkState, action: NetworkActionTypes) => {
    // const nextState = {
    //     ...state
    // }
    switch(action.type) {
        case ADD_LAYER:
            return addLayer(state);
        case REMOVE_LAYER:
            return removeLayer(state);
        default:
            return state;
    }
}