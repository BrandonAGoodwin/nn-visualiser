import React, { useState, createContext } from "react";
import DefaultInfoPanel from "../components/InfoPanels/DefaultInfoPanel";

// If possble change any
export const InfoPanelContext = createContext<any>({});

interface InfoPanelProps {
    children: React.ReactChild | React.ReactChild[];
}

export const InfoPanelProvider = (props: InfoPanelProps) => {
    const [infoPanelData, setInfoPanelData] = useState<InfoPanelData>(defaultInfoPanelData);
    // const [infoPanel, setInfoPanel] = useState<JSX.Element>(<DefaultInfoPanel />);
    // const [infoPanelHistory, setInfoPanelHistory] = useState<JSX.Element[]>([]);
    // const [infoPanelFuture, setInfoPanelFuture] = useState<JSX.Element[]>([]);

    const setInfoPanelWrapper = (newInfoPanel: JSX.Element) => {
        // console.log(newInfoPanel);
        setInfoPanelData((prevInfoPanelData) => {
            let { infoPanel, infoPanelHistory } = prevInfoPanelData;
            infoPanelHistory.push(infoPanel);
            // console.log(newInfoPanelHistory);
            // console.log(infoPanel)

            // setInfoPanelHistory(newInfoPanelHistory);
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
                // setInfoPanelHistory(newInfoPanelHistory);
                // setInfoPanelFuture(newInfoPanelFuture);
                // if (newPanel) setInfoPanel(newPanel);
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
                // let newInfoPanelHistory = infoPanelHistory;
                // let newInfoPanelFuture = infoPanelFuture;
                newInfoPanel = infoPanelHistory.pop();

                infoPanelFuture.unshift(infoPanel);

                // setInfoPanelHistory(newInfoPanelHistory);
                // setInfoPanelFuture(newInfoPanelFuture);
                // if (newPanel) setInfoPanel(newPanel);
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
// export function useInfoPanel(defaultData: InfoPanelData = defaultInfoPanelData) {
//     const [infoPanel, setInfoPanel] = useState<JSX.Element>(<DefaultInfoPanel />);
//     const [infoPanelHistory, setInfoPanelHistory] = useState<JSX.Element[]>([]);
//     const [infoPanelFuture, setInfoPanelFuture] = useState<JSX.Element[]>([]);


//     const setInfoPanelWrapper = (newInfoPanel: JSX.Element) => {
//         console.log(newInfoPanel);
//         let newInfoPanelHistory = infoPanelHistory;
//         newInfoPanelHistory.push(infoPanel);
//         console.log(newInfoPanelHistory);
//         console.log(infoPanel)
//         setInfoPanel(newInfoPanel);
//         setInfoPanelHistory(newInfoPanelHistory);
//         setInfoPanelFuture([]);
//     }

//     const handleInfoPanelForward = () => {
//         if (infoPanelFuture.length !== 0) {
//             let newInfoPanelHistory = infoPanelHistory;
//             let newInfoPanelFuture = infoPanelFuture;
//             let newPanel = newInfoPanelFuture.shift();

//             newInfoPanelHistory.push(infoPanel);

//             setInfoPanelHistory(newInfoPanelHistory);
//             setInfoPanelFuture(newInfoPanelFuture);
//             if (newPanel) setInfoPanel(newPanel);
//         }
//     }

//     const handleInfoPanelBackward = () => {
//         if (infoPanelHistory.length !== 0) {
//             let newInfoPanelHistory = infoPanelHistory;
//             let newInfoPanelFuture = infoPanelFuture;
//             let newPanel = newInfoPanelHistory.pop();

//             newInfoPanelFuture.unshift(infoPanel);

//             setInfoPanelHistory(newInfoPanelHistory);
//             setInfoPanelFuture(newInfoPanelFuture);
//             if (newPanel) setInfoPanel(newPanel);
//         }
//     }

//     const handleInfoPanelHome = () => {
//         setInfoPanelWrapper(<DefaultInfoPanel{...config} />);
//     }
// }