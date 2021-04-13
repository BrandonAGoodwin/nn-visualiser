import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
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
    handleStep: () => void;
    toggleAutoTrain: () => void;
    toggleDiscreetOutput: () => void;
    handleRegenerateDataset: () => void;
    handleReset: () => void;
}

function ControlPanel(props: ControlPanelProps) {
    const {
        training,
        handleStep,
        toggleAutoTrain,
        toggleDiscreetOutput,
        handleRegenerateDataset,
        handleReset
    } = props;
    return (
        <StyledControlPanel>
            <StyledButton variant={"contained"} onClick={handleStep}> Step </StyledButton>
            <StyledButton variant={"contained"} onClick={toggleAutoTrain}> Auto Train: <b>{training ? "On" : "Off"}</b></StyledButton>
            <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton>
            <StyledButton variant={"contained"} color={"primary"} onClick={handleRegenerateDataset}> Regenerate Dataset </StyledButton>
            <StyledButton variant={"contained"} color={"secondary"} onClick={handleReset}> Reset </StyledButton>
            {/* <StyledButton variant={"contained"} onClick={saveCurrentState}> Save Current Network State </StyledButton> 
                <StyledButton variant={"contained"} onClick={loadSavedState} disabled={(!networkController.compareMode) || false}> Load Network State </StyledButton>
                <StyledButton variant={"contained"} onClick={clearNetworkState}> Clear Network State </StyledButton> */}
        </StyledControlPanel>
    );
}

export default ControlPanel;