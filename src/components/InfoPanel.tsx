import styled from "@emotion/styled";
import { IconButton } from "@material-ui/core";
import { ArrowBackIos, Home, ArrowForwardIos } from "@material-ui/icons";
import React, { useContext } from "react";
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { ContainerSection } from "./MainPage";

const StyledInfoPanel = styled((props: any) => <ContainerSection gridArea="info" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding-left: 30px;
    padding-top: 10px;
    position: relative;
    max-width: inherit;
    /* max-width: fit-content; */
`;

interface InfoPanelProps {

}

function InfoPanel(props: InfoPanelProps) {
    const {
        infoPanelData,
        handleInfoPanelForward,
        handleInfoPanelBackward,
        handleInfoPanelHome
    } = useContext(InfoPanelContext);
    
    return(
        <StyledInfoPanel>
                {infoPanelData.infoPanel}
                <div style={{ position: "absolute", right: "40px", top: "30px" }}>
                    <IconButton onClick={handleInfoPanelBackward}>
                        <ArrowBackIos />
                    </IconButton>
                    <IconButton onClick={handleInfoPanelHome}>
                        <Home fontSize={"large"} />
                    </IconButton>
                    <IconButton onClick={handleInfoPanelForward}>
                        <ArrowForwardIos />
                    </IconButton>
                </div>
            </StyledInfoPanel>
    );
}

export default InfoPanel;