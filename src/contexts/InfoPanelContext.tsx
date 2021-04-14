import React, { useState, createContext } from "react";
import DefaultInfoPanel from "../components/InfoPanels/DefaultInfoPanel";

// If possble change any
export const InfoPanelContext = createContext<any>({});

const defaultInfoPanelData = {
    infoPanel: <DefaultInfoPanel />,
    infoPanelHistory: [],
    infoPanelFuture: []
};

export interface InfoPanelData {
    infoPanel: JSX.Element;
    infoPanelHistory: JSX.Element[];
    infoPanelFuture: JSX.Element[];
}

interface InfoPanelProps {
    children: React.ReactChild | React.ReactChild[];
}

export const InfoPanelProvider = (props: InfoPanelProps) => {
    const [infoPanelData, setInfoPanelData] = useState<InfoPanelData>(defaultInfoPanelData);


    const setInfoPanelWrapper = (newInfoPanel: JSX.Element) => {
        setInfoPanelData((prevInfoPanelData) => {
            let { infoPanel, infoPanelHistory } = prevInfoPanelData;
            infoPanelHistory.push(infoPanel);

            return { infoPanel: newInfoPanel, infoPanelHistory: infoPanelHistory, infoPanelFuture: [] };
        })
    }

    const handleInfoPanelForward = () => {
        setInfoPanelData((prevInfoPanelData) => {
            let { infoPanel, infoPanelHistory, infoPanelFuture } = prevInfoPanelData;
            let newInfoPanel: JSX.Element | undefined;
            if (infoPanelFuture.length !== 0) {
                newInfoPanel = infoPanelFuture.shift();
                infoPanelHistory.push(infoPanel);
            }
            if (newInfoPanel) {
                return { infoPanel: newInfoPanel, infoPanelHistory: infoPanelHistory, infoPanelFuture: infoPanelFuture };
            } else {
                return prevInfoPanelData;
            }
        })
    }

    const handleInfoPanelBackward = () => {
        setInfoPanelData((prevInfoPanelData) => {
            let { infoPanel, infoPanelHistory, infoPanelFuture } = prevInfoPanelData;
            let newInfoPanel: JSX.Element | undefined;
            if (infoPanelHistory.length !== 0) {
                newInfoPanel = infoPanelHistory.pop();
                infoPanelFuture.unshift(infoPanel);
            }
            if (newInfoPanel) {
                return { infoPanel: newInfoPanel, infoPanelHistory: infoPanelHistory, infoPanelFuture: infoPanelFuture };
            } else {
                return prevInfoPanelData;
            }
        })
    }

    const handleInfoPanelHome = () => {
        setInfoPanelWrapper(<DefaultInfoPanel />);
    }

    return (
        <InfoPanelContext.Provider value={{
            infoPanelData,
            setInfoPanelWrapper,
            handleInfoPanelForward,
            handleInfoPanelBackward,
            handleInfoPanelHome
        }}
        >
            {props.children}
        </InfoPanelContext.Provider>
    );
}



