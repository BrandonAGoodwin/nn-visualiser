import styled from '@emotion/styled';
import { Button, Divider, IconButton, Tooltip, Typography } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useContext } from 'react';
import { ContainerSection, StyledInfoButton } from './MainPage';
import { InfoPanelContext } from '../contexts/InfoPanelContext';
import { DefinedTerm, DefX1, DefX2 } from './Definitions';
import OutputInfoPanel from './InfoPanels/LossInfoPanel';

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
    const {} = useContext(InfoPanelContext);
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
            {/* <StyledButton variant={"contained"} onClick={toggleDiscreetOutput}> Toggle Discreet Boundary </StyledButton> */}
            <StyledButton variant={"contained"} color={"primary"} onClick={handleRegenerateDataset}> Regenerate Dataset </StyledButton>
            <StyledButton variant={"contained"} color={"secondary"} onClick={handleReset}> Reset </StyledButton>
            {/* <div> */}
                {/* <Tooltip title={"Save network state"} aria-label={"Save network state"} style={{ fontSize: 16 }}>
                    <IconButton onClick={saveNetworkState} >
                        <SaveIcon />
                    </IconButton>
                </Tooltip> */}
                <Divider style={{ maxWidth: "80%"}}/>
                <div style={{ display: "flex"}}>
                    <Tooltip title={"Save network state"} aria-label={"Save network state"} /* style={{ fontSize: 16 }} */>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={saveNetworkState}
                            // className={classes.button}
                            startIcon={<SaveIcon />}
                            style={{maxWidth: "min-content"}}
                        >
                            Save
                        </Button>
                    </Tooltip>
                    <StyledInfoButton title="Output Tooltip" marginLeft={5} fontSize="small" /* onClick={setInfoPanelWrapper} infoPanel={<OutputInfoPanel />} */>
                    <React.Fragment>
                        <Typography color="inherit">Output</Typography>
                        <Typography variant="body2"></Typography><br />
                    </React.Fragment>
                </StyledInfoButton>
                </div>
                <Tooltip title={"Clear saved network state"} aria-label={"Clear saved network state"} /* style={{ fontSize: 16 }} */>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={clearNetworkState}
                        // className={classes.button}
                        startIcon={<DeleteIcon />}
                        style={{maxWidth: "min-content"}}
                    >
                        Clear
                    </Button>
                </Tooltip>
                {/* <StyledButton variant={"contained"} onClick={saveNetworkState}> Save Current Network State </StyledButton> */}
                <StyledButton variant={"contained"} onClick={loadNetworkState} disabled={(!compareMode) || false}> Load Network State </StyledButton>
                {/* <Tooltip title={"Clear saved network state"} aria-label={"Save network state"} style={{ fontSize: 16 }}>
                    <IconButton onClick={clearNetworkState} >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip> */}

            {/* </div> */}
            {/* <StyledButton variant={"contained"} onClick={clearNetworkState}> Clear Network State </StyledButton> */}
        </StyledControlPanel>
    );
}

export default ControlPanel;