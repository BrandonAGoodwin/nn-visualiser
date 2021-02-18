import styled from '@emotion/styled';
import React from 'react';
import './App.css';
import ComparePage from './components/ComparePage';
import MainPage from './components/MainPage';

const StyledMainPage = styled(MainPage)`
  /* position: absolute; */
  /* left: 50%;
  transform: translate(-50%, 0); */
  /* max-width: min-content; */
  /* margin: auto auto;   */
  /* overflow-x: auto; */
`

const StyledComparePage = styled(ComparePage)`
  /* position: absolute; */
`

const StyledMargin = styled("div")`
  max-width: 100%;
`

const Container = styled("div")`
  position: absolute;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  margin-top: auto;
  min-height: 100vh;
  /* margin: 0 auto; */
  width: 100vw;
  max-width: 100vw;
  /* min-width: fit-content; */
  overflow-x: auto;
  /* left: 50%;
  top: 50%; */
  /* float: left; */
  
  /* tranform: translate(-50%, 0); */
`

const AuxContainer = styled("div")`
  position: relative;
  /* width: 100vw; */
  height: 100vh;
  min-width: 100%;
  width: fit-content;
  display: flex;
  overflow-x: hidden;
`

function App() {
  return (
    <AuxContainer>
      <Container>
        {/* <StyledMargin/> */}
        <StyledMainPage
          xDomain={[-8, 8]}
          yDomain={[-8, 8]}
          numCells={100}
        />
        {/* <StyledMargin /> */}
      </Container>
      <Container>
      <StyledComparePage />
      </Container>
    </AuxContainer> 
  );
}

export default App;
