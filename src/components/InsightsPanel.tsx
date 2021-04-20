import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { DGConfig } from "../DatasetGenerator";
import { AnalyticsData, NNConfig } from "../NetworkController";
import { DefActivationFunction, DefinedTerm } from "./Definitions";
import ActivationInfoPanel from "./InfoPanels/ActivationInfoPanel";
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
`

interface InsightsPanelProps {
    nnConfig: NNConfig,
    dgConfig: DGConfig,
    analyticsData: AnalyticsData
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
        analyticsData
    } = props;

    const [insight, setInsight] = useState<JSX.Element>();

    const inputsAreLinear = (nnConfig: NNConfig) => {
        console.log(nnConfig.inputs);
        for (let nonLinearInput of nonLinearInputs) {

            console.log(nonLinearInput)
            console.log(nnConfig.inputs[nonLinearInput])
            if (nnConfig.inputs[nonLinearInput]) return false;
        }
        return true;
    }

    const networkIsLinear = (nnConfig: NNConfig) => {
        return (nnConfig.activationFunction === "Linear") && inputsAreLinear(nnConfig);
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
                    <StyledInfoButton title="Output Tooltip" fontSize={"small"} marginLeft={5} >
                        <React.Fragment>
                            <Typography variant="body2">
                                Insights define properties or features of the current network configuration and state.
                            </Typography>
                        </React.Fragment>
                    </StyledInfoButton>
                </div>
                <StyledList>
                    {networkIsLinear(nnConfig) &&
                        <li><LinearNetworkInsight setInsight={setInsightWrapper} /></li>
                    }
                    {configurationIsUnsolveable(nnConfig, dgConfig) &&
                        <li><Unsolveable setInsight={setInsightWrapper} /></li>
                    }
                    { }
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
            </StyledList>
        </>
    );

    return (
        <InsightLink onClick={() => props.setInsight(insight)}>Neural network is linear</InsightLink>
    );
}

function Unsolveable(props: ({ setInsight: (insight: JSX.Element) => void })) {
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

export default InsightsPanel;