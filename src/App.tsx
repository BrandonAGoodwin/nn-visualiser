import styled from '@emotion/styled';
import React from 'react';
import './App.css';
import MainPage from './components/MainPage';


const Container = styled("div")`
  /* background: rgb(255,118,97);
  background: linear-gradient(207deg, rgba(255,118,97,1) 0%, rgba(34,55,129,1) 100%); */
  /* overflow-x: auto; */
  /* min-height: 100vh;
  min-width: 100vw; 
  background-attachment: fixed;
  top: 0;
  bottom: auto;
  left: 0;
  right: 0;
  position: absolute; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* min-width: calc(100vw - 10px); */
  min-width: fit-content;
  /* overflow-x: ; */
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
