import styled from "@emotion/styled";
import { createStyles, IconButton, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import React from "react";

interface InfoButtonProps {
    title: string;
    children?: React.ReactElement;
    setInfoPanel?: (panel: JSX.Element) => void;
    infoPanel?: JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        input: {
            display: 'none',
        },
    }),
);

const StyledIconButton = styled(IconButton)`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    width: 20px;
    height: 20px;
    color: #505050;
    padding: 10px;
    
    margin: auto 0px;
    border-radius: 100%;
    &:hover {
        background-color: inherit;
    }
    /* &:active {
        background-color: inherit;
    } */
`

const HtmlTooltip = styled(Tooltip)`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    //background-color: #f5f5f9;
    //color: rgba(0, 0, 0, 0.87);
    //max-width: 220;
    font-size: 12px;
    margin-right: 10px;
    //border: 1px solid #dadde9;
`

function InfoButton(props: InfoButtonProps) {
    //const classes = useStyles();
    return (
        <HtmlTooltip arrow
            title={props.children || props.title}
            onClick={() => props.setInfoPanel && props.infoPanel && props.setInfoPanel(props.infoPanel)}
        >
            <StyledIconButton>
                <Info/>
            </StyledIconButton>
        </HtmlTooltip>
    );
}

export default InfoButton;