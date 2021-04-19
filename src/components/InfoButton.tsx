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
interface TooltipProps {
    marginLeft: number;
    marginRight: number;
    marginTop: number | string;
    marginBottom: number | string;
}

const HtmlTooltip = styled(Tooltip)`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 

    ${(props: TooltipProps) => `
        margin-right: ${props.marginRight}px;
        margin-left: ${props.marginLeft}px;
        margin-top: ${props.marginTop}px;
        margin-bottom: ${props.marginBottom}px;
    `}
    margin-right: ${(props: TooltipProps) => `${props.marginRight}px`};
    margin-left: ${(props: TooltipProps) => `${props.marginLeft}px`};

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
    marginTop?: number | string;
    marginBottom?: number | string;
}

const InfoButton: React.FC<InfoButtonProps> = ({
    marginLeft = 10,
    marginRight = 10,
    marginTop = "auto",
    marginBottom = "auto",
    ...props
}) => {

    return (
        <HtmlTooltip interactive arrow
            title={props.children || props.title}
            onClick={() => props.onClick && props.infoPanel && props.onClick(props.infoPanel)}
            marginLeft={marginLeft}
            marginRight={marginRight}
            marginTop={marginTop}
            marginBottom={marginBottom}
        >
            <StyledIconButton
                style={{
                    marginTop: marginTop,
                    marginBottom: marginBottom
                }}
            >
                {props.icon || <Info fontSize={props.fontSize} />}
            </StyledIconButton>
        </HtmlTooltip>
    );
}

export default InfoButton;