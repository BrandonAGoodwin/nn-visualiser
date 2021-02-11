import styled from '@emotion/styled';
import React from 'react';
import './App.css';
import MainPage from './components/MainPage';


const Container = styled("div")`
  display: flex;
  justify-content: center;
  /* align-items: center; */
  margin-top: auto;
  min-height: 100vh;
  min-width: fit-content;
`

function App() {
  return (
    <Container>
      <MainPage
        xDomain={[-8, 8]}
        yDomain={[-8, 8]}
        numCells={100}
      />
    </Container>
  );
}

export default App;
