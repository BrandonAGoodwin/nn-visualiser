import { ThemeContext } from "./contexts/ThemeContext";
import styled from '@emotion/styled';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import React, { createRef, useContext, useEffect, useState } from 'react';
import './App.css';
import ComparePage from './components/ComparePage';
import MainPage from './components/MainPage';
import useEventListener from './components/UseEventListener';
import { css, Global } from "@emotion/react";
import { NetworkState, useNetwork } from "./NetworkController";
import { useDatasetGenerator } from "./DatasetGenerator";


const StyledComparePage = styled(ComparePage)`
`

const StyledMargin = styled("div")`
    //min-width: 130px;
    //max-width: 100%;
`

const Container = styled("div")`
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box; 
        position: absolute;
        display: flex;
        /* justify-content: center; */
        margin-top: auto;
        min-height: 100vh;
        width: calc(100vw - (100vw - 100%));
        /* max-width: 100vw; */
        overflow-x: auto;
    

    &.main {
        margin-right: max(60px,);
        left: 0%;
        transition: all 0.7s ease-in-out;
        &.active {
        left: -100%;
        }
    }

    &.compare {
        left: 100%;
        transition: all 0.7s ease-in-out;
        &.active {
        left: 0%;
        }
    }
`


const AuxContainer = styled("div")`
    position: relative;
    min-width: 100vw;
    height: 100vh;
    /* min-width: 100%; */
    width: auto;
    display: flex;
    overflow-x: hidden;
    left: 0%;
`

const TransitionButton = styled(IconButton)`
    position: absolute;
    background: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 95%;
    z-index: 500;
    transition: all ${(props: { transitioning: boolean }) => props.transitioning ? "0.7s" : "0s"} ease-in-out;
    &.active {
        left: 5%;
    }
`

interface ComparisonData {
    currentState: NetworkState;
    savedState: NetworkState | undefined;
}

function App() {
    const { background } = useContext(ThemeContext);
    const networkContoller = useNetwork();
    const { dgConfig } = useDatasetGenerator();
    const mainContainer = createRef<HTMLDivElement>();

    const [pageState, setPageState] = useState<string>("main");
    const [marginAdded, setMarginAdded] = useState<boolean>(false);
    const [marginWidth, setMarginWidth] = useState<number>(0);
    const [transitioning, setTransitioning] = useState<boolean>(false);

    const [comparisonData, setComparisonData] = useState<ComparisonData>();

    const updateComparisionData = (currentState: NetworkState, savedState: NetworkState | undefined) => {
        setComparisonData({ currentState: currentState, savedState: savedState });
    }

    useEffect(() => {
        if (transitioning) {
            updateButtonPosition();
        }
    }, [transitioning])

    useEffect(() => {
        setTimeout(function () {
            // console.log(pageState);
            setTransitioning(false);
            updateContainerSize();
            // updateButtonPosition();
        }, 700);
    }, [pageState]);

    useEffect(() => {
        updateButtonPosition();
    }, [marginAdded]);

    const handleTransitionButton = () => {
        setPageState(pageState === "main" ? "compare" : "main");
        setTransitioning(true);
        let containers = document.querySelectorAll(".animated");
        containers.forEach((container: Element) => container.classList.toggle("active"));
    }

    const updateContainerSize = () => {
        const maxMarginSize = 140;
        if (pageState === "main") {

            let container = document.getElementById("main-container");
            let mainPage = document.getElementById("main-page");
            let margin = document.getElementById("dynamic-margin-main");

            if (!container || !mainPage || !margin) return;

            if ((container.offsetWidth - marginWidth) < (mainPage.offsetWidth + maxMarginSize)) {
                let newMarginWidth = Math.min((mainPage.offsetWidth + maxMarginSize) - container.offsetWidth, maxMarginSize);
                margin.style.minWidth = `${newMarginWidth}px`;
                setMarginAdded(true);
                setMarginWidth(newMarginWidth);
            } else {
                margin.style.minWidth = "0px";
                setMarginAdded(false);
                setMarginWidth(0);
            }
        }

        if (pageState === "compare") {

            let container = document.getElementById("compare-container");
            let comparePage = document.getElementById("compare-page");
            let margin = document.getElementById("dynamic-margin-compare");

            if (!container || !comparePage || !margin) return;

            if ((container.offsetWidth - marginWidth) < (comparePage.offsetWidth + maxMarginSize)) {
                let newMarginWidth = Math.min((comparePage.offsetWidth + maxMarginSize) - container.offsetWidth, maxMarginSize);
                margin.style.minWidth = `${newMarginWidth}px`;
                setMarginAdded(true);
                setMarginWidth(newMarginWidth);
            } else {
                margin.style.minWidth = "0px";
                setMarginAdded(false);
                setMarginWidth(0);
            }
        }
    }

    const updateButtonPosition = () => {
        let button = document.getElementById("transition-button");

        if (!button) return;

        if (transitioning) {
            button.style.left = pageState === "compare" ? "5%" : "95%";
            return;
        }
        if (marginAdded) {
            if (pageState === "main") {

                let container = document.getElementById("main-container");
                let mainPage = document.getElementById("main-page");

                if (!container || !mainPage) return;

                let containerRect = container.getBoundingClientRect();
                let pageRect = mainPage.getBoundingClientRect();

                if ((pageRect.right + 70) >= containerRect.width) {
                    button.style.left = `${pageRect.right + 20}px`;
                } else {
                    button.style.left = `min(95%, calc(${pageRect.x + pageRect.width}px + 2%))`;
                }
            }

            if (pageState === "compare") {

                let container = document.getElementById("compare-container");
                let comparePage = document.getElementById("compare-page");

                if (!container || !comparePage) return;

                let containerRect = container.getBoundingClientRect();
                let pageRect = comparePage.getBoundingClientRect();

                if ((pageRect.left - 60) <= containerRect.width) {
                    button.style.right = "100%";
                } else {
                    button.style.left = `min(95%, calc(${pageRect.x + pageRect.width}px + 2%))`;
                }
            }
        } else {
            button.style.left = pageState === "main" ? "95%" : "5%";
        }
    }

    useEventListener("resize", () => {
        updateContainerSize();
        updateButtonPosition();
    });

    useEventListener("scroll", updateButtonPosition, mainContainer);

    return (
        <AuxContainer>
            <Global
                styles={css`
            body {
              background: ${background}
            }`} />
            <Container id="main-container" className="animated main" ref={mainContainer}>
                <MainPage
                    xDomain={[-8, 8]}
                    yDomain={[-8, 8]}
                    numCells={100}
                    updateComparisionData={updateComparisionData}
                    networkController={networkContoller}
                    dgConfig={dgConfig}
                />
                <StyledMargin id="dynamic-margin-main" />
            </Container>
            <TransitionButton transitioning={transitioning} id="transition-button" className="animated" onClick={handleTransitionButton}>
                {pageState === "main" && <ArrowForwardIos />}
                {pageState === "compare" && <ArrowBackIos />}
            </TransitionButton>
            <Container id="compare-container" className="animated compare">
                <StyledMargin id="dynamic-margin-compare" />
                <StyledComparePage currentState={comparisonData?.currentState} savedState={comparisonData?.savedState} />
            </Container>
        </AuxContainer>
    );
}

export default App;
