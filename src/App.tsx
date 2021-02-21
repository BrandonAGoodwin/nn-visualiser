import styled from '@emotion/styled';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { ResizeSensor } from 'css-element-queries';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { isConstructorDeclaration } from 'typescript';
import './App.css';
import ComparePage from './components/ComparePage';
import MainPage from './components/MainPage';
import useEventListener from './components/UseEventListener';

const StyledMainPage = styled(MainPage)`

`

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

// const MainContainer = styled(Container)`

// `

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
    transition: all ${(props: {transitioning: boolean}) => props.transitioning ? "0.7s" : "0s"} ease-in-out;
    &.active {
        left: 5%;
    }
`

function App() {

    const mainContainer = createRef<HTMLDivElement>();

    const [pageState, setPageState] = useState<string>("main");
    const [marginAdded, setMarginAdded] = useState<boolean>(false);
    const [marginWidth, setMarginWidth] = useState<number>(0);
    const [transitioning, setTransitioning] = useState<boolean>(false);

    // useEffect(() => {
    //     let mainPage = document.getElementById("main-page");

    //     let resizeSensor: ResizeSensor;
    //     if (mainPage) {
    //         resizeSensor = new ResizeSensor(mainPage, () => {
    //             updateContainerSize();
    //             updateButtonPosition();
    //         })
    //     }

    //     let container = document.getElementById("main-container");


    //     window.addEventListener("resize", () => {
    //         updateContainerSize();
    //         updateButtonPosition();
    //     });
    //     if (container) container.addEventListener("scroll", updateButtonPosition);
    //     return () => {
    //         resizeSensor.detach();

    //         window.removeEventListener("resize",  () => {
    //             updateContainerSize();
    //             updateButtonPosition();
    //         });
    //         if (container) container.removeEventListener("scroll", updateButtonPosition);
    //     }
    // }, []);

    // useEffect(() => {
    //     let container = document.getElementById("main-container");

    //     let mainPage = document.getElementById("main-page");

    //     window.removeEventListener("resize",  () => {
    //         updateContainerSize();
    //         updateButtonPosition();
    //     });
    //     if (container) container.removeEventListener("scroll", updateButtonPosition);

    //     // let resizeSensor: ResizeSensor;
    //     // if (mainPage) {
    //     //     resizeSensor = new ResizeSensor(mainPage, () => {
    //     //         updateContainerSize();
    //     //         updateButtonPosition();
    //     //     })
    //     // }

    //     window.addEventListener("resize",  () => {
    //         updateContainerSize();
    //         updateButtonPosition();
    //     });
    //     if (container) container.addEventListener("scroll", updateButtonPosition);
    //     return () => {
    //         // resizeSensor.detach();

    //         window.removeEventListener("resize",  () => {
    //             updateContainerSize();
    //             updateButtonPosition();
    //         });
    //         if (container) container.removeEventListener("scroll", updateButtonPosition);
    //     }
    // }, [pageState, marginAdded]);


    // useEffect(() => {
    //     // let mainPage = document.getElementById("main-page");
    //     updateButtonPosition();
    //     updateContainerSize();


    // }, []);

    // useEffect(() => {
    //   let containers = document.querySelectorAll(".animated");
    //   containers.forEach((container: Element) => container.classList.toggle("active"));
    // }, [pageState]);

    useEffect(() => {
        if(transitioning) {
            updateButtonPosition();
        }
    }, [transitioning])

    useEffect(() => {
        setTimeout(function() {
            console.log(pageState);
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
        // setTimeout(function() {
        //     console.log(pageState);
        //     setTransitioning(false);
        //     updateContainerSize();
        //     updateButtonPosition();
        // }, 401);
    }

    const updateContainerSize = () => {
        console.log("Updating container size");

        const maxMarginSize = 140;
        if (pageState === "main") {

            let container = document.getElementById("main-container");
            let mainPage = document.getElementById("main-page");
            let margin = document.getElementById("dynamic-margin-main");

            if (!container || !mainPage || !margin) return;

            // let containerRect = container.getBoundingClientRect();
            // let pageRect = mainPage.getBoundingClientRect();
            // let marginRect = margin.getBoundingClientRect();

            console.log("Conatainer width: " + container.offsetWidth);
            console.log("Page width: " + mainPage.offsetWidth);

            console.log("Margin width: " + marginWidth);

            if ((container.offsetWidth - marginWidth) < (mainPage.offsetWidth + maxMarginSize * 2)) {
                let newMarginWidth = Math.min((mainPage.offsetWidth + maxMarginSize) - container.offsetWidth, maxMarginSize);
                margin.style.minWidth = `${newMarginWidth}px`;
                setMarginAdded(true);
                setMarginWidth(newMarginWidth);
                console.log("Margin added");
            } else {
                margin.style.minWidth = "0px";
                setMarginAdded(false);
                setMarginWidth(0);
                console.log("Margin removed");
            }
        }

        if (pageState === "compare") {

            let container = document.getElementById("compare-container");
            let comparePage = document.getElementById("compare-page");
            let margin = document.getElementById("dynamic-margin-compare");

            if (!container || !comparePage || !margin) return;

            console.log("Conatainer width: " + container.offsetWidth);
            console.log("Page width: " + comparePage.offsetWidth);

            console.log("Margin width: " + marginWidth);

            if ((container.offsetWidth - marginWidth) < (comparePage.offsetWidth + maxMarginSize * 2)) {
                let newMarginWidth = Math.min((comparePage.offsetWidth + maxMarginSize) - container.offsetWidth, maxMarginSize);
                margin.style.minWidth = `${newMarginWidth}px`;
                setMarginAdded(true);
                setMarginWidth(newMarginWidth);
                console.log("Margin added");
            } else {
                margin.style.minWidth = "0px";
                setMarginAdded(false);
                setMarginWidth(0);
                console.log("Margin removed");
            }

        }
    }

    // Maybe convert to refs for better design. (Note: can't ref mainPage)
    const updateButtonPosition = () => {
        console.log("Updating button position");

        let button = document.getElementById("transition-button");

        if(!button) return;


        console.log("Margin added: " + marginAdded);
        console.log("Transitioning: " + transitioning);
        console.log("Pagestate: " + pageState);

        if(transitioning) {
            button.style.left = pageState === "compare" ? "5%" : "95%";
            return;
        }
        if (marginAdded) {
            // setTransitioning(false);
            if (pageState === "main") {

                let container = document.getElementById("main-container");
                let mainPage = document.getElementById("main-page");

                if (!container || !mainPage) return;

                let containerRect = container.getBoundingClientRect();
                let pageRect = mainPage.getBoundingClientRect();

                if ((pageRect.right + 70) >= containerRect.width) {
                    // button.style.left = "100%";
                    button.style.left = `${pageRect.right + 20}px`;
                } else {
                    button.style.left = `min(95%, calc(${pageRect.x + pageRect.width}px + 2%))`;
                    console.log("here");

                }
                console.log(pageRect);
                console.log(containerRect);
            }

            if (pageState === "compare") {

                let container = document.getElementById("compare-container");
                let comparePage = document.getElementById("compare-page");

                if (!container || !comparePage) return;

                let containerRect = container.getBoundingClientRect();
                let pageRect = comparePage.getBoundingClientRect();

                if ((pageRect.left - 60) <= containerRect.width) {
                    // button.style.left = "100%";
                    button.style.right = "100%";
                } else {
                    button.style.left = `min(95%, calc(${pageRect.x + pageRect.width}px + 2%))`;
                    console.log("here");

                }
                console.log(pageRect);
                console.log(containerRect);
            }
        } else {
            console.log("heer");
            button.style.left = pageState === "main" ? "95%" : "5%";
        }
    }

    useEventListener("resize", () => {
        updateContainerSize();
        updateButtonPosition();
    });
    
    useEventListener("scroll",  updateButtonPosition, mainContainer);

    return (
        <AuxContainer>
            <Container id="main-container" className="animated main" ref={mainContainer}>
                {/* <StyledMargin/> */}
                <StyledMainPage
                    xDomain={[-8, 8]}
                    yDomain={[-8, 8]}
                    numCells={100}
                />
                <StyledMargin id="dynamic-margin-main" />
            </Container>
            <TransitionButton transitioning={transitioning} id="transition-button" className="animated" onClick={handleTransitionButton}>
                {pageState === "main" && <ArrowForwardIos />}
                {pageState === "compare" && <ArrowBackIos />}
            </TransitionButton>
            <Container id="compare-container" className="animated compare">
                <StyledMargin id="dynamic-margin-compare" />
                <StyledComparePage />
            </Container>
        </AuxContainer>
    );
}

export default App;
