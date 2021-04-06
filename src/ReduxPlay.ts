import React from "react";
// import { combineReducers } from "redux";
// import { createStore } from "redux";
// import { NNConfig } from "./components/MainPage";
// import { networkReducer } from "./NetworkReducer";



// // STORE -> GLOBALISED STATE

// // ACTION ADD LAYER
// const addLayer = () => {
//     return {
//         type: "ADD_LAYER"
//     }
// }

// const removeLayer = () => {
//     return {
//         type: "REMOVE_LAYER"
//     }
// }



// // REDUCER
// const defaultNetworkState: NNConfig = {
//     networkShape: [2, 2, 2, 1],
//     activationFunction: "Tanh",
//     learningRate: 0.03,
//     inputs: {
//         "x": true,
//         "y": true,
//         "xSquared": false,
//         "ySquared": false,
//         "xTimesY": false,
//         "sinX": false,
//         "sinY": false
//     },
//     batchSize: 10, // CHange this back to 10
// }

// const addLayer2 = (state: NNConfig) => {
//     console.log("Running addLayer");
//     if (state.networkShape.length < 6) {
//         let newNetworkShape = state.networkShape;
//         state.networkShape.pop();
//         state.networkShape.push(state.networkShape[state.networkShape.length - 1]);
//         state.networkShape.push(1);
//         // console.log(newNetworkShape);
//         // setConfig({ ...state, networkShape: newNetworkShape });
//     }
//     return state;
// }

// const removeLayer2 = (state: NNConfig) => {
//     console.log("Running removeLayer");
//     if (state.networkShape.length > 2) {
//         // let newNetworkShape = config.networkShape;
//         state.networkShape.pop();
//         state.networkShape.pop();
//         state.networkShape.push(1);
//         // console.log(newNetworkShape);
//         // setConfig({ ...config, networkShape: newNetworkShape });
//     }
//     return state;
// }

// interface NetworkAction {
//     type: string,
//     state: NNConfig,
// }

// const networkReducer = (state = defaultNetworkState, action: NetworkAction): NNConfig => {
//     switch(action.type) {
//         case "ADD_LAYER":
//             return addLayer2(state);
//         case "REMOVE_LAYER":
//             return removeLayer2(state);
//         default:
//             return state;
//     }
// }

// export const rootReducer = combineReducers({
//     network: networkReducer
// });

// export let store = createStore(rootReducer);

// store.subscribe(() => console.log(store.getState()));

// // const addLayer = (state) => {
// //     console.log("Running addLayer");
// //     if (state.networkShape.length < 6) {
// //         let newNetworkShape = state.networkShape;
// //         newNetworkShape.pop();
// //         newNetworkShape.push(newNetworkShape[newNetworkShape.length - 1]);
// //         newNetworkShape.push(1);
// //         console.log(newNetworkShape);
// //         setConfig({ ...state, networkShape: newNetworkShape });
// //     }
// // }


// // DISPATCH

// store.dispatch(addLayer());
