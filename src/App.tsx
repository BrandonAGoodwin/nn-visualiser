import styled from '@emotion/styled';
import React from 'react';
import './App.css';
import ComparePage from './components/ComparePage';
import MainPage from './components/MainPage';

const StyledMainPage = styled(MainPage)`
  position: absolute;
  /* left: 50%;
  transform: translate(-50%, 0); */
  /* max-width: min-content; */
  /* margin: auto auto;   */
`

const StyledComparePage = styled(ComparePage)`
  position: absolute;
`

const Container = styled("div")`
  position: absolute;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  margin-top: auto;
  min-height: 100vh;
  /* margin: 0 auto; */
  /* width: 100vw; */
  /* max-width: fit-content; */
  /* min-width: fit-content; */
  /* overflow-x: hidden; */
  /* left: 50%;
  top: 50%; */
  
  tranform: translate(-50%, 0);
`

const AuxContainer = styled("div")`
  position: relative;
  width: 100vw;
  height: 100vh;
`

function App() {
  return (
    <AuxContainer>
      <Container>
        <StyledMainPage
          xDomain={[-8, 8]}
          yDomain={[-8, 8]}
          numCells={100}
        />
        {/* <StyledComparePage/> */}
      </Container>
    </AuxContainer>
  );
}

export default App;
