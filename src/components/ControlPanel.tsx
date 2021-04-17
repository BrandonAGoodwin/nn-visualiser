import styled from '@emotion/styled';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import { ContainerSection } from './MainPage';

const StyledControlPanel = styled((props: any) => <ContainerSection gridArea="control-panel" {...props} />)`
display: flex;
flex-direction: column;
align-items: stretch;
padding-top: 15px;
padding-bottom: 15px;
padding-left: 10px;
padding-right: 10px;
justify-content: left;
`;

const StyledButton = styled(Button)`
    margin: 5px;
`;

interface ControlPanelProps {
    training: boolean;
    compareMode: boolean;
    handleStep: () => void;
    toggleAutoTrain: () => void;
    toggleDiscreetOutput: () => void;
    handleRegenerateDataset: () => void;
    handleReset: () => void;
    saveNetworkState: () => void;
    loadNetworkState: () => void;
    clearNetworkState: () => void;
}

function ControlPanel(props: ControlPanelProps) {
    const {
        training,
        compareMode,
        handleStep,
        toggleAutoTrain,
        toggleDiscreetOutput,
        handleRegenerateDataset,
        handleReset,
        saveNetworkState,
        loadNetworkState,
        clearNetworkState
    } = props;
    return (
        <StyledControlPanel>
            <StyledButton variant={"contained"} onClick={handleStep}> Step </StyledButton>
            <StyledButton variant={"contained"} onClick={toggleAutoTrain}> Auto Train: <b>{training ? "On" : "Off"}</b></StyledButton>
            <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton>
            <StyledButton variant={"contained"} color={"primary"} onClick={handleRegenerateDataset}> Regenerate Dataset </StyledButton>
            <StyledButton variant={"contained"} color={"secondary"} onClick={handleReset}> Reset </StyledButton>
            <Tooltip title={"Save setwork state"} aria-label={"Save network state"} style={{ fontSize: 16}}>
                <IconButton onClick={saveNetworkState} >
                    <SaveIcon/>
                </IconButton>
            </Tooltip>
            <StyledButton variant={"contained"} onClick={saveNetworkState}> Save Current Network State </StyledButton>
            <StyledButton variant={"contained"} onClick={loadNetworkState} disabled={(!compareMode) || false}> Load Network State </StyledButton>
            <StyledButton variant={"contained"} onClick={clearNetworkState}> Clear Network State </StyledButton>
        </StyledControlPanel>
    );
}

export default ControlPanel;