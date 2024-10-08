import styled from "@emotion/styled";
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { InfoPanelContext } from "../contexts/InfoPanelContext";
import { DGConfig } from "../DatasetGenerator";
import { Exercise } from "../Exercises/Exercise";
import { NNConfig } from "../NetworkController";
import { DefActivationFunction, DefBatchSize, DefLearningRate } from "./Definitions";
import FileUploader from "./FileUploader";
import ActivationInfoPanel from "./InfoPanels/ActivationInfoPanel";
import BatchSizeInfoPanel from "./InfoPanels/BatchSizeInfoPanel";
import DatasetInfoPanel from "./InfoPanels/DatasetInfoPanel";
import LearningRateInfoPanel from "./InfoPanels/LearningRateInfoPanel";
import { ContainerSection, StyledInfoButton } from "./MainPage";
import LabeledSlider from "./Slider";

const StyledConfigBar = styled((props: any) => <ContainerSection gridArea="config-bar" {...props} />)`
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding-left: 10px;
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
    handleRegenerateDataset: () => void;
    downloadNetwork: () => void;
    downloadOriginalNetwork: () => void;
    importNetworkConfig: (file: File) => void;
    setBatchSizeExercise: () => void;
    setLearningRateExercise: () => void;
    exercise?: Exercise;
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
        setBatchSize,
        handleRegenerateDataset,
        downloadNetwork,
        downloadOriginalNetwork,
        importNetworkConfig,
        setBatchSizeExercise,
        setLearningRateExercise,
        exercise
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

    const linearActivationFunction = (nnConfig: NNConfig) => {
        return nnConfig.activationFunction === "Linear";
    }

    return (
        <StyledConfigBar>
            <StyledFormControl variant="filled">
                <InputLabel>Activation</InputLabel>
                <StyledSelect
                    value={nnConfig.activationFunction}
                    onChange={handleActivationChange}
                    disabled={exercise?.interfaceConfig.activationFunction === false}
                >
                    <MenuItem value="Tanh">Tanh</MenuItem>
                    <MenuItem value="ReLU">ReLU</MenuItem>
                    <MenuItem value="Sigmoid">Sigmoid</MenuItem>
                    <MenuItem value="Linear">Linear</MenuItem>
                </StyledSelect>
            </StyledFormControl>
            <StyledInfoButton title="Activation Tooltip" marginLeft={3} fontSize={"small"} onClick={setInfoPanelWrapper} infoPanel={<ActivationInfoPanel />}>
                {DefActivationFunction()}
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <StyledFormControl variant="filled">
                <InputLabel>Learning Rate</InputLabel>
                <StyledSelect
                    value={nnConfig.learningRate}
                    onChange={handleLearningRateChange}
                    disabled={exercise?.interfaceConfig.learningRate === false}
                >

                    <MenuItem disabled={linearActivationFunction(nnConfig)} value="10">10</MenuItem>
                    <MenuItem disabled={linearActivationFunction(nnConfig)} value="3">3</MenuItem>
                    <MenuItem disabled={linearActivationFunction(nnConfig)} value="1">1</MenuItem>
                    <MenuItem disabled={linearActivationFunction(nnConfig)} value="0.3">0.3</MenuItem>
                    <MenuItem disabled={linearActivationFunction(nnConfig)} value="0.1">0.1</MenuItem>
                    <MenuItem value="0.03">0.03</MenuItem>
                    <MenuItem value="0.01">0.01</MenuItem>
                    <MenuItem value="0.003">0.003</MenuItem>
                    <MenuItem value="0.001">0.001</MenuItem>
                    <MenuItem value="0.0003">0.0003</MenuItem>
                    <MenuItem value="0.0001">0.0001</MenuItem>
                    <MenuItem value="0.00001">0.00001</MenuItem>
                    <MenuItem value="0.000000001">0.000000001</MenuItem>
                </StyledSelect>
            </StyledFormControl>
            <StyledInfoButton title="Learning Rate Tooltip" marginLeft={3} fontSize={"small"} onClick={setInfoPanelWrapper} infoPanel={<LearningRateInfoPanel handleSetLearningRateExercise={setLearningRateExercise}/>}>
                {DefLearningRate()}
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <StyledFormControl variant="filled">
                <InputLabel>Dataset</InputLabel>
                <StyledSelect
                    value={dgConfig.datasetType}
                    onChange={handleDatasetChange}
                    disabled={exercise?.interfaceConfig.dataset === false}
                >
                    <MenuItem value="Gaussian2">2 Gaussian</MenuItem>
                    <MenuItem value="Gaussian3">3 Gaussian</MenuItem>
                    <MenuItem value="XOR">XOR</MenuItem>
                </StyledSelect>
            </StyledFormControl>
            <StyledInfoButton title="Dataset Tooltip" marginLeft={3} fontSize={"small"} onClick={setInfoPanelWrapper} infoPanel={<DatasetInfoPanel {...nnConfig} />}>
                <React.Fragment>
                    <Typography color="inherit">Datasets</Typography>
                    <Typography variant="body2">Defines the shape of the dataset we want our neural network to solve.</Typography><br />
                    <u>Click the icon to get more information</u>
                </React.Fragment>
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <LabeledSlider
                label="Data Set Size"
                min={10}
                step={10}
                max={500}
                defaultValue={dgConfig.numSamples}
                onChange={handleNumSamplesChange}
                appendValueToLabel={true}
                disabled={exercise?.interfaceConfig.datasetSize === false}
            />
            <StyledInfoButton title="Sample Size Tooltip" fontSize={"small"} marginLeft={3} >
                <React.Fragment>
                    {<Typography color="inherit">Data Set size</Typography>}
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
                disabled={exercise?.interfaceConfig.noise === false}
            />
            <StyledInfoButton title="Noise Tooltip" fontSize={"small"} marginLeft={3} >
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
                max={Math.min(Math.floor(dgConfig.numSamples * 0.8), 100)}
                defaultValue={Math.min(nnConfig.batchSize, Math.floor(dgConfig.numSamples * 0.8))}
                onChange={handleBatchSizeChange}
                appendValueToLabel={true}
                disabled={exercise?.interfaceConfig.batchSize === false}
            />
            <StyledInfoButton title="Batch Size Tooltip" fontSize={"small"} marginLeft={3} onClick={setInfoPanelWrapper} infoPanel={<BatchSizeInfoPanel handleSetBatchExercise={setBatchSizeExercise} />}>
                {DefBatchSize()}
            </StyledInfoButton>
            <Divider orientation="vertical" flexItem />
            <Button
                size={"small"}
                variant={"contained"}
                onClick={handleRegenerateDataset}
                style={{ minWidth: "min-content", maxHeight: "min-content", fontSize: 12, marginTop: "auto", marginBottom: "auto", marginLeft: "10px" }}
                disabled={exercise?.interfaceConfig.datasetRegenerate === false}
            >
                Regenerate Dataset
            </Button>
            <Divider orientation="vertical" flexItem style={{ marginLeft: "10px", marginRight: "10px" }} />
            {/* <Button
                size={"small"}
                variant={"contained"}
                onClick={downloadNetwork}
                style={{ minWidth: "min-content", maxHeight: "min-content", fontSize: 12, marginTop: "auto", marginBottom: "auto", marginLeft: "10px" }}
            >
                Download Network
            </Button> */}
            {/* <div><button onClick={downloadNetwork}>Download Network</button></div> */}
            <FileUploader
                handleDownloadCurrentClick={downloadNetwork}
                handleDownloadOriginalClick={downloadOriginalNetwork}
                handleUploadConfig={importNetworkConfig}
            />


        </StyledConfigBar>
    );
}

export default ConfigBar;