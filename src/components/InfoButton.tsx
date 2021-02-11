import styled from "@emotion/styled";
import { IconButton, Tooltip } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import React from "react";

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

`

const HtmlTooltip = styled(Tooltip)`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 

    margin-right: ${(props: { marginLeft: number, marginRight: number }) => `${props.marginRight}px`};
    margin-left: ${(props: { marginLeft: number, marginRight: number }) => `${props.marginLeft}px`};

`

interface InfoButtonProps {
    title: string;
    children?: React.ReactElement;
    onClick?: (panel: JSX.Element) => void;
    infoPanel?: JSX.Element;
    icon?: React.ReactElement;
    fontSize?: "small" | "inherit" | "default" | "large" | undefined;
    marginLeft?: number;
    marginRight?: number;
}

const InfoButton: React.FC<InfoButtonProps> = ({
    marginLeft = 10,
    marginRight = 10,
    ...props
}) => {

    return (
        <HtmlTooltip interactive arrow
            title={props.children || props.title}
            onClick={() => props.onClick && props.infoPanel && props.onClick(props.infoPanel)}
            marginLeft={marginLeft}
            marginRight={marginRight}
        >
            <StyledIconButton>
                {props.icon || <Info fontSize={props.fontSize} />}
            </StyledIconButton>
        </HtmlTooltip>
    );
}

export default InfoButton;