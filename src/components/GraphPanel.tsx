import styled from "@emotion/styled";
import { FormControlLabel, FormGroup, IconButton, Switch, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Datapoint2D } from "../datasets";
import ColourScale from "./ColourScale";
import { DefinedTerm, DefX1, DefX2 } from "./Definitions";
import LossInfoPanel from "./InfoPanels/LossInfoPanel";
import LossGraph from "./LossGraph";
import { ContainerSection, StyledInfoButton } from "./MainPage";
import NNGraph from "./NNGraph";
import * as nn from "../NeuralNet"
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { AnalyticsData, NetworkState } from "../NetworkController";
import OutputInfoPanel from "./InfoPanels/LossInfoPanel";

const ColouredBox = styled("div")`
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
    // epochs: number;
    // loss: number;
    // lossData: [number, number][];
    analyticsData: AnalyticsData;
    comparisonAnalyticsData: AnalyticsData | undefined;
    comparisonData: NetworkState | undefined;
}

function GraphPanel(props: GraphPanelProps) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const { maxColour, minColour, midColour, minColourName, maxColourName } = useContext(ThemeContext);
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
        // epochs,
        // loss,
        // lossData,
        comparisonData,
        analyticsData,
        comparisonAnalyticsData,
    } = props;

    let [showTestData, setShowTestData] = useState(false);

    let [epoch, loss]: [number, number] = [0, 0];
    if (analyticsData.testLossData.length > 0) {
        [epoch, loss] = analyticsData.trainingLossData[analyticsData.trainingLossData.length - 1];
    }

    return (
        <StyledGraphPanel>
            <div style={{ display: "flex", marginLeft: "25px" }}>
                <Typography variant="h6">Output</Typography>
                <StyledInfoButton title="Output Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<OutputInfoPanel />}>
                    <React.Fragment>
                        <Typography color="inherit">Output</Typography>
                        <Typography variant="body2">This graph shows the final output of the neural network in the domain (-8, +8) for both the <DefinedTerm definition={DefX1()}>X<sub>1</sub></DefinedTerm> and <DefinedTerm definition={DefX2()}>X<sub>2</sub></DefinedTerm> features.<br /> The samples in the data sets used only have 2 classes (-1 and +1); the neural network defines a decision boundary so that points that are in<br /> {minColourName} <ColouredBox colour={minColour} /> sections of the graph are classified as class -1 and points that are in <br /> {maxColourName} <ColouredBox colour={maxColour} /> sections of the graph are classified as class +1.</Typography><br />
                    </React.Fragment>
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
                dataset={trainingData}
                density={25}
                canvasWidth={250}
                marginLeft={35}
                marginRight={20}
                marginTop={20}
                marginBottom={40}
                numCells={numCells}
                xDomain={xDomain}
                yDomain={yDomain}
                decisionBoundary={decisionBoundary}
                discreetBoundary={discreetBoundary}
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
                <p style={{ marginTop: "0px", marginBottom: "0px" }}> Epochs: {analyticsData.epochs} & {epoch}</p>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <p style={{ marginTop: "0px", marginBottom: "0px" }}> Loss: {loss.toFixed(3)} </p>
                    <StyledInfoButton title="Loss Tooltip" marginLeft={5} fontSize="small" onClick={setInfoPanelWrapper} infoPanel={<LossInfoPanel />}>
                        <React.Fragment>
                            <Typography color="inherit">Loss</Typography>
                            <Typography variant="body2">This is loss calculated using the <a href="https://www.google.com/search?q=sum+squared+residuals" target="_blank">sum of squared residulals</a> between the output of our neural network and the expected output from out training set.</Typography><br />
                            <u>Click the icon to get more information</u>
                        </React.Fragment>
                    </StyledInfoButton>
                </div>
                <LossGraph
                    height={60}
                    width={170}
                    margin={5}
                    analyticsData={analyticsData}
                    comparisonAnalyticsData={comparisonAnalyticsData}
                    showTestData={showTestData}
                // dataset={lossData}
                // comparisionData={comparisonData?.lossData} 
                />
            </div>
        </StyledGraphPanel>
    );
}

export default GraphPanel;