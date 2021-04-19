import DefaultInfoPanel from "./components/InfoPanels/DefaultInfoPanel";

// const defaultInfoPanelData = <DefaultInfoPanel{...config} />;

// export interface InfoPanelData {
//     infoPanel: JSX.Element;
//     infoPanelHistory: JSX.Element[];
//     infoPanelFuture: JSX.Element[];
// }
// export function useInfoPanel(defaultData: ) {
//     const [infoPanel, setInfoPanel] = useState<JSX.Element>(<DefaultInfoPanel{...config}  />);
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