import styled from '@emotion/styled';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import './App.css';
import ComparePage from './components/ComparePage';
import MainPage from './components/MainPage';

const StyledMainPage = styled(MainPage)`

`

const StyledComparePage = styled(ComparePage)`
`

const StyledMargin = styled("div")`
  max-width: 100%;
`

const Container = styled("div")`
    position: absolute;
    display: flex;
    /* justify-content: center; */
    margin-top: auto;
    min-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    overflow-x: auto;
  

  &.main-page {
    left: 0%;
    transition: all 0.7s ease-in-out;
    &.active {
      left: -100%;
    }
  }

  &.compare-page {
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
  transition: all 0.7s ease-in-out;
  &.active {
    left: 5%;
  }
`

function App() {
  const [pageState, setPageState] = useState<string>("main");

  // useEffect(() => {
  //   let containers = document.querySelectorAll(".animated");
  //   containers.forEach((container: Element) => container.classList.toggle("active"));
  // }, [pageState]);

  const handleTransitionButton = () => {
    setPageState(pageState === "main" ? "compare" : "main");
    let containers = document.querySelectorAll(".animated");
    containers.forEach((container: Element) => container.classList.toggle("active"));
  }

  return (
    <AuxContainer>
      <Container id="main-container" className="animated main-page">
        {/* <StyledMargin/> */}
        <StyledMainPage
          xDomain={[-8, 8]}
          yDomain={[-8, 8]}
          numCells={100}
        />
        {/* <StyledMargin /> */}
      </Container>
      <TransitionButton className="animated" onClick={handleTransitionButton}>
        {pageState === "main" && <ArrowForwardIos/> }
        {pageState === "compare" && <ArrowBackIos/>}
      </TransitionButton>
      <Container className="animated compare-page">
      <StyledComparePage />
      </Container>
    </AuxContainer> 
  );
}

export default App;
