import styled from "@emotion/styled";
import { FormControlLabel, FormGroup, Switch, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Datapoint2D } from "../datasets";
import ColourScale from "./ColourScale";
import LossInfoPanel from "./InfoPanels/LossInfoPanel";
import LossGraph from "./LossGraph";
import { ContainerSection, StyledInfoButton } from "./MainPage";
import NNGraph from "./NNGraph";
import * as nn from "../NeuralNet"
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { AnalyticsData, NetworkState } from "../NetworkController";
import OutputInfoPanel from "./InfoPanels/LossInfoPanel";
import { DefLoss, DefOutput } from "./Definitions";

export const ColouredBox = styled("div")`
    float: left;
    height: 1em;
    width: 1em;
    border: 1px solid black;
    background-color: ${((props: { colour: string }) => props.colour)};
    clear: both;
    margin-right: 5px;
`

const StyledGraphPanel = styled((props: any) => <ContainerSection gridArea="nn-graph" {...props} />)`
display: block;
`

interface GraphPanelProps {
    network: nn.Node[][] | undefined;
    trainingData: Datapoint2D[];
    testData: Datapoint2D[];
    numCells: number;
    xDomain: number[];
    yDomain: number[];
    decisionBoundary: number[];
    discreetBoundary: boolean;
    toggleDiscreetBoundary: () => void;
    analyticsData: AnalyticsData;
    comparisonAnalyticsData: AnalyticsData | undefined;
    comparisonData: NetworkState | undefined;
    domain: [number, number];
}

function GraphPanel(props: GraphPanelProps) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const { maxColour, minColour, midColour } = useContext(ThemeContext);
    const {
        network,
        trainingData,
        testData,
        numCells,
        xDomain,
        yDomain,
        decisionBoundary,
        discreetBoundary,
        toggleDiscreetBoundary,
        analyticsData,
        comparisonAnalyticsData,
        domain
    } = props;

    let [showTestData, setShowTestData] = useState(false);

    let [trainingEpoch, trainingLoss]: [number, number] = [0, 0];
    let [testEpoch, testLoss]: [number, number] = [0, 0];
    if (analyticsData.testLossData.length > 0) {
        [trainingEpoch, trainingLoss] = analyticsData.trainingLossData[analyticsData.trainingLossData.length - 1];
        [testEpoch, testLoss] = analyticsData.testLossData[analyticsData.testLossData.length - 1];
    }

    // let [testEpoch, testLoss]: [number, number] = [0, 0];
    // if (comparisonAnalyticsData && comparisonAnalyticsData.testLossData.length > 0) {
    //     [testEpoch, testLoss] = comparisonAnalyticsData.trainingLossData[comparisonAnalyticsData.trainingLossData.length - 1];
    // }

    return (
        <StyledGraphPanel>
            <div style={{ display: "flex", marginLeft: "25px" }}>
                <Typography variant="h6">Output</Typography>
                <StyledInfoButton title="Output Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<OutputInfoPanel />}>
                    {DefOutput()}
                </StyledInfoButton>
                <ColourScale
                    width={150}
                    height={15}
                    maxColour={maxColour}
                    minColour={minColour}
                    midColour={midColour}
                    maxValue={1}
                    minValue={-1}
                    midValue={0}
                    numShades={100}
                    horizontal={true}
                />
            </div>
            {trainingData && network && <NNGraph
                trainingData={trainingData}
                testData={testData}
                density={25}
                canvasWidth={250}
                marginLeft={35}
                marginRight={35}
                marginTop={20}
                marginBottom={40}
                numCells={numCells}
                xDomain={xDomain}
                yDomain={yDomain}
                decisionBoundary={decisionBoundary}
                discreetBoundary={discreetBoundary}
                showTestData={showTestData}
                domain={domain}
            />}
            <div style={{ marginLeft: "10px" }}>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch
                            size={"small"}
                            checked={showTestData}
                            onChange={() => setShowTestData((prevShowTestData) => !prevShowTestData)}
                            name="showTestData"
                        />}
                        label="Show test data"
                    />
                    <FormControlLabel
                        control={<Switch
                            size={"small"}
                            checked={discreetBoundary}
                            onChange={toggleDiscreetBoundary}
                            name="discreetBoundary"
                        />}
                        label="Toggle discreet boundary"
                    />
                </FormGroup>
                <p style={{ marginTop: "20px", marginBottom: "0px" }}> Epochs: <b>{trainingEpoch}</b></p>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <p style={{ marginTop: "20px", marginBottom: "0px" }}>
                        Loss (Training): <b>{trainingLoss.toFixed(3)}</b> <br />
                        Loss (Test): <b>{testLoss.toFixed(3)}</b>
                    </p>
                    <StyledInfoButton title="Loss Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<LossInfoPanel />}>
                        {DefLoss()}
                    </StyledInfoButton>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <LossGraph
                        height={80}
                        width={180}
                        margin={5}
                        analyticsData={analyticsData}
                        comparisonAnalyticsData={comparisonAnalyticsData}
                        showTestData={showTestData}
                    />
                    <div style={{ fontSize: 12 }}>
                        <p style={{ marginTop: "0px" }}>
                            <span style={{ fontSize: 13 }}>Legend:</span><br />
                            <ColouredBox colour={"#606060"} /> Training loss<br />
                            <ColouredBox colour={"blue"} /> Test loss<br />
                            <ColouredBox colour={"red"} /> Saved training loss<br />
                            <ColouredBox colour={"green"} /> Saved test loss<br />
                        </p>
                    </div>
                </div>
            </div>
        </StyledGraphPanel>
    );
}

export default GraphPanel;