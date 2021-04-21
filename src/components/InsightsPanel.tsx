import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { DGConfig } from "../DatasetGenerator";
import { Exercise } from "../Exercises/Exercise";
import { AnalyticsData, NNConfig } from "../NetworkController";
import { DefActivationFunction, DefinedTerm, DefLearningRate } from "./Definitions";
import ActivationInfoPanel from "./InfoPanels/ActivationInfoPanel";
import LearningRateInfoPanel from "./InfoPanels/LearningRateInfoPanel";
import { ContainerSection, StyledInfoButton } from "./MainPage";


const StyledList = styled("ul")`
    margin-top: 0px;
    margin-bottom: 0px;
    padding-left: 20px;

`

const InsightSection = styled("div")`
    height: 100%;
    font-size: 14;
    & h4 {
        margin-top: 0px;
        margin-left: 10px;
        margin-bottom: 5px;
    }

    & li {
        font-size: 15px;
    }
`

const StyledInsightsPanel = styled((props: any) => <ContainerSection gridArea="insights" {...props} />)`
    display: block;
    padding-left: 10px;
    min-height: 250px;
`

interface InsightsPanelProps {
    nnConfig: NNConfig;
    dgConfig: DGConfig;
    analyticsData: AnalyticsData;
    exercise?: Exercise;
}

const InsightLink = styled("a")`
    text-decoration: underline;
    color: blue;
    cursor: pointer;
`

const nonLinearInputs = ["xSquared", "ySquared", "xTimesY", "sinX", "sinY"];
const linearlySeperableDatasets = ["Gaussian2"];

function InsightsPanel(props: InsightsPanelProps) {
    const {
        nnConfig,
        dgConfig,
        analyticsData,
        exercise
    } = props;

    const [insight, setInsight] = useState<JSX.Element>();

    const inputsAreLinear = (nnConfig: NNConfig) => {
        for (let nonLinearInput of nonLinearInputs) {
            if (nnConfig.inputs[nonLinearInput]) return false;
        }
        return true;
    }

    const networkIsLinear = (nnConfig: NNConfig) => {
        return ((nnConfig.activationFunction === "Linear") || nnConfig.networkShape.length === 2)  && inputsAreLinear(nnConfig);
    }

    const datasetIsLinearlySeperable = (dgConfig: DGConfig) => {
        return linearlySeperableDatasets.includes(dgConfig.datasetType);
    }

    const configurationIsUnsolveable = (nnConfig: NNConfig, dgConfig: DGConfig) => {
        return networkIsLinear(nnConfig) && !datasetIsLinearlySeperable(dgConfig);
    }

    const handleMouseLeave = () => {
        setInsight(undefined);
    }

    const activationFunctionIsLinear = (nnConfig: NNConfig) => {
        return nnConfig.activationFunction === "Linear";
    }

    const setInsightWrapper = (insight: JSX.Element) => {
        return setInsight(insight);
    }

    const smallLearningRate = (nnConfig: NNConfig) => {
        return nnConfig.learningRate <= 0.0005;
    }

    const largeLearningRate = (nnConfig: NNConfig) => {
        return nnConfig.learningRate >= 1;
    }

    const stochasticGradientDecent = (nnConfig: NNConfig) => {
        return nnConfig.batchSize === 1;
    }

    const batchGradientDecent = (nnConfig: NNConfig, dgConfig: DGConfig) => {
        return nnConfig.batchSize === Math.floor(dgConfig.numSamples * 0.8);
    }

    const narrowNetwork = (nnConfig: NNConfig) => {
        let hiddenNodes = 0;
        for (let i = 1; i < nnConfig.networkShape.length - 1; i++) {
            hiddenNodes += nnConfig.networkShape[1];
        }

        let x = hiddenNodes / (nnConfig.networkShape.length - 2);
        if ((nnConfig.networkShape.length - 2 >= 3 && x < 1) || (nnConfig.networkShape.length - 2 >= 4 && x <= 4)) {
            return true;
        } else {
            return false;
        }
    }

    const manyLayers = (nnConfig: NNConfig) => {
        return nnConfig.networkShape.length >= 6;
    }

    return (
        <StyledInsightsPanel onMouseLeave={handleMouseLeave}>
            {insight &&
                <InsightSection>
                    {insight}
                </InsightSection>
            }
            {!insight && <div>
                <div style={{ display: "flex", marginTop: "0px", alignItems: "flex-end", marginLeft: "10px" }}>
                    <h4 style={{ marginBottom: "5px", marginTop: "0px" }}>Insights</h4>
                    <StyledInfoButton title="Insights Tooltip" interactive={false} fontSize={"small"} marginLeft={5}>
                        <React.Fragment>
                            <Typography variant="body2">
                                Insights reveals properties or features of the current network configuration and state.
                            </Typography>
                        </React.Fragment>
                    </StyledInfoButton>
                </div>
                <StyledList>
                    {exercise &&
                        <li>Currently running: {exercise.name}</li>
                    }
                    {networkIsLinear(nnConfig) &&
                        <li><LinearNetworkInsight setInsight={setInsightWrapper} /></li>
                    }
                    {configurationIsUnsolveable(nnConfig, dgConfig) &&
                        <li><UnsolveableInsight setInsight={setInsightWrapper} /></li>
                    }
                    {stochasticGradientDecent(nnConfig) &&
                        <li><StochasticGradientDecentInsight setInsight={setInsightWrapper} /></li>
                    }
                    {batchGradientDecent(nnConfig, dgConfig) &&
                        <li><BatchGradientDecentInsight setInsight={setInsightWrapper} /></li>
                    }
                    {smallLearningRate(nnConfig) &&
                        <li><SmallLearningRateInsight setInsight={setInsightWrapper} /></li>
                    }
                    {largeLearningRate(nnConfig) &&
                        <li><LargeLearningRateInsight setInsight={setInsightWrapper} /></li>
                    }
                    {narrowNetwork(nnConfig) &&
                        <li><NarrowNetworkInsight setInsight={setInsightWrapper} /></li>
                    }
                    {datasetIsLinearlySeperable(dgConfig) &&
                        <li><LinearlySeperableDatasetInsight setInsight={setInsightWrapper} /></li>
                    }
                </StyledList>
            </div>
            }
        </StyledInsightsPanel>
    );
}

function LinearNetworkInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {

    const insight = (
        <>
            <h4>Linear Neural Network</h4>
            <StyledList>
                <li>All inputs are linear (X1 and/or X2)</li>
                <li>Activation function is linear</li>
                <li>Can only solve linearly seperable problems</li>
                <li>Slow training</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Neural network is linear</InsightLink>
    );
}

function UnsolveableInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const insight = (
        <>
            <h4>Unsolveable Scenario</h4>
            <StyledList>
                <li>Neural network is linear and data set is not linearly separable</li>
                <li>To fix this use a non-linear <DefinedTerm definition={DefActivationFunction()} onClick={setInfoPanelWrapper} infoPanel={<ActivationInfoPanel />}>activation function</DefinedTerm> and/or add non-linear inputs</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Data set is unsolveable</InsightLink>
    );
}

function StochasticGradientDecentInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    const insight = (
        <>
            <h4>Stochastic Gradient Decent</h4>
            <StyledList>
                <li>When <b>batch size is 1</b> this is equivalent to stochastic gradient decent</li>
                <li>This means the weights and biases are updated every time back propagation is done with a training sample</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Using stochastic gradient decent</InsightLink>
    );
}

function BatchGradientDecentInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    const insight = (
        <>
            <h4>Batch Gradient Decent</h4>
            <StyledList>
                <li>When <b>batch size is equal to the number of training samples</b> this is equivalent to batch gradient decent</li>
                <li>This means the weights and biases are updated once after back propagation has been done with all training samples</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Using batch gradient decent</InsightLink>
    );
}

function SmallLearningRateInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const insight = (
        <>
            <h4>Small Learning Rate</h4>
            <StyledList>
                <li>The <b>
                    <DefinedTerm definition={DefLearningRate()} onClick={setInfoPanelWrapper} infoPanel={<LearningRateInfoPanel />}>learning rate</DefinedTerm> value is significantly lower
                </b> than what would normally be used for standard gradient decent</li>
                <li>This can lead very slow learning (requiring many epochs of training)</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Very small learning rate value</InsightLink>
    );
}

function LargeLearningRateInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const insight = (
        <>
            <h4>Large Learning Rate</h4>
            <StyledList>
                <li>The <b>
                    <DefinedTerm definition={DefLearningRate()} onClick={setInfoPanelWrapper} infoPanel={<LearningRateInfoPanel />}>learning rate</DefinedTerm> value is significantly larger
                </b> than what would normally be used for standard gradient decent</li>
                <li>This can cause "overshooting" during gradient decent which can cause divergent behaviour</li>
                <li>Loss will tend to fluctuate</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Very large learning rate value</InsightLink>
    );
}

function NarrowNetworkInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    // const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const insight = (
        <>
            <h4>Narrow Network</h4>
            <StyledList>
                <li>This can<b> cause training to slow down significantly</b> as outputs from each layer have less and less inpact on the following layer</li>
                <li>Can be seen by the colour of the boundaries in each layer getting more and more faint</li>
                <li>Increasing layer widths can help this</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Narrow Network</InsightLink>
    );
}
function LinearlySeperableDatasetInsight(props: ({ setInsight: (insight: JSX.Element) => void })) {
    // const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const insight = (
        <>
            <h4>Linearly Seperable Dataset</h4>
            <StyledList>
                <li>Dataset can be separated by a linear (straight line) boundary</li>
                <li>Problem can be solved using basic least mean squares regression</li>
                <li>(Noise in data might have changed this)</li>
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Linearly seperable dataset</InsightLink>
    );
}



export default InsightsPanel;