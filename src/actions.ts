export const ADD_LAYER = "ADD_LAYER";
export const REMOVE_LAYER = "REMOVE_LAYER";

export interface AddLayerAction {
    type: typeof ADD_LAYER;
}

export interface RemoveLayerAction {
    type: typeof REMOVE_LAYER;
}

export type NetworkActionTypes =
    | AddLayerAction
    | RemoveLayerAction;

export type NetworkActions = NetworkActionTypes;