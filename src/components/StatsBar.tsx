import styled from "@emotion/styled";
import React from "react";
import { ContainerSection } from "./MainPage";

const StyledStatsBar = styled((props: any) => <ContainerSection gridArea="stats" {...props} />)`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 0px;
    justify-content: space-around;
    align-items: center;
`;

interface StatsBarProps {

}

function StatsBar(props: StatsBarProps) { 
    return(
        <StyledStatsBar>

        </StyledStatsBar>
    );
}

export default StatsBar;