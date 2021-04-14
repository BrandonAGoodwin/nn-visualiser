import styled from "@emotion/styled";
import { Divider, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { DGConfig } from "../DatasetGenerator";
import { NNConfig } from "../NetworkController";
import ActivationInfoPanel from "./InfoPanels/ActivationInfoPanel";
import DatasetInfoPanel from "./InfoPanels/DatasetInfoPanel";
import LearningRateInfoPanel from "./InfoPanels/LearningRateInfoPanel";
import { ContainerSection, StyledInfoButton } from "./MainPage";
import LabeledSlider from "./Slider";

const StyledConfigBar = styled((props: any) => <ContainerSection gridArea="config-bar" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding-left: 30px;
    padding-top: 10px;
`;

const StyledFormControl = styled(FormControl)`
    margin-left: 10px;
    min-width: 130px;
    background-color: inherit;
`;

const StyledSelect = styled(Select)`
    background-color: inherit;
`;

interface ConfigBarProps {
    nnConfig: NNConfig;
    dgConfig: DGConfig;
    setActivationFunction: (activationFunction: string) => void;
    setLearningRate: (learningRate: number) => void;
    setDatasetType: (datasetType: string) => void;
    setNoise: (noise: number) => void;
    setNumSamples: (numSamples: number) => void;
    setBatchSize: (batchSize: number) => void;
}

function ConfigBar(props: ConfigBarProps) {
    const { setInfoPanelWrapper } = useContext(InfoPanelContext);
    const {
        nnConfig,
        dgConfig,
        setActivationFunction,
        setLearningRate,
        setDatasetType,
        setNoise,
        setNumSamples,
        setBatchSize
    } = props;

    const handleActivationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setActivationFunction(e.target.value as string);
    };

    const handleLearningRateChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setLearningRate(e.target.value as number);
    };

    const handleDatasetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setDatasetType(e.target.value as string);
    };

    const handleNoiseChange = (e: any, newValue: number | number[]) => {
        setNoise(newValue as number);
    };

    const handleNumSamplesChange = (e: any, newValue: number | number[]) => {
        setNumSamples(newValue as number);
    }

    const handleBatchSizeChange = (e: any, newValue: number | number[]) => {
        setBatchSize(newValue as number);
    }

    return (
        <StyledConfigBar>
            <StyledFormControl variant="filled">
                <InputLabel>Activation</InputLabel>
                <StyledSelect
                    value={nnConfig.activationFunction}
                    onChange={handleActivationChange}
                >
                    <MenuItem value="Tanh">Tanh</MenuItem>
                    <MenuItem value="ReLU">ReLU</MenuItem>
                    <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                </StyledSelect>
            </StyledFormControl>
            <StyledInfoButton title="Activation Tooltip" onClick={setInfoPanelWrapper} infoPanel={<ActivationInfoPanel config={nnConfig} setInfoPanel={setInfoPanelWrapper} />}>
                <React.Fragment>
                    <Typography color="inherit">Activation Function (&Phi;)</Typography>
                    <Typography variant="body2">The activation defines the output of a neuron (node).</Typography><br />
                    <u>Click the icon to get more information</u>
                </React.Fragment>
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <StyledFormControl variant="filled">
                <InputLabel>Learning Rate</InputLabel>
                <StyledSelect
                    value={nnConfig.learningRate}
                    onChange={handleLearningRateChange}
                >
                    <MenuItem value="0.03">0.03</MenuItem>
                    <MenuItem value="0.005">0.005</MenuItem>
                </StyledSelect>
            </StyledFormControl>
            <StyledInfoButton title="Learning Rate Tooltip" onClick={setInfoPanelWrapper} infoPanel={<LearningRateInfoPanel {...nnConfig} />}>
                <React.Fragment>
                    <Typography color="inherit">Learning Rate (&epsilon;)</Typography>
                    <Typography variant="body2">This affects the rate at which the weights and biases change when training the neural network.</Typography><br />
                    <u>Click the icon to get more information</u>
                </React.Fragment>
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <StyledFormControl variant="filled">
                <InputLabel>Dataset</InputLabel>
                <StyledSelect
                    value={dgConfig.datasetType}
                    onChange={handleDatasetChange}
                >
                    <MenuItem value="Gaussian2">2 Gaussian</MenuItem>
                    <MenuItem value="Gaussian3">3 Gaussian</MenuItem>
                    <MenuItem value="XOR">XOR</MenuItem>
                </StyledSelect>
            </StyledFormControl>
            <StyledInfoButton title="Dataset Tooltip" onClick={setInfoPanelWrapper} infoPanel={<DatasetInfoPanel {...nnConfig} />}>
                <React.Fragment>
                    <Typography color="inherit">Datasets</Typography>
                    <Typography variant="body2">Defines the shape of the dataset we want our neural network to solve.</Typography><br />
                    <u>Click the icon to get more information</u>
                </React.Fragment>
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <LabeledSlider
                label="Dataset Size"
                min={10}
                step={10}
                max={500}
                defaultValue={dgConfig.numSamples}
                onChange={handleNumSamplesChange}
                appendValueToLabel={true}
            />
            <StyledInfoButton title="Sample Size Tooltip">
                <React.Fragment>
                    {<Typography color="inherit">Noise</Typography>}
                    <Typography variant="body2">Changes the number of samples in the dataset. <br />(Training is done using 80% of the samples and the remaining 20% are used as the test dataset. </Typography>
                </React.Fragment>
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <LabeledSlider
                label="Noise"
                min={0}
                step={0.1}
                max={1}
                defaultValue={dgConfig.noise}
                onChange={handleNoiseChange}
                appendValueToLabel={true}
            />
            <StyledInfoButton title="Noise Tooltip">
                <React.Fragment>
                    <Typography color="inherit">Noise</Typography>
                    <Typography variant="body2">This sets the noise in the generated data set. The more noise the greater the variance in the generated data.</Typography>
                </React.Fragment>
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <LabeledSlider
                label={"Batch Size"}
                min={1}
                step={1}
                max={10}
                defaultValue={nnConfig.batchSize}
                onChange={handleBatchSizeChange}
                appendValueToLabel={true}
            />
            <StyledInfoButton title="Batch Size Tooltip">
                <React.Fragment>
                    <Typography color="inherit">Batch Size</Typography>
                    {/* Could create an info panel for Stochastic Gradient Decent*/}
                    <Typography variant="body2">Specifies the number of training samples used in each epoch of <a href="https://www.google.com/search?q=mini+batch+gradient+descent" target="_blank">Mini-Batch Gradient Decent</a>.<br />(When batch size = 1, this is equivalent to <a href="https://www.google.com/search?q=stochastic+gradient+descent" target="_blank">Stochastic Gradient Decent</a>) </Typography>
                </React.Fragment>
            </StyledInfoButton>
        </StyledConfigBar>
    );
}

export default ConfigBar;