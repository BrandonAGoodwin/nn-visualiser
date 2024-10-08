import styled from '@emotion/styled';
import { Button, Divider, IconButton, Tooltip, Typography } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';
import React, { useContext } from 'react';
import { ContainerSection, StyledInfoButton } from './MainPage';
import { InfoPanelContext } from '../contexts/InfoPanelContext';
import ComparisionInfoPanel from './InfoPanels/ComparisionInfoPanel';

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
    handleReset: (resetDataset?: boolean) => void;
    saveNetworkState: () => void;
    loadNetworkState: () => void;
    clearNetworkState: () => void;
}

function ControlPanel(props: ControlPanelProps) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const {
        training,
        compareMode,
        handleStep,
        toggleAutoTrain,
        handleReset,
        saveNetworkState,
        loadNetworkState,
        clearNetworkState
    } = props;
    return (
        <StyledControlPanel>
            <div style={{ display: "flex", marginTop: "0px", alignItems: "flex-end" }}>
                <h4 style={{ marginBottom: "5px", marginTop: "0px" }}>Network Training</h4>
                <StyledInfoButton title="Network Training Tooltip" interactive={false} marginLeft={5} >
                    <React.Fragment>
                        <Typography variant="body2">
                            <b>Step:</b> Run one epoch of training on the network. <br />
                            <b>Auto Train:</b> Set the network to repeatedly train at a fixed rate.
                        </Typography>
                    </React.Fragment>
                </StyledInfoButton>
            </div>
            <Divider style={{ minWidth: "90%", marginLeft: "auto", marginRight: "auto", marginBottom: "5px" }} />
            <StyledButton variant={"contained"} onClick={handleStep}> Step </StyledButton>
            <StyledButton variant={"contained"} onClick={toggleAutoTrain}> Auto Train: <b>{training ? "On" : "Off"}</b></StyledButton>
            <StyledButton variant={"contained"} color={"secondary"} onClick={() => handleReset(false)}> Reset </StyledButton>
            <div style={{ display: "flex", marginTop: "10px", alignItems: "flex-end" }}>
                <h4 style={{ marginBottom: "5px", marginTop: "0px" }}>Comparison Tools</h4>
                <StyledInfoButton title="Comparison Tools Tooltip" interactive={false} marginLeft={5} onClick={setInfoPanelWrapper} infoPanel={<ComparisionInfoPanel />}>
                    <React.Fragment>
                        <Typography variant="body2">
                            The comparision tools allow you to save the current state of your network so that you can change the configuration and see how the changes effect the performance of the network. <br />
                            <u>(Click the icon for instructions on how to utilise this)</u>
                        </Typography>
                    </React.Fragment>
                </StyledInfoButton>
            </div>
            <Divider style={{ minWidth: "90%", marginLeft: "auto", marginRight: "auto"/* , marginBottom: "10px" */ }} />

            <Tooltip title={"Save network state"} aria-label={"Save network state"} /* style={{ fontSize: 16 }} */>
                <Button
                    variant="contained"
                    color="primary"
                    // size="small"
                    onClick={saveNetworkState}
                    startIcon={<SaveIcon />}
                    style={{ /* maxWidth: "min-content", */ marginTop: "10px" }}
                >
                    Save
                        </Button>
            </Tooltip>
            <Tooltip title={"Load saved network state"} aria-label={"Load saved network state"} /* style={{ fontSize: 16 }} */>
                <Button
                    variant="contained"
                    color="primary"
                    // size="small"
                    onClick={loadNetworkState}
                    startIcon={<ReplayIcon />}
                    disabled={(!compareMode) || false}
                    style={{ /* maxWidth: "min-content", */ marginTop: "10px" }}
                >
                    Load
                        </Button>
            </Tooltip>
            <Tooltip title={"Clear saved network state"} aria-label={"Clear saved network state"} /* style={{ fontSize: 16 }} */>
                <Button
                    variant="contained"
                    color="primary"
                    // size="small"
                    onClick={clearNetworkState}
                    startIcon={<DeleteIcon />}
                    style={{ /* maxWidth: "min-content",  */marginTop: "10px" }}
                >
                    Clear
                    </Button>
            </Tooltip>
        </StyledControlPanel >
    );
}

export default ControlPanel;