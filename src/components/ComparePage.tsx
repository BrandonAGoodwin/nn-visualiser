import styled from "@emotion/styled";
import React from "react";
import { NetworkState } from "../NetworkController";
import LossGraph from "./LossGraph";


const ContainerSection = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    background-color: white;
    margin: 30px auto;
    min-width: 800px;
    width: auto;
    max-width: 60vw;
    height: 80vh;
    padding: 30px;
    border-radius: 30px;
    border: 2px solid #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

interface PageProps {
    savedState?: NetworkState;
    currentState?: NetworkState;
}

function ComparePage(props: PageProps) {

    return (
        <ContainerSection id="compare-page">
{/* 
            {props.currentState && <LossGraph
                height={60}
                width={170}
                margin={5}
                //dataset={props.currentState.lossData}
                analyticsData={props.currentState.analyticsData}
                comparisonAnalyticsData={props.savedState?.analyticsData}
                // comparisionData={props.savedState?.lossData}
            />} */}
            <div>
                <h1>About this Tool &#128640;{/* &#10024; */}</h1>
                <p>
                    Hi, my name is Brandon &#128075;&#127997;,<br/> I am a bachelors student studying in computer science in their final year.<br/>
                    I created this tool for my final year project. The goal of the project was to produce an interactive learning tool with the aim of aiding students’ understanding of neural networks. 
                </p>
            </div>
        </ContainerSection>
    );
}

export default ComparePage;