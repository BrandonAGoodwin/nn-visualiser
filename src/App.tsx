import styled from '@emotion/styled';
import React from 'react';
import './App.css';
import MainPage from './components/MainPage';

const Container = styled("div")`
  background: rgb(121,9,92);
  background: linear-gradient(41deg, rgba(121,9,92,1) 35%, rgba(0,212,255,1) 100%);
  min-height: 100vh;
  height: auto;
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
