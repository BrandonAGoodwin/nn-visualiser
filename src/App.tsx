import styled from '@emotion/styled';
import React from 'react';
import './App.css';
import MainPage from './components/MainPage';

const Container = styled("div")`
  background: rgb(255,118,97);
  background: linear-gradient(207deg, rgba(255,118,97,1) 0%, rgba(34,55,129,1) 100%);
  min-height: 100vh;
  min-width: 100vw;
  height: auto;
  width: auto;
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
