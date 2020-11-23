import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

interface Props {
    children: React.ReactElement;
    open: boolean;
    value: number;
}

const StyledDiv = styled("div")`
    width: 100px;
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
    f: (e: React.ChangeEvent<{}>, value: number | number[]) => void;
}

function LabeledSlider(props: sliderProps) {

    return (
        <StyledDiv>
            <Typography gutterBottom>{props.label}</Typography>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                //aria-label="custom thumb label"
                defaultValue={props.defaultValue}
                step={0.1}
                min={0}
                max={1}
                onChange={props.f}
            />
        </StyledDiv>
    );
}

export default LabeledSlider;