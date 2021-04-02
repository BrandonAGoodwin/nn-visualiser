import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import React, { useState } from "react";

interface Props {
    children: React.ReactElement;
    open: boolean;
    value: number;
}

const StyledDiv = styled("div")`
    width: 110px;
    padding-left: 10px;
    padding-right: 10px;
`

function ValueLabelComponent(props: Props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}


interface sliderProps {
    label?: string;
    defaultValue: number;
    onChange: (e: React.ChangeEvent<{}>, value: number | number[]) => void;
    valueLabelDisplay?: "on" | "off" | "auto" | undefined;
    step: number;
    min: number;
    max: number;
    appendValueToLabel: boolean;
}

function LabeledSlider(props: sliderProps) {
    const [currentValue, setCurrentValue] = useState<number>(props.defaultValue);


    const handleOnChange = (e: any, newValue: number | number[]) => {
        setCurrentValue(newValue as number);
    }
    return (
        <StyledDiv>
            <Typography gutterBottom>{props.label + ": " + currentValue}</Typography>
            <Slider
                // ValueLabelComponent={ValueLabelComponent}
                //aria-label="custom thumb label"
                defaultValue={props.defaultValue}
                step={props.step}
                min={props.min}
                max={props.max}
                onChange={handleOnChange}
                onChangeCommitted={props.onChange}
                // valueLabelDisplay={props.valueLabelDisplay || "auto"}
            />
        </StyledDiv>
    );
}

export default LabeledSlider;